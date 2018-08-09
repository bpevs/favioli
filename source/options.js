import debounce from "lodash.debounce";
import { getSettings, setSettings } from "./utilities/chromeHelpers";
import { createEmojiSelector } from "./utilities/emojiSelector";
import { isRegexString } from "./utilities/isRegexString";


const el = {
  emojiSelectors: [],
  overrides: document.getElementsByClassName("overrides")[0],
  status: document.getElementById("status"),
};

const DEFAULT_EMOJI = "😀";
const DEFAULT_FILTER = "";
var overrides = null;

document.addEventListener("DOMContentLoaded", restore_options);
document.getElementById("save").addEventListener("click", save_options);


async function save_options() {
  const success = await setSettings({
    overrides: overrides.slice(0, overrides.length - 1),
  });

  // Update status to let user know options were saved.
  el.status.textContent = "Options saved.";
  setTimeout(() => el.status.textContent = "", 750);

  (browser || chrome).runtime.sendMessage("updated:settings");
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
async function restore_options() {
  const settings = await getSettings();

  overrides = settings.overrides.concat([ {
    emoji: DEFAULT_EMOJI,
    filter: DEFAULT_FILTER,
  } ]);
  overrides.forEach(addOverride);
}

function addOverride(override) {
  const { emoji, filter } = override;
  const overrideEl = createEmojiSelector(filter, emoji);
  const [ urlFilterEl, emojiEl, deleteEl ] = overrideEl.children;

  el.emojiSelectors.push(emojiEl);
  el.overrides.appendChild(overrideEl);
  urlFilterEl.style.color = isRegexString(urlFilterEl.value) ? "green" : "black";

  deleteEl.addEventListener("click", () => {
    const index = overrides.indexOf(override);
    overrideEl.remove();
    el.emojiSelectors.splice(index, 1);
    overrides.splice(index, 1);
  });

  urlFilterEl.addEventListener("input", debounce(updated.bind(this), 100));
  emojiEl.addEventListener("change", debounce(updated.bind(this), 100));

  function updated() {
    const index = overrides.indexOf(override);
    const shouldAdd = index === (overrides.length - 1);
    const emoji = emojiEl.attributes.value.value;
    const filter = urlFilterEl.value;

    if (shouldAdd) {
      const emptyOverride = {
        emoji: DEFAULT_EMOJI,
        filter: DEFAULT_FILTER,
      };
      overrides.push(emptyOverride);
      el.emojiSelectors.push(addOverride(emptyOverride));
    }

    if (filter !== overrides[index].filter) {
      overrides[index].filter = filter;
      urlFilterEl.style.color = isRegexString(filter) ? "green" : "black";
    }

    if (emoji !== overrides[index].emoji) {
      overrides[index].emoji = emoji;
    }
  }

  return emojiEl;
}
