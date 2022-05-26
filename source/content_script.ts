/// <reference lib="dom" />

/**
 * Check siteList and ignoreList from chrome storage
 * Use those to determine if we should override favicon
 * Override favicon if applicable
 */
import type { Settings } from './types.ts';
import { defaultSettings, STORAGE_KEYS } from './types.ts';
import Autoselector from './utilities/autoselector.ts';
import browserAPI from './utilities/browser_api.ts';
import {
  appendFaviconLink,
  removeAllFaviconLinks,
} from './utilities/favicon_helpers.ts';
const autoselector = new Autoselector();

browserAPI.storage.sync.get(
  STORAGE_KEYS,
  (result: Settings = defaultSettings) => {
    const hasOverride = (result?.siteList || [])
      .some((site: string) => location.href.match(site));

    if (result.features.enableFaviconAutofill) {
      const autoselected = autoselector.selectFavicon(location.host);
      appendFaviconLink(autoselected.emoji || '😀');
    }

    if (hasOverride) {
      removeAllFaviconLinks();
      appendFaviconLink('😀', { shouldOverride: true });
    }
  },
);
