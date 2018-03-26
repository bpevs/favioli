import { DEFAULT_SET, SETTINGS } from "./constants/constants";
import { onTyping } from "./plugins";
import { setFavicon } from "./utilities/setFavicon";


Promise.all([
  SETTINGS,
  new Promise((resolve) => addEventListener("load", resolve)),
]).then(function ([settings]) {
  setFavicon(DEFAULT_SET.siteDefault, settings);
  onTyping(DEFAULT_SET.siteDefault);
});
