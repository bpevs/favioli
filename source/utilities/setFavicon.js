import { EMOJI_SIZE, MIME_IMAGE } from "../constants/constants";
import { hasIconLink, isIcon } from "./validateFavicon";
import { createEmojiUrl } from "./createEmojiUrl";


let shouldSetSingle;
let shouldSetAll;

const documentHead = document.getElementsByTagName("head")[0];
const link = document.createElement("link");
link.rel = "icon";
link.type = MIME_IMAGE;
link.setAttribute("sizes", `${EMOJI_SIZE}x${EMOJI_SIZE}`);


export function setFavicon(emoji, settings) {
  if (shouldSetAll == null) {
    shouldSetSingle = settings.replaceAll || !hasIconLink();
    shouldSetAll = settings.replaceAll;
  }

  if (shouldSetAll) {
    const emojiUrl = createEmojiUrl(emoji);
    const allIcons = Array.prototype
      .slice.call(document.getElementsByTagName("link"), 0)
      .filter(isIcon);

    if (allIcons.length) {
      allIcons.forEach(link => {
        link.rel = "icon";
        link.href = emojiUrl;
        link.type = MIME_IMAGE;
        link.setAttribute("sizes", `${EMOJI_SIZE}x${EMOJI_SIZE}`);
      });
      shouldSetAll = false;
    }
  }

  if (shouldSetSingle) {
    link.href = createEmojiUrl(emoji);
    documentHead.appendChild(link);
  }
}
