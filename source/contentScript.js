import { getSettings } from "./utilities/chromeHelpers";
import { appendFaviconLink, removeAllFaviconLinks } from "./utilities/faviconHelpers";

getSettings().then(settings => {
  chrome.runtime.onMessage.addListener(updateFavicon);
  chrome.runtime.sendMessage(null, "updated:tab");

  function updateFavicon({ name, shouldOverride }) {
    if (shouldOverride) removeAllFaviconLinks();

    appendFaviconLink(name);
  }
});
