export function hasHttp(filter: string) {
  return Boolean(filter.match(/^http/));
}

/**
 * Determines whether a string is in the shape of a regex
 * @param {string} filter
 * @return {boolean}
 */
export function isRegexString(filter: string) {
  return filter.length > 2 &&
    filter.startsWith('/') &&
    filter.endsWith('/');
}

/**
 * Determins whether a string is "close enough" to the shape of a url
 */
export function isValidUrlish(filter: string) {
  const toCheck = hasHttp(filter) ? filter : `https://${filter}`;
  try {
    return Boolean(new URL(toCheck));
  } catch {
    return false;
  }
}
