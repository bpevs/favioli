import { getOptions, onRuntimeMessage, sendRuntimeMessage } from "./utilities/browserHelpers/browserHelpers"
import { appendFaviconLink, removeAllFaviconLinks } from "./utilities/faviconHelpers/faviconHelpers"

getOptions().then(() => {
  onRuntimeMessage(updateFavicon)
  sendRuntimeMessage(null, "updated:tab")
})

function updateFavicon({ name, shouldOverride }) {
  if (shouldOverride) removeAllFaviconLinks()

  appendFaviconLink(name, shouldOverride)
}
