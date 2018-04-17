import { DEFAULT_SET } from "./constants/constants";
import { onTyping } from "./plugins";
import { setFavicon } from "./utilities/setFavicon";
import { getSettings } from "./utilities/chromeHelpers";


init();


async function init() {
  const [ settings ] = await Promise.all([
    getSettings(),
    new Promise(res => addEventListener("load", res)),
  ]);

  setFavicon(DEFAULT_SET.siteDefault, settings);
  if (settings.onTyping) onTyping(DEFAULT_SET.siteDefault);
}
