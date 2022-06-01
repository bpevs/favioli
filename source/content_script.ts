/// <reference lib="dom" />

/**
 * Check siteList and ignoreList from chrome storage
 * Use those to determine if we should override favicon
 * Override favicon if applicable
 */
import type { Favicon } from './types.ts';
import { appendFaviconLink } from './utilities/favicon_helpers.ts';
import browserAPI from './utilities/browser_api.ts';

browserAPI.storage.onChanged.addListener(async (changes) => {
  if (changes?.siteList) {
    const { newValue = [], oldValue = [] } = changes?.siteList || {};
    const newDiff = newValue.filter(includesCurrUrl);
    const oldDiff = oldValue.filter(includesCurrUrl);
    if (newDiff.length !== oldDiff.length) location.reload();
  } else if (changes?.ignoreList) {
    const { newValue = [], oldValue = [] } = changes?.ignoreList || {};
    const newDiff = newValue.filter(includesCurrUrl);
    const oldDiff = oldValue.filter(includesCurrUrl);
    if (newDiff.length !== oldDiff.length) location.reload();
  } else if (changes?.features?.newValue?.enableSiteIgnore != null) {
    location.reload();
  }
});

function includesCurrUrl(val:string) {
  return (new RegExp(val)).test(location.href);
}

browserAPI.runtime.onMessage.addListener(({
  favicon,
  shouldOverride,
}: {
  favicon: Favicon;
  shouldOverride: boolean;
}) => {
  if (favicon.emoji) {
    appendFaviconLink(favicon.emoji, { shouldOverride });
  }
});
