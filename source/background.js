import debounce from "lodash.debounce";
import memoize from "lodash.memoize";
import { DEFAULT_OVERRIDES, DEFAULT_SET } from "./constants/constants";
import { getSettings, getTab } from "./utilities/chromeHelpers";
import { EmojiSet } from "./utilities/EmojiSet";
import { isRegexString } from "./utilities/isRegexString";


var settings; // Favioli Settings
var emojis; // Auto-replacement Emoji Set

// After we get our settings, start listening for url updates
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

  // If our settings change, re-run init to get new settings
  if (message === "updated:settings") init();
});


/**
 *  Determines whether tab has native favIcon
 *  @param {object} host host of the tab
 *  @param {object} tab Chrome tab we're visiting
 * .@return {boolean} Whether a website has a native favIcon
 */
const hasFavicon = memoize(function (host, tab) {
  return Boolean(
    tab.favIconUrl &&
    tab.favIconUrl.indexOf("http") > -1
  );
}, host => host);


/**
 *  If the url has an override, return it. Otherwise, return ""
 *  @param {URL} url of the current site
 *  @param {object} settings favioli settings
 * .@return {string} emoji string or empty string if no
 */
function getOverride(url, settings) {
  if (!settings) return "";

  for (let i = 0; i <= settings.overrides.length; i++) {
    if (!settings.overrides[i]) return "";

    const { emoji, filter } = settings.overrides[i];
    if (!filter) return;

    if (!isRegexString(filter) && url.host.indexOf(filter) !== -1) {
      return emoji;
    }

    const filterRegex = new RegExp(filter.slice(1, filter.length - 1));
    if (url.href.match(filterRegex)) return emoji;
  }

  return "";
}

/**
 *  Fetch extension settings from Chrome,
 *  and determine the EmojiSet to use for auto-replacement
 */
async function init() {
  settings = await getSettings();
  emojis = new EmojiSet(DEFAULT_SET);
}

/**
 *  If we should set a favicon, send a message to the contentScript
 *  @param {number} tabId Chrome tab we're visiting
 *  @param {object} tab Chrome tab we're visiting
 */
async function tryToSetFavicon(tabId, tab) {
  const url = new URL(tab.url);
  const frameId = 0; // Don't replace iframes

  const overrideEmoji = getOverride(url, settings);
  const shouldOverride = Boolean(overrideEmoji || settings.overrideAll)

  if (shouldOverride || !hasFavicon(url.host, tab)) {
    const name = overrideEmoji || emojis.getEmojiFromHost(url.host);
    chrome.tabs.sendMessage(tabId, { frameId, shouldOverride, name });
  }
}
