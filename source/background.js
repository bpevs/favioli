import { DEFAULT_SET } from "./constants";
import { onTyping } from "./plugins";
import { setFavicon } from "./utilities/setFavicon";


addEventListener("load", () => {
  setFavicon(DEFAULT_SET.siteDefault);
  onTyping();
});
