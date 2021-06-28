/**
 * Content Script
 * The script that runs on-page and replaces favicons.
 */

import {
  getOptions,
  onRuntimeMessage,
  sendRuntimeMessage,
} from "./utilities/browserHelpers/browserHelpers";
import {
  appendFaviconLink,
  removeAllFaviconLinks,
} from "./utilities/faviconHelpers/faviconHelpers";

getOptions().then(() => {
  onRuntimeMessage(updateFavicon);
  sendRuntimeMessage(null, "updated:tab");
});

/**
 * Attempt to add a favicon to the current site
 * @param {any} options
 */
function updateFavicon({ name, shouldOverride }) {
  if (shouldOverride) removeAllFaviconLinks();

  appendFaviconLink(name, shouldOverride);
}
