import { onTyping } from "./plugins";
import { getSettings } from "./utilities/chromeHelpers";
import { appendFaviconLink, createFavicon, removeAllFaviconLinks } from "./utilities/faviconHelpers";

init();

async function init() {
  const [ settings ] = await Promise.all([
    getSettings(),
    new Promise(res => addEventListener("load", res)),
  ]);
  
  let typingInitialized = false;
  chrome.runtime.onConnect.addListener(({ name }) => {
    if (settings.replaceAll) removeAllFaviconLinks();

    appendFaviconLink(name);

    if (!typingInitialized && settings.onTyping) {
      onTyping(name);
      typingInitialized = true;
    };
  });
}
