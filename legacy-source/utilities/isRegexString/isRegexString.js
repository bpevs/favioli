/**
 * Determines whether a string is in the shape of a regex
 * @param {string} filter
 * @return {boolean}
 */

export function isRegexString(filter) {
  return filter.length > 2 &&
    filter.startsWith("/") &&
    filter.endsWith("/");
}
