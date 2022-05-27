import { createFaviconURLFromChar, ICON_SIZE } from './create_favicon_url.ts';
import { isIconLink } from './predicates.ts';

const head = document.getElementsByTagName('head')[0];
const siteHasFavicon = Boolean(getAllIconLinks().length);

let appendedFavicon: HTMLElement | null = null;

interface Options {
  shouldOverride?: boolean;
}

// Given an emoji string, append it to the document head
export function appendFaviconLink(name: string, options?: Options | void) {
  const { shouldOverride = false } = options || {};
  const faviconURL = createFaviconURLFromChar(name || '');
  if (!faviconURL) return;

  if (appendedFavicon) {
    appendedFavicon.setAttribute('href', faviconURL);
  } else if (!siteHasFavicon || shouldOverride) {
    appendedFavicon = head.appendChild(
      createLink(faviconURL, ICON_SIZE, 'image/png'),
    );
    head.appendChild(createLink('/favicon.ico'));
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
  appendedFavicon = null;
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
