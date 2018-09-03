import debounce from "lodash.debounce";
import { getOptions, setOptions } from "./utilities/chromeHelpers";
import { createEmojiSelector } from "./utilities/emojiSelector";
import { isRegexString } from "./utilities/isRegexString";


const el = {
  emojiSelectors: [],
  navLinks: Array.from(document.getElementsByClassName("navlink")),
  overrides: document.getElementsByClassName("override-inputs")[0],
  pages: Array.from(document.getElementsByClassName("page")),
  settings: document.getElementsByClassName("settings")[0],
  status: document.getElementById("status"),
};

const DEFAULT_EMOJI = "😀";
const DEFAULT_FILTER = "";
var overrides = null;
const settings = {};

changeRoute(window.location.hash.substr(1) || "overrides");
document.addEventListener("DOMContentLoaded", restore_options);
Array.from(document.getElementsByClassName("save")).forEach(save => {
  save.addEventListener("click", save_options);
});

el.navLinks.forEach(navLink => {
  const pageName = navLink.textContent.toLowerCase();
  navLink.addEventListener("click", () => changeRoute(pageName));
});

function changeRoute(pageName) {
  el.pages.forEach(page => {
    const matches = page.className.indexOf(pageName) !== -1;
    page.style.display = matches ? "block" : "none";
  });

  el.navLinks.forEach(navLink => {
    const matches = navLink.textContent.toLowerCase().indexOf(pageName) !== -1;
    navLink.className = matches ? "navlink active" : "navlink";
  });
}

async function save_options() {
  await setOptions({
    overrides: overrides.slice(0, overrides.length - 1),
    flagReplaced: document.getElementById("flag").checked,
  });

  // Update status to let user know options were saved.
  el.status.textContent = "Successfully saved.";
  setTimeout(() => el.status.textContent = "", 1000);

  chrome.runtime.sendMessage("updated:options");
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
async function restore_options() {
  const options = await getOptions();
  overrides = options.overrides.concat([{
    emoji: DEFAULT_EMOJI,
    filter: DEFAULT_FILTER,
  }]);

  overrides.forEach(addOverride);
  if (options.flagReplaced) {
    document.getElementById("flag").setAttribute("checked", options.flagReplaced);
  }
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
