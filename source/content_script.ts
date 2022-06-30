/// <reference lib="dom" />
import type { Emoji } from './models/emoji.ts';
import type { Favicon } from './models/favicon.ts';

/**
 * Check siteList and ignoreList from chrome storage
 * Use those to determine if we should override favicon
 * Override favicon if applicable
 */
import browserAPI from 'browser';
import appendFaviconLink from './utilities/append_favicon_link.ts';
import { parseRegExp } from './utilities/regex_utils.ts';

browserAPI.runtime.onMessage.addListener(
  ({ emoji, shouldOverride, enableOverrideIndicator }: {
    emoji: Emoji;
    shouldOverride: boolean;
    enableOverrideIndicator: boolean;
  }) => {
    if (emoji) {
      appendFaviconLink(emoji, { shouldOverride, enableOverrideIndicator });
    }
  },
);

/**
 * Reload the webpage if new Favioli settings may have updated the favicon
 *   1. Did this url get added/removed from the sitelist?
 *   2. Did this url get added/removed from the ignorelist?
 *   3. Did we start/stop using ignoreList?
 *   4. Did the emoji set change?
 */
browserAPI.storage.onChanged.addListener((changes): void => {
  if (!changes?.settings) return;
  const { newValue, oldValue } = changes.settings;

  if (newValue.autoselectorVersion !== oldValue.autoselectorVersion) {
    location.reload();
    return;
  }

  if (!shallowCompare(newValue.features, oldValue.features)) {
    location.reload();
    return;
  }

  const newSiteList = newValue.siteList.filter(includesCurrUrl);
  const oldSiteList = oldValue.siteList.filter(includesCurrUrl);

  if (!shallowCompare(newSiteList, oldSiteList)) {
    location.reload();
    return;
  }

  const newIgnoreList = newValue.ignoreList.filter(includesCurrUrl);
  const oldIgnoreList = oldValue.ignoreList.filter(includesCurrUrl);
  if (!shallowCompare(newIgnoreList, oldIgnoreList)) {
    location.reload();
    return;
  }
});

// Return true if objects are equivalent.
function shallowCompare(obj1: unknown, obj2: unknown) {
  if (typeof obj1 !== typeof obj2) return false;
  else if (
    (obj1 == null || obj2 == null) ||
    (typeof obj1 !== 'object' || typeof obj2 !== 'object')
  ) {
    return obj1 == obj2;
  } else if (Object.keys(obj1).length !== Object.keys(obj2).length) {
    return false;
  } else {
    return Object.keys(obj1)
      .every((obj1Key: string) =>
        Object.hasOwn(obj1, obj1Key) &&
        Object.hasOwn(obj2, obj1Key) &&
        (obj1 as Record<string, unknown>)[obj1Key] ===
          (obj2 as Record<string, unknown>)[obj1Key]
      );
  }
}

function includesCurrUrl({ matcher }: Favicon) {
  const regex = parseRegExp(matcher);
  if (regex) return regex.test(location.href);
  return location.href.indexOf(matcher) != -1;
}
