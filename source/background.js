import debounce from "lodash.debounce";
import { DEFAULT_SET } from "./constants/constants";
import { getSettings, getTab } from "./utilities/chromeHelpers";
import { EmojiSet } from "./utilities/EmojiSet";

var settings;
var emojis;

init().then(() => {
  const onUpdated = debounce(function (tabId, options, tab) {
    if (tab.status === "complete") setFavicon(tabId, tab);
  }, 100);
  
  chrome.tabs.onUpdated.addListener(onUpdated);
});

chrome.runtime.onMessage.addListener(function (message, details) {
  const tab = details.tab;
  if (message === "updated:tab") setFavicon(tab.id, tab);
  if (message === "updated:settings") init();
});

async function init() {
  settings = await getSettings();
  emojis = new EmojiSet(DEFAULT_SET);
}

async function setFavicon(tabId, tab) {
  if (!settings.replaceAll && tab.favIconUrl) return;

  const url = new URL(tab.url);
  const name = emojis.getEmojiFromHost(url.host);
  const frameId = 0; // Don't replace iframes
  chrome.tabs.sendMessage(tabId, { frameId, name });
}
