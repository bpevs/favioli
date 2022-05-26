import { isFirefox } from './browser_api.ts';
import {
  createEmojiFaviconURL,
  ICON_SIZE,
} from './create_emoji_favicon_url.ts';
import { isIconLink } from './predicates.ts';

// Append new favicon links to the document head
const documentHead = document.getElementsByTagName('head')[0];
const hasFavicon = Boolean(isFirefox() && getAllIconLinks().length);

let existingFavicon: HTMLElement | null = null;

interface Options {
  shouldOverride?: boolean;
}

// Given an emoji string, append it to the document head
export function appendFaviconLink(name: string, options?: Options | void) {
  const { shouldOverride = false } = options || {};
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

// Return an array of link tags that have an icon rel
export function getAllIconLinks(): HTMLElement[] {
  return Array.prototype
    .slice.call(document.getElementsByTagName('link'))
    .filter(isIconLink);
}

// Removes all icon link tags
export function removeAllFaviconLinks(): void {
  getAllIconLinks().forEach((link) => link.remove());
  existingFavicon = null;
}

// Given a url, create a favicon link
function createLink(
  href: string,
  size?: number,
  type?: string,
): HTMLLinkElement {
  const link = document.createElement('link');
  link.rel = 'icon';
  link.href = href;
  if (type) link.type = type;
  if (size) link.setAttribute('sizes', `${size}x${size}`);
  return link;
}
