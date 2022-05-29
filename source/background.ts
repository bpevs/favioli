/**
 * Serves as bridge point between popup and content_script.
 */

import type { Settings, Tab } from './types.ts';
import { defaultSettings, STORAGE_KEYS } from './types.ts';
import Autoselector from './utilities/autoselector.ts';
import browserAPI from './utilities/browser_api.ts';

// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/onUpdated
interface Options {
  urls: string[];
  properties: string[];
  tabId: number;
  windowId: number;
}

const autoselector = new Autoselector();

browserAPI.storage.sync.get(
  STORAGE_KEYS,
  (settings: Settings = defaultSettings) => {
    const { siteList = [], features = {} } = settings || defaultSettings;

    browserAPI.tabs.onUpdated.addListener(
      (tabId: string, _: Options, tab: Tab) => {
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
  },
);
