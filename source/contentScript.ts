/// <reference lib="dom" />

/**
 * Check siteList and ignoreList from chrome storage
 * Use those to determine if we should override favicon
 * Override favicon if applicable
 */
import browserAPI from './utilities/browserAPI.ts';
import {
  appendFaviconLink,
  removeAllFaviconLinks,
} from './utilities/faviconHelpers.js';

interface Options {
  siteList: string[];
  ignoreList: string[];
}

browserAPI.storage.sync.get(['siteList', 'ignoreList'], (result: Options) => {
  if (result.siteList.some((site: string) => location.href.match(site))) {
    removeAllFaviconLinks();
    appendFaviconLink('😀', true);
  }
});
