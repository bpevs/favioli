/**
 * Serves as bridge point between popup and content_script.
 */

import type { Tab, TabChangeInfo } from 'browser';
import type { Settings, SettingsV1 } from './utilities/settings.ts';

import browserAPI from 'browser';
import {
  DEFAULT_SETTINGS,
  isV1Settings,
  LEGACY_STORAGE_KEYS,
  migrateFromV1,
  STORAGE_KEYS,
} from './utilities/settings.ts';
import FaviconData from './utilities/favicon_data.ts';
import Autoselector from './utilities/autoselector.ts';

const autoselector = new Autoselector();
let settings: Settings = DEFAULT_SETTINGS;

syncSettings();
browserAPI.storage.onChanged.addListener(syncSettings);

// Send tab a favicon
browserAPI.tabs.onUpdated.addListener(
  async (tabId: number, _: TabChangeInfo, tab: Tab) => {
    try {
      const [favicon, shouldOverride] = selectFavicon(tab.url, settings) || [];
      const overrideText = shouldOverride ? 'Override' : 'Append';
      console.log(`${overrideText} favicon, tab ${tabId}:`, favicon);
      if (favicon && tabId) {
        await browserAPI.tabs.sendMessage(tabId, { favicon, shouldOverride });
      }
    } catch (e) {
      console.log(e);
    }
  },
);

async function syncSettings() {
  const storedSettings: Settings | SettingsV1 = await browserAPI.storage.sync
    .get(STORAGE_KEYS) as Settings | SettingsV1;

  if (!storedSettings) return;

  if (isV1Settings(storedSettings)) {
    settings = migrateFromV1(storedSettings);
    await browserAPI.storage.sync.remove(LEGACY_STORAGE_KEYS);
    await browserAPI.storage.sync.set(settings);
  } else {
    settings = storedSettings;
  }
}

function listItemMatchesUrl(favicon: FaviconData, url: string) {
  if (!favicon || !favicon.matcher) return false;
  return new RegExp(favicon.matcher || '^$').test(url);
}

/**
 * Override Priority
 *
 * 1. Ignore list (always ignore if ignore list enabled)
 * 2. Site list (if matched in site list, user manually added)
 * 3. Autofill (if autofill is enabled)
 * 4. Ignore (autofill NOT enabled, user hasn't added to sitelist)
 */
function selectFavicon(
  url: string | void,
  settings: Settings,
): [FaviconData | void, boolean] {
  const { ignoreList = [], siteList = [], features = {} } = settings;
  if (!url) return [undefined, false]; // Should never happen...

  const shouldIgnore = features.enableSiteIgnore &&
    ignoreList.some((item) => listItemMatchesUrl(item, url));
  if (shouldIgnore) return [undefined, false];

  const favicons = siteList.filter((item) => listItemMatchesUrl(item, url));
  const isInSiteList = Boolean(favicons.length);
  if (isInSiteList) {
    return [favicons[0], true];
  } else if (features.enableFaviconAutofill) {
    return [autoselector.selectFavicon(url), !!features.enableOverrideAll];
  }

  return [undefined, false];
}
