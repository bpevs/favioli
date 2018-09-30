import { getOptions } from "./utilities/chromeHelpers/chromeHelpers";
import { appendFaviconLink, removeAllFaviconLinks } from "./utilities/faviconHelpers/faviconHelpers";
const { runtime } = (typeof chrome ? chrome : browser);

getOptions().then(() => {
  runtime.onMessage.addListener(updateFavicon);
  runtime.sendMessage(null, "updated:tab");
});

function updateFavicon({ name, shouldOverride }) {
  if (shouldOverride) removeAllFaviconLinks();

  appendFaviconLink(name, shouldOverride);
}
