import { getOptions, isBrowser } from "./utilities/chromeHelpers/chromeHelpers";
import { appendFaviconLink, removeAllFaviconLinks } from "./utilities/faviconHelpers/faviconHelpers";
const { runtime } = (isBrowser("CHROME") ? chrome : browser);

getOptions().then(() => {
  runtime.onMessage.addListener(updateFavicon);
  runtime.sendMessage(null, "updated:tab");
});

function updateFavicon({ name, shouldOverride }) {
  if (shouldOverride) removeAllFaviconLinks();

  appendFaviconLink(name, shouldOverride);
}
