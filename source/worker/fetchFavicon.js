import { setFavicon } from "../utilities/setFavicon";
import { getLastTextIconLink } from "../utilities/validateFavicon";

const lastTextIconLink = getLastTextIconLink();

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
