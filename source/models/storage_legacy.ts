import type { Favicon } from './favicon.ts';
import type { Settings } from './settings.ts';

import { AUTOSELECTOR_VERSION } from '../utilities/favicon_autoselector.ts';
import { emoji } from './emoji.ts';
import { createFavicon } from './favicon.ts';
import { DEFAULT_SETTINGS } from './settings.ts';

/**
 * Storage from Favioli V1
 * Includes tools for migration
 */
export interface SettingsV1 {
  flagReplaced: boolean;
  overrideAll: boolean;
  overrides: EmojiV1[];
  skips: string[];
}

export interface EmojiV1 {
  emoji: string | {
    colons: string;
    emoticons: string[];
    id: string;
    name: string;
    native: string;
    short_names: string[];
    skin: null;
    unified: string;
  };
  filter: string;
}

export const LEGACY_STORAGE_KEYS = [
  'flagReplaced',
  'overrideAll',
  'overrides',
  'skips',
];

export function isSettingsV1(
  settings: unknown,
): settings is SettingsV1 {
  if (typeof settings !== 'object' || settings == null) return false;
  return (
    'flagReplaced' in settings ||
    'overrideAll' in settings ||
    'overrides' in settings ||
    'skips' in settings
  );
}

export function migrateStorageFromV1(legacySettings: SettingsV1): Settings {
  const settings = { ...DEFAULT_SETTINGS };

  settings.features = {
    enableAutoselectorIncludeCountryFlags: false,
    enableFaviconAutofill: true,
    enableOverrideAll: legacySettings.overrideAll,
    enableOverrideIndicator: legacySettings.flagReplaced,
    enableSiteIgnore: Boolean(legacySettings?.skips?.length),
  };

  settings.siteList = (legacySettings?.overrides || [])
    .map((legacyFavicon): Favicon => {
      const emojiInput = typeof legacyFavicon.emoji === 'string'
        ? emoji.infoByCode(legacyFavicon.emoji)
        : emoji.infoByCode(legacyFavicon.emoji.native);
      return createFavicon(legacyFavicon.filter, emojiInput);
    });

  settings.ignoreList = (legacySettings?.skips || [])
    .map((skip) => createFavicon(skip));

  settings.autoselectorVersion = AUTOSELECTOR_VERSION.FAVIOLI_LEGACY;

  return settings;
}
