import { EMOJI_SIZE, MIME_IMAGE } from "../constants";
import { hasIconLink } from "./validateFavicon";
import { createEmojiUrl } from "./createEmojiUrl";

// Link setup
const link = document.createElement("link");
link.rel = "icon";
link.type = MIME_IMAGE;
link.setAttribute("sizes", `${EMOJI_SIZE}x${EMOJI_SIZE}`);


export function setFavicon(emoji) {
  if (!hasIconLink()) {
    const documentHead = document.getElementsByTagName("head")[0];
    link.href = createEmojiUrl(emoji);
    documentHead.appendChild(link);
  }
}
