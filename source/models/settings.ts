import type { BrowserStorage } from '../hooks/use_browser_storage.ts';
import type { AutoselectorVersion } from '../utilities/favicon_autoselector.ts';

import { createContext } from 'preact';

import manifest from '../manifest.json' assert { type: 'json' };
import { AUTOSELECTOR_VERSION } from '../utilities/favicon_autoselector.ts';
import { Favicon } from './favicon.ts';

export const SETTINGS_KEY = 'settings';

export interface Settings {
  version: string;
  autoselectorVersion: AutoselectorVersion;

  siteList: Favicon[];
  ignoreList: Favicon[];
  frequentlyUsed: Favicon[];
  customEmojiIds: string[];

  features: {
    enableAutoselectorIncludeCountryFlags: boolean;
    enableFaviconAutofill: boolean;
    enableSiteIgnore: boolean;
    enableOverrideAll: boolean;
  };
}

export const DEFAULT_SETTINGS: Settings = {
  version: manifest.version,
  autoselectorVersion: AUTOSELECTOR_VERSION.UNICODE_12,

  siteList: [],
  ignoreList: [],
  customEmojiIds: [],
  frequentlyUsed: [],

  features: {
    enableAutoselectorIncludeCountryFlags: false,
    enableFaviconAutofill: true,
    enableSiteIgnore: false,
    enableOverrideAll: false,
  },
};

export const SettingsContext = createContext<BrowserStorage<Settings>>({
  loading: true,
  cache: DEFAULT_SETTINGS,
  setCache: () => {},
  saveCacheToStorage: async () => {},
  saveToStorageBypassCache: async () => {},
});
