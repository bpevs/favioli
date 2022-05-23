import { isFirefox } from './browserAPI.ts';
import { createEmojiFaviconURL, ICON_SIZE } from './createEmojiFaviconURL.ts';
import { isIconLink } from './predicates.ts';

// Append new favicon links to the document head
const documentHead = document.getElementsByTagName('head')[0];
const hasFavicon = Boolean(isFirefox() && getAllIconLinks().length);

/** @type {?HTMLElement} */
let existingFavicon = null;

/**
 * Given an emoji string, append it to the document head
 * @param {string} name
 * @param {boolean} shouldOverride
 */
export function appendFaviconLink(name, shouldOverride) {
  const href = createEmojiFaviconURL(name || '');
  if (!href) return;

  if (existingFavicon) {
    existingFavicon.setAttribute('href', href);
  } else if (!hasFavicon || shouldOverride) {
    const link = createLink(href, ICON_SIZE, 'image/png');
    existingFavicon = documentHead.appendChild(link);

    if (!shouldOverride) {
      const defaultLink = createLink('/favicon.ico');
      documentHead.appendChild(defaultLink);
    }
  }
}

/**
 * Return an array of link tags that have an icon rel
 * @returns {Array.<HTMLElement>}
 */
export function getAllIconLinks() {
  return Array.prototype
    .slice.call(document.getElementsByTagName('link'))
    .filter(isIconLink);
}

/**
 * Removes all icon link tags
 */
export function removeAllFaviconLinks() {
  getAllIconLinks().forEach((link) => link.remove());
  existingFavicon = null;
}

/**
 * Given a url, create a favicon link
 * @param {string} href
 * @param {number=} size
 * @param {string=} type
 * @returns {HTMLLinkElement}
 */
function createLink(href, size, type) {
  const link = document.createElement('link');
  link.rel = 'icon';
  link.href = href;
  if (type) link.type = type;
  if (size) link.setAttribute('sizes', `${size}x${size}`);
  return link;
}
