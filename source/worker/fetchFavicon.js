import { setFavicon } from "../utilities/setFavicon";


// Scan document for statically-defined favicons
const allLinks = Array.prototype.slice.call(document.getElementsByTagName("link"), 0);
const lastTextIconLink = allLinks.filter(isTextIconLink).pop();
const mime_text_regex = /^\s*(?:text\/plain)\s*(?:$|;)/i;


if (lastTextIconLink) {
  const request = new XMLHttpRequest;
  const uri = lastTextIconLink.href.trim().replace(
    /^data:(;base64)?,/,
    "data:text/plain;charset=utf-8$1,"
  );

  request.open("GET", uri);

  request.addEventListener("load", () => {
    if (request.readyState === request.DONE && request.status === 200) {
      const emoji = request.responseText;
      setFavicon(emoji);
    }
  });

  request.send();
}


function isTextIconLink(link) {
  return link.rel.toLowerCase() === "icon" && mime_text_regex.test(link.type);
}
