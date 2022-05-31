// deno-lint-ignore-file

/**
 * API for more platform-agnostic access to browser extension apis.
 * Since browers ext API is kind of shifting sands, let's not do too much
 * work to try and make 100% stable. But we can use this for the more stable
 * APIs to avoid putting (chrome || browser) everywhere
 *
 * @reference https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions
 * @reference https://developer.chrome.com/docs/extensions/reference
 * @reference https://docs.microsoft.com/en-us/microsoft-edge/extensions-chromium/developer-guide/api-support
 *
 * @todo Borrows heavily from https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/chrome
 */
import { isChrome } from './predicates.ts';
import { BrowserAPI } from './browser_api_interface/mod.ts';

const browserAPI: BrowserAPI = isChrome()
  // deno-lint-ignore no-explicit-any
  ? (globalThis as any).chrome
  : // deno-lint-ignore no-explicit-any
    (globalThis as any).browser;

export default browserAPI;
