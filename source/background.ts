/**
 * Serves as bridge point between popup and content_script.
 */

import type { Tab, TabChangeInfo } from 'browser';
import type { Favicon, Settings } from './types.ts';

import { defaultSettings, STORAGE_KEYS } from './types.ts';
import Autoselector from './utilities/autoselector.ts';
import browserAPI from 'browser';

const autoselector = new Autoselector();
let settings: Settings = defaultSettings;

updateCache();

function selectFavicon(
  url: string | void,
  settings: Settings,
): [Favicon | void, boolean] {
  const { ignoreList = [], siteList = [], features = {} } = settings;

  if (url) {
    const listItemMatchesUrl = ({ site }: { site: string; emoji: string }) =>
      (new RegExp(site)).test(url);

    if (
      features.enableSiteIgnore &&
      ignoreList.some(listItemMatchesUrl)
    ) {
      return [undefined, false];
    }

    const overrides = siteList.filter(listItemMatchesUrl);
    const shouldOverride = Boolean(siteList.length);

    if (shouldOverride && overrides[0]) {
      const [site, emoji] = overrides[0];
      return [{ id: site, emoji }, shouldOverride];
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
  async (tabId: number, _: TabChangeInfo, tab: Tab) => {
    try {
      const [favicon, shouldOverride] = selectFavicon(tab.url, settings) || [];
      if (favicon && tabId) {
        await browserAPI.tabs.sendMessage(tabId, { favicon, shouldOverride });
      }
    } catch (e) {
      console.error(e);
    }
  },
);

async function updateCache() {
  const storedSettings: Settings = await browserAPI.storage.sync.get(
    STORAGE_KEYS,
  ) as Settings;
  if (storedSettings) settings = storedSettings;
}
