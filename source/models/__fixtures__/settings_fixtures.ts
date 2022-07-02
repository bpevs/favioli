import type { Settings } from '../settings.ts';
import type { SettingsV1 } from '../storage_legacy.ts';

import { emoji } from '../emoji.ts';
import { createFavicon } from '../favicon.ts';

export const v0: SettingsV1 = {
  flagReplaced: true,
  overrideAll: false,
  overrides: [
    {
      emoji: '😍',
      filter: 'hello',
    },
    {
      emoji: '😃',
      filter: 'goodbye',
    },
    {
      emoji: '🤩',
      filter: 'sweet lahd',
    },
  ],
  skips: [
    'hahahahh',
  ],
};

export const v1: SettingsV1 = {
  flagReplaced: true,
  overrideAll: false,
  overrides: [
    {
      emoji: {
        colons: ':heart_eyes:',
        emoticons: [],
        id: 'heart_eyes',
        name: 'Smiling Face with Heart-Shaped Eyes',
        native: '😍',
        short_names: [
          'heart_eyes',
        ],
        skin: null,
        unified: '1f60d',
      },
      filter: 'hello',
    },
    {
      emoji: {
        colons: ':smiley:',
        emoticons: [
          '=)',
          '=-)',
        ],
        id: 'smiley',
        name: 'Smiling Face with Open Mouth',
        native: '😃',
        short_names: [
          'smiley',
        ],
        skin: null,
        unified: '1f603',
      },
      filter: 'goodbye',
    },
    {
      emoji: {
        colons: ':star-struck:',
        emoticons: [],
        id: 'star-struck',
        name: 'Grinning Face with Star Eyes',
        native: '🤩',
        short_names: [
          'star-struck',
          'grinning_face_with_star_eyes',
        ],
        skin: null,
        unified: '1f929',
      },
      filter: 'sweet lahd',
    },
  ],
  skips: [
    'hahahahh',
  ],
};

export const v2: Settings = {
  autoselectorVersion: 'FAVIOLI_LEGACY',
  frequentlyUsed: [],
  customEmojiIds: [],
  features: {
    enableAutoselectorIncludeCountryFlags: false,
    enableFaviconAutofill: true,
    enableOverrideAll: false,
    enableSiteIgnore: true,
    enableOverrideIndicator: true,
  },
  ignoreList: [
    createFavicon('hahahahh'),
  ],
  siteList: [
    createFavicon('hello', emoji.infoByCode('😍')),
    createFavicon('goodbye', emoji.infoByCode('😃')),
    createFavicon('sweet lahd', emoji.infoByCode('🤩')),
  ],
  version: '2.0.0',
};
