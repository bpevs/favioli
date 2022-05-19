/// <reference lib="dom" />

/**
 * Check siteList and ignoreList from chrome storage
 * Use those to determine if we should override favicon
 * Override favicon if applicable
 */
import browserAPI from './utilities/browserAPI.ts';
import { appendFaviconLink, removeAllFaviconLinks } from "./utilities/faviconHelpers.js";

console.log('hello!');

browserAPI.storage.sync.get(['siteList', 'ignoreList'], (result: any) => {
  const url = new URL(location.href)
  console.log(url);
  if (result.siteList.some((site: string) => location.href.match(site))) {
    console.log('replace!');
    removeAllFaviconLinks();
    appendFaviconLink('😀', true);
    console.log('replaced with 😀');
  }
});
