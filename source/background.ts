import type { Tab, TabChangeInfo } from 'browser';
import type { Settings } from './models/settings.ts';
import type { SettingsV1 } from './models/storage_legacy.ts';

import browserAPI from 'browser';

import { getEmoji } from './models/emoji.ts';
import { DEFAULT_SETTINGS, SETTINGS_KEY } from './models/settings.ts';
import {
  isSettingsV1,
  LEGACY_STORAGE_KEYS,
  migrateStorageFromV1,
} from './models/storage_legacy.ts';
import Autoselector from './utilities/favicon_autoselector.ts';
import selectFavicon from './utilities/favicon_selector.ts';

let settings: Settings;
let autoselect: Autoselector | undefined;

syncSettings();
browserAPI.storage.onChanged.addListener(syncSettings);

// Send tab a favicon
browserAPI.tabs.onUpdated.addListener(
  async (tabId: number, _: TabChangeInfo, { url }: Tab) => {
    if (!tabId || !url) return;
    if (!settings) await syncSettings();

    const [favicon, shouldOverride] = selectFavicon(url, settings, autoselect);

    if (!favicon?.emojiId) return;

    const emoji = await getEmoji(favicon.emojiId);
    if (!emoji) return;

    try {
      await browserAPI.tabs.sendMessage(tabId, {
        emoji,
        shouldOverride,
        enableOverrideIndicator: settings.features.enableOverrideIndicator,
      });
    } catch (e) {
      console.log(e);
    }
  },
);

type StoredSettings = {
  settings: Settings;
};

async function syncSettings() {
  const storage: StoredSettings | SettingsV1 = await browserAPI.storage.sync
    .get([SETTINGS_KEY, ...LEGACY_STORAGE_KEYS]) as StoredSettings | SettingsV1;

  if (isSettingsV1(storage)) {
    console.info('Version < 2 versions found', storage);
    settings = migrateStorageFromV1(storage);
    console.info('Migrating to', settings);
    await browserAPI.storage.sync.remove(LEGACY_STORAGE_KEYS);
    await browserAPI.storage.sync.set({ settings });
  } else if (
    !storage?.settings ||
    Object.keys(storage.settings).length !==
      Object.keys(DEFAULT_SETTINGS).length
  ) {
    settings = DEFAULT_SETTINGS;
  } else {
    settings = storage.settings;
  }

  const { features, autoselectorVersion } = settings;
  const includeFlags = features.enableAutoselectorIncludeCountryFlags;

  if (!features.enableFaviconAutofill) {
    autoselect = undefined;
  } else if (
    !autoselect || autoselectorVersion !== autoselect.version ||
    includeFlags !== autoselect.includeFlags
  ) {
    autoselect = new Autoselector(autoselectorVersion, { includeFlags });
  }
}
