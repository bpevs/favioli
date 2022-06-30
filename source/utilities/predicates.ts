const FIREFOX = 'FIREFOX';
const CHROME = 'CHROME';

type Browser = 'FIREFOX' | 'CHROME';

export const isChrome = (): boolean => isBrowser(CHROME);
export const isFirefox = (): boolean => isBrowser(FIREFOX);

/**
 * What browser is this?
 * @param {string} toCheck to check
 */
function isBrowser(toCheck: Browser): boolean {
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
