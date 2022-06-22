/// <reference lib="dom" />

/**
 * Check siteList and ignoreList from chrome storage
 * Use those to determine if we should override favicon
 * Override favicon if applicable
 */
import browserAPI from 'browser';

import type FaviconData from './utilities/favicon_data.ts';
import { appendFaviconLink } from './utilities/favicon_helpers.ts';

browserAPI.storage.onChanged.addListener((changes) => {
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
