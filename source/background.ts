/**
 * Serves as bridge point between popup and content_script.
 */

import type { Settings } from './types.ts';
import type {
  Tab,
  TabChangeInfo,
} from './utilities/browser_api_interface/mod.ts';
import { defaultSettings, STORAGE_KEYS } from './types.ts';
import Autoselector from './utilities/autoselector.ts';
import browserAPI from './utilities/browser_api.ts';

const autoselector = new Autoselector();
const settings: Settings =
  (await browserAPI.storage.sync.get(STORAGE_KEYS) as Settings | void) ||
  defaultSettings;

const { siteList = [], features = {} } = settings || defaultSettings;

browserAPI.tabs.onUpdated.addListener(
  (tabId: number, _: TabChangeInfo, tab: Tab) => {
    if (!tab.url) return;

    const shouldOverride = (siteList || []).some(
      (site: string) => (new RegExp(site)).test(tab.url || ''),
    );

    if (shouldOverride) {
      const favicon = { id: 'smile', emoji: '😀' };
      browserAPI.tabs.sendMessage(tabId, { favicon, shouldOverride: true });
    } else if (features.enableFaviconAutofill) {
      const favicon = autoselector.selectFavicon(new URL(tab.url).host);
      browserAPI.tabs.sendMessage(tabId, { favicon, shouldOverride });
    }
  },
);
