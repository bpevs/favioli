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
 * @todo figure out how to properly import/declare/export global type from definitelyTyped.
 * Also looks like definitelyTyped is only for "chrome" global, so would need to map to
 * "browser" for approx. firefox types.
 */

interface BrowserExtensionAPI {
  // See @todo:
  // deno-lint-ignore no-explicit-any
  [name: string]: any;
}

declare global {
  const browser: BrowserExtensionAPI;
  const chrome: BrowserExtensionAPI;
}

const CHROME = 'CHROME';
const FIREFOX = 'FIREFOX';

export type BrowserName = 'CHROME' | 'FIREFOX';

const browserAPI = isBrowser(CHROME) ? chrome : browser; // Default to Chromium

export default browserAPI;
export const BROWSER: { [name: string]: BrowserName } = { CHROME, FIREFOX };
export const broserName = isBrowser(CHROME) ? CHROME : FIREFOX;

/**
 * What browser is this?
 * @param {string} toCheck to check
 */
export function isBrowser(toCheck: BrowserName): boolean | string {
  let currentBrowser = CHROME;
  try {
    // Use try block, since userAgent not guaranteed to exist.
    // If fail, assume Chromium
    // deno-lint-ignore no-explicit-any
    const userAgent: string = (navigator as any)?.userAgent || '';
    if (userAgent.indexOf('Firefox') > 0) {
      currentBrowser = FIREFOX;
    }
  } catch (_) {
    // Do nothing
  }

  if (!toCheck) currentBrowser;
  if (toCheck === CHROME && currentBrowser === CHROME) return true;
  if (toCheck === FIREFOX && currentBrowser === FIREFOX) return true;
  return false;
}
