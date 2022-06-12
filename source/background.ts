/**
 * Serves as bridge point between popup and content_script.
 */

import type { Favicon, Settings } from './types.ts';
import type {
  Tab,
  TabChangeInfo,
} from './utilities/browser_api_interface/mod.ts';
import { defaultSettings, STORAGE_KEYS } from './types.ts';
import Autoselector from './utilities/autoselector.ts';
import browserAPI from './utilities/browser_api.ts';

const autoselector = new Autoselector();
let settings: Settings = defaultSettings;

updateCache();

function selectFavicon(
  url: string | void,
  settings: Settings,
): [Favicon | void, boolean] {
  const { ignoreList = [], siteList = [], features = {} } = settings;

  if (url) {
    const listItemMatchesUrl = (site: string) => (new RegExp(site)).test(url);

    if (
      features.enableSiteIgnore &&
      ignoreList.some(listItemMatchesUrl)
    ) {
      return [undefined, false];
    }

    const shouldOverride = siteList.some(listItemMatchesUrl);

    if (shouldOverride) {
      return [{ id: 'smile', emoji: '😀' }, shouldOverride];
    } else if (features.enableFaviconAutofill) {
      const { host } = new URL(url);
      return [autoselector.selectFavicon(host), shouldOverride];
    }
  }

  return [undefined, false];
}

browserAPI.storage.onChanged.addListener(async () => {
  await updateCache();
});

browserAPI.tabs.onUpdated.addListener(
  (tabId: number, _: TabChangeInfo, tab: Tab) => {
    const [favicon, shouldOverride] = selectFavicon(tab.url, settings) || [];
    if (favicon) {
      browserAPI.tabs.sendMessage(tabId, { favicon, shouldOverride });
    }
  },
);

async function updateCache() {
  try {
    const storedSettings: Settings = await browserAPI.storage.sync.get(
      STORAGE_KEYS,
    ) as Settings;
    if (storedSettings) settings = storedSettings;
  } catch {}
}
