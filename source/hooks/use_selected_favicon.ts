import type { Emoji } from '../models/emoji.ts';
import type { Favicon } from '../models/favicon.ts';
import type { Settings } from '../models/settings.ts';

import { useEffect, useMemo, useState } from 'preact/hooks';

import { getEmoji } from '../models/emoji.ts';
import Autoselector from '../utilities/favicon_autoselector.ts';
import selectFavicon from '../utilities/favicon_selector.ts';
import { createFaviconURLFromChar } from '../utilities/image_helpers.ts';

/**
 * Get the favicon, emoji, and displayed favicon url for a specific location.
 * Treat as if we are autofilling, and not ignoring sites.
 */
export default function useSelectedFavicon(
  url: string,
  settings?: Settings,
): {
  selectedFavicon: Favicon | null;
  selectedEmoji: Emoji | null;
  selectedFaviconURL: string;
} {
  const { autoselectorVersion, features } = settings || {};
  const includeFlags = Boolean(features?.enableAutoselectorIncludeCountryFlags);

  const [selectedFavicon, setFavicon] = useState<Favicon | null>(null);
  const [selectedEmoji, setEmoji] = useState<Emoji | null>(null);

  const autoselector = useMemo(function () {
    if (!autoselectorVersion) return null;
    return new Autoselector(autoselectorVersion, { includeFlags });
  }, [autoselectorVersion]);

  useEffect(function () {
    if (!url || !settings || !autoselector) return;
    (async () => {
      const features = {
        ...settings.features,
        enableFaviconAutofill: true,
        enableSiteIgnore: false,
      };
      const checkSettings = { ...settings, features };
      const [favicon] = await selectFavicon(url, checkSettings, autoselector);
      const emoji = favicon?.emojiId ? await getEmoji(favicon.emojiId) : null;
      setFavicon(favicon || null);
      setEmoji(emoji || null);
    })();
  }, [autoselector, settings, url]);

  const selectedFaviconURL = useMemo((): string => {
    if (!selectedEmoji) return '';
    const { imageURL, emoji } = selectedEmoji;
    return imageURL || createFaviconURLFromChar(emoji || '');
  }, [selectedEmoji]);

  if (!url || !settings) {
    return {
      selectedFavicon: null,
      selectedEmoji: null,
      selectedFaviconURL: '',
    };
  }

  return { selectedFavicon, selectedEmoji, selectedFaviconURL };
}
