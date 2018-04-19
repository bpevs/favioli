import { onTyping } from "./plugins";
import { getSettings } from "./utilities/chromeHelpers";
import { appendFaviconLink, removeAllFaviconLinks } from "./utilities/faviconHelpers";


const pageLoaded = new Promise(res => addEventListener("load", res));
init();


async function init() {
  const [ settings ] = await Promise.all([ getSettings() ]);

  let typingInitialized = false;
  chrome.runtime.onMessage.addListener(updateFavicon);
  chrome.runtime.sendMessage(null, "updated:tab");

  function updateFavicon({ name }) {
    if (settings.replaceAll) removeAllFaviconLinks();

    appendFaviconLink(name);

    if (!typingInitialized && settings.onTyping) {
      onTyping(name);
      typingInitialized = true;
    };
  }
}
