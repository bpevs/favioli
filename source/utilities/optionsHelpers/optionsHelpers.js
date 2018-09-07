import debounce from "lodash.debounce";
import { getOptions, setOptions } from "../chromeHelpers/chromeHelpers";
import { createEmojiSelector } from "../emojiSelector/emojiSelector";
import { isRegexString } from "../isRegexString/isRegexString";


// Defaults for when we create a new emoji selector
const DEFAULT_EMOJI = "😀";
const DEFAULT_FILTER = "";


// UI Elements on options.html
const el = {
  emojiSelectors: [],
  navLinks: Array.from(document.getElementsByClassName("navlink")),
  pages: Array.from(document.getElementsByClassName("page")),
  overrides: document.getElementsByClassName("override-inputs")[0],
  settings: document.getElementsByClassName("settings")[0],
  status: document.getElementById("status"),
};


/**
 * Add an emoji override UI element from an emoji/filter pair. If someone starts
 * to type a filter, we should create another override.
 * @param {object} override
 * @param {Array<object>} overrides
 */
export function appendOverride(override, overrides) {
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
      el.emojiSelectors.push(appendOverride(emptyOverride, overrides));
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


/**
 * Switch between the different pages in the UI, determined by their id.
 * Also, highlight the active page in the navbar
 * @param {string} pageName
 */
export function changeRoute(pageName) {
  el.pages.forEach(page => {
    const matches = page.className.indexOf(pageName) !== -1;
    page.style.display = matches ? "block" : "none";
  });

  el.navLinks.forEach(navLink => {
    const matches = navLink.textContent.toLowerCase().indexOf(pageName) !== -1;
    navLink.className = matches ? "navlink active" : "navlink";
  });
}


/**
 * Save options to Chrome storage, and inform the user that we did.
 * @param {object} options
 */
export async function saveOptions(options) {
  await setOptions(options);

  // Update status to let user know options were saved.
  el.status.textContent = "Successfully saved.";
  setTimeout(() => el.status.textContent = "", 1000);

  chrome.runtime.sendMessage("updated:options");
}


/**
 * Restore options page UI state from the preferences stored in chrome.storage
 */
export async function restoreOptions() {
  const options = await getOptions();
  options.overrides.push({
    emoji: DEFAULT_EMOJI,
    filter: DEFAULT_FILTER,
  });

  if (options.flagReplaced) {
    document.getElementById("flag").setAttribute("checked", options.flagReplaced);
  }

  return options;
}
