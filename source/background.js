import debounce from "lodash.debounce";
import { DEFAULT_OVERRIDES, DEFAULT_SET } from "./constants/constants";
import { getOptions, getTab } from "./utilities/chromeHelpers/chromeHelpers";
import { EmojiSet } from "./utilities/EmojiSet/EmojiSet";
import { isRegexString } from "./utilities/isRegexString/isRegexString";


var options; // Favioli Options
var emojis; // Auto-replacement Emoji Set

// After we get our options, start listening for url updates
init().then(() => {
  // If a tab updates, check to see whether we should set a favicon
  chrome.tabs.onUpdated.addListener(debounce((tabId, opts, tab) => {
    tryToSetFavicon(tabId, tab);
  }, 500));
});

chrome.runtime.onMessage.addListener(function (message, details) {
  const tab = details.tab;
  // If we manually say a tab has been updated, try to set favicon
  if (message === "updated:tab") tryToSetFavicon(tab.id, tab);

  // If our options change, re-run init to get new options
  if (message === "updated:options") init();
});


/**
 *  Determines whether tab has native favIcon.
 *  Once a website is set, it should change favicons
 *  @param {object} tab Chrome tab we're visiting
 * .@return {boolean} Whether a website has a native favIcon
 */
const hasFavIcon = function (tab) {
  return Boolean(
    tab.favIconUrl &&
    tab.favIconUrl.indexOf("http") > -1
  );
};


/**
 *  If the url has an override, return it. Otherwise, return ""
 *  @param {object} overrideSet
 *  @param {URL} url of the current site
 *  @param {object} options favioli options
 * .@return {string} emoji string or empty string if no
 */
function getOverride(overrideSet, url, options) {
  if (!options) return "";

  for (let i = 0; i <= overrideSet.length; i++) {
    if (!overrideSet[i]) return "";

    const { emoji, filter } = overrideSet[i];
    if (!filter) return;

    if (!isRegexString(filter) && url.href.indexOf(filter) !== -1) {
      return emoji;
    }

    const filterRegex = new RegExp(filter.slice(1, filter.length - 1));
    if (url.href.match(filterRegex)) return emoji;
  }

  return "";
}

/**
 *  Fetch extension options from Chrome,
 *  and determine the EmojiSet to use for auto-replacement
 */
async function init() {
  options = await getOptions();
  emojis = new EmojiSet(DEFAULT_SET);
}

/**
 *  If we should set a favicon, send a message to the contentScript
 *  @param {number} tabId Chrome tab we're visiting
 *  @param {object} tab Chrome tab we're visiting
 */
function tryToSetFavicon(tabId, tab) {
  const url = new URL(tab.url);
  const frameId = 0; // Don't replace iframes
  const overrideFavIcon = getOverride(options.overrides, url, options);

  const shouldOverride = Boolean(overrideFavIcon || options.overrideAll);
  const shouldSetFavIcon = shouldOverride || !hasFavIcon(tab);

  if (!shouldSetFavIcon) return;

  const name = overrideFavIcon
    || getOverride(DEFAULT_OVERRIDES, url, options)
    || emojis.getEmojiFromHost(url.host);

  chrome.tabs.sendMessage(tabId, { frameId, shouldOverride, name });
}
