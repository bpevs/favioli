import { createFaviconURLFromChar, ICON_SIZE } from './create_favicon_url.ts';
import { isIconLink } from './predicates.ts';
import { Emoji } from './emoji.ts';

const head = document.getElementsByTagName('head')[0];
let appendedFavicon: HTMLElement | null = null;

interface Options {
  shouldOverride?: boolean;
}

// Given an emoji string, append it to the document head
export async function appendFaviconLink(
  emoji: Emoji,
  options?: Options | void,
) {
  const { shouldOverride = false } = options || {};
  const faviconURL = emoji.imageURL
    ? emoji.imageURL
    : createFaviconURLFromChar(emoji.emoji || '');

  if (!faviconURL) return;

  if (shouldOverride) removeAllFaviconLinks();

  // Already appended favicon; just update
  if (appendedFavicon) {
    appendedFavicon.setAttribute('href', faviconURL);
  } else if (shouldOverride || await doesSiteHaveFavicon() === false) {
    appendedFavicon = head.appendChild(
      createLink(faviconURL, ICON_SIZE, 'image/png'),
    );
  }
}

// Return an array of link tags that have an icon rel
function getAllIconLinks(): HTMLLinkElement[] {
  return Array.prototype.slice
    .call(document.getElementsByTagName('link'))
    .filter(isIconLink);
}

export async function doesSiteHaveFavicon() {
  const iconLinkFound = getAllIconLinks()
    .concat(createLink('/favicon.ico')) // Browsers fallback to favicon.ico
    .map(async ({ href }: HTMLLinkElement) => {
      if ((await fetch(href)).status < 400) return true;
      throw new Error('not found');
    });
  try {
    return await Promise.any(iconLinkFound);
  } catch {
    return false;
  }
}

// Removes all icon link tags
function removeAllFaviconLinks(): void {
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
