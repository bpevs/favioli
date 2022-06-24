/// <reference lib="dom" />

/**
 * Check siteList and ignoreList from chrome storage
 * Use those to determine if we should override favicon
 * Override favicon if applicable
 */
import browserAPI from 'browser';

import type FaviconData from './utilities/favicon_data.ts';
import { appendFaviconLink } from './utilities/favicon_helpers.ts';

/**
 * Reload the webpage if new Favioli settings may have updated the favicon
 *   1. Did this url get added/removed from the sitelist?
 *   2. Did this url get added/removed from the ignorelist?
 *   3. Did we start/stop using ignoreList?
 *   4. Did the emoji set change?
 */
browserAPI.storage.onChanged.addListener((changes) => {
  const { autoselectorVersion, features, ignoreList, siteList } = changes || {};
  if (siteList) {
    const { newValue = [], oldValue = [] } = siteList || {};
    const newDiff = newValue.filter(includesCurrUrl);
    const oldDiff = oldValue.filter(includesCurrUrl);
    if (newDiff.length !== oldDiff.length) location.reload();
  } else if (ignoreList) {
    const { newValue = [], oldValue = [] } = ignoreList || {};
    const newDiff = newValue.filter(includesCurrUrl);
    const oldDiff = oldValue.filter(includesCurrUrl);
    if (newDiff.length !== oldDiff.length) location.reload();
  } else if (autoselectorVersion) {
    const { newValue = '', oldValue = '' } = autoselectorVersion;
    if (newValue !== oldValue) location.reload();
  } else if (
    !shallowCompare(features?.newValue, features?.oldValue)
  ) {
    location.reload();
  }
});

// Return true if objects are equivalent.
// deno-lint-ignore no-explicit-any
function shallowCompare(obj1: any, obj2: any) {
  if (typeof obj1 !== typeof obj2) return false;
  else if (typeof obj1 !== 'object' || typeof obj2 !== 'object') {
    return obj1 === obj2;
  } else if (Object.keys(obj1).length !== Object.keys(obj2).length) {
    return false;
  } else {
    return Object.keys(obj1)
      .every((key) => Object.hasOwn(obj2, key) && obj1[key] === obj2[key]);
  }
}

function includesCurrUrl(val: string) {
  return (new RegExp(val)).test(location.href);
}

browserAPI.runtime.onMessage.addListener(({
  favicon,
  shouldOverride,
}: {
  favicon: FaviconData;
  shouldOverride: boolean;
}) => {
  if (favicon.emoji) {
    console.log(favicon.emoji.emoji, 'override: ' + shouldOverride);
    appendFaviconLink(favicon.emoji.emoji, { shouldOverride });
  }
});
