import debounce from "lodash.debounce";
import { DEFAULT_SET } from "./constants/constants";
import { getSettings, getTab } from "./utilities/chromeHelpers";

init();

async function init() {
  const settings = await getSettings();
  const onUpdated = debounce(function (tabId, options, tab) {
    setFavicon(tabId, options, tab, settings);
  }, 100);

  chrome.tabs.onUpdated.addListener(onUpdated);
}

async function setFavicon(tabId, options, tab, settings) {
  if (tab.status !== "complete") return;
  if (!settings.replaceAll && tab.favIconUrl) return;

  const url = new URL(tab.url);
  chrome.tabs.connect(tabId, {
    frameId: 0,
    name: DEFAULT_SET.getEmojiFromHost(url.host),
  });
}
