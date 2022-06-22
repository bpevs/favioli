import * as emoji from 'emoji';
import manifest from '../manifest.json' assert { type: 'json' };
import FaviconData from './favicon_data.ts';

export interface Settings {
  version: string;
  siteList: FaviconData[];
  ignoreList: FaviconData[];

  features: {
    enableFaviconAutofill?: boolean;
    enableSiteIgnore?: boolean;
    enableOverrideAll?: boolean;
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
  skin: null;
  unified: string;
};

export const DEFAULT_SETTINGS: Settings = {
  version: manifest.version,
  siteList: [],
  ignoreList: [],

  features: {
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
    enableFaviconAutofill: true,
    enableOverrideAll: legacySettings.overrideAll,
    enableSiteIgnore: Boolean(legacySettings?.skips?.length),
  };

  settings.siteList = (legacySettings?.overrides || [])
    .map((legacyFavicon): FaviconData => {
      const emojiInput = typeof legacyFavicon.emoji === 'string'
        ? emoji.infoByCode(legacyFavicon.emoji)
        : emoji.infoByCode(legacyFavicon.emoji.native);
      return new FaviconData(emojiInput, legacyFavicon.filter);
    });

  settings.ignoreList = (legacySettings?.skips || [])
    .map((skip) => new FaviconData(undefined, skip));

  return settings;
}
