import * as emoji from 'emoji';
import manifest from '../manifest.json' assert { type: 'json' };
import { createFaviconDataFromEmoji, FaviconData } from './favicon_data.ts';
import { Emoji } from './emoji.ts';

import { AUTOSELECTOR_VERSION } from './autoselector.ts';

export interface Settings {
  version: string;
  autoselectorVersion: string;

  siteList: FaviconData[];
  ignoreList: FaviconData[];

  emojiDatabase: {
    customEmojis: {
      [description: string]: Emoji;
    };
    frequentlyUsed: Emoji[];
  };

  features: {
    enableAutoselectorIncludeCountryFlags: boolean;
    enableFaviconAutofill: boolean;
    enableSiteIgnore: boolean;
    enableOverrideAll: boolean;
  };
}

/* Legacy Interfaces */
export interface SettingsV1 {
  flagReplaced: boolean;
  overrideAll: boolean;
  overrides: EmojiV1[];
  skips: string[];
}

export interface EmojiV1 {
  emoji: string | EmojiMartEmojiV1;
  filter: string;
}

export type EmojiMartEmojiV1 = {
  colons: string;
  emoticons: string[];
  id: string;
  name: string;
  native: string;
  short_names: string[];
  skin: null;
  unified: string;
};

export const DEFAULT_SETTINGS: Settings = {
  version: manifest.version,
  autoselectorVersion: AUTOSELECTOR_VERSION.UNICODE_12,

  siteList: [],
  ignoreList: [],

  emojiDatabase: {
    customEmojis: {},
    frequentlyUsed: [],
  },

  features: {
    enableAutoselectorIncludeCountryFlags: false,
    enableFaviconAutofill: false,
    enableSiteIgnore: false,
    enableOverrideAll: false,
  },
};

export const LEGACY_STORAGE_KEYS = [
  'flagReplaced',
  'overrideAll',
  'overrides',
  'skips',
];
export const STORAGE_KEYS = Object.freeze(
  Object.keys(DEFAULT_SETTINGS)
    // Legacy settings for migration purposes
    .concat(LEGACY_STORAGE_KEYS),
);

export function parseVersion(version: string): {
  major: number;
  minor: number;
  patch: number;
  descriptor: string;
} {
  if (!version) throw new Error('No Version Detected');

  const [major, minor, patch, ...descriptors] = version.split(/\.|-/);

  if (major == null || minor == null || patch == null) {
    throw new Error(`Error Parsing Version ${version}`);
  }

  return {
    major: Number(major),
    minor: Number(minor),
    patch: Number(patch),
    descriptor: descriptors.join('-') || '',
  };
}

export function isV1Settings(
  settings: Settings | SettingsV1,
): settings is SettingsV1 {
  if (
    'flagReplaced' in settings ||
    'overrideAll' in settings ||
    'overrides' in settings ||
    'skips' in settings
  ) {
    return true;
  } else return false;
}

export function migrateFromV1(legacySettings: SettingsV1): Settings {
  const settings = { ...DEFAULT_SETTINGS };

  settings.features = {
    enableAutoselectorIncludeCountryFlags: false,
    enableFaviconAutofill: true,
    enableOverrideAll: legacySettings.overrideAll,
    enableSiteIgnore: Boolean(legacySettings?.skips?.length),
  };

  settings.siteList = (legacySettings?.overrides || [])
    .map((legacyFavicon): FaviconData => {
      const emojiInput = typeof legacyFavicon.emoji === 'string'
        ? emoji.infoByCode(legacyFavicon.emoji)
        : emoji.infoByCode(legacyFavicon.emoji.native);
      return createFaviconDataFromEmoji(legacyFavicon.filter, emojiInput);
    });

  settings.ignoreList = (legacySettings?.skips || [])
    .map((skip) => createFaviconDataFromEmoji(skip));

  settings.autoselectorVersion = AUTOSELECTOR_VERSION.FAVIOLI_LEGACY;

  return settings;
}
