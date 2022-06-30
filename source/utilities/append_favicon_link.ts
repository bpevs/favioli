import type { Emoji } from '../models/emoji.ts';
import { isFirefox } from './predicates.ts';

import { createFaviconURLFromChar, ICON_SIZE } from './image_helpers.ts';

const head = document.getElementsByTagName('head')[0];
let appendedFavicon: HTMLElement | null = null;

// Cache `true`, to give site every opportunity
let hasFavicon = false;

interface Options {
  shouldOverride?: boolean;
  enableOverrideIndicator?: boolean;
}

// Given an emoji string, append it to the document head
export default async function appendFaviconLink(
  emoji: Emoji,
  options?: Options | void,
) {
  const { shouldOverride = false, enableOverrideIndicator = false } = options ||
    {};
  const faviconURL = emoji.imageURL
    ? emoji.imageURL
    : createFaviconURLFromChar(emoji.emoji || '', enableOverrideIndicator);

  if (!faviconURL) return;
  if (shouldOverride) removeAllFaviconLinks();

  // Already appended favicon; just update
  if (appendedFavicon) return appendedFavicon.setAttribute('href', faviconURL);
  if (shouldOverride || !(await doesSiteHaveFavicon())) {
    appendedFavicon = head.appendChild(
      createLink(faviconURL, ICON_SIZE, 'image/png'),
    );
  }
}

// Return an array of link tags that have an icon rel
function getAllIconLinks(): HTMLLinkElement[] {
  return Array.prototype.slice
    .call(document.getElementsByTagName('link'))
    .filter((link: HTMLLinkElement) => {
      return new RegExp(/icon/i).test(link.rel);
    });
}

async function doesSiteHaveFavicon(): Promise<boolean> {
  if (hasFavicon) return hasFavicon;
  const iconLinks = getAllIconLinks();

  // Browsers fallback to favicon.ico
  if (!isFirefox()) iconLinks.push(createLink('/favicon.ico'));

  const iconLinkURLs = iconLinks.map(({ href }: HTMLLinkElement) => href);
  const iconLinkFound = Array.from(new Set(iconLinkURLs))
    .map(async (href: string): Promise<boolean> => {
      // For Firefox, don't test urls. They all fail for me
      // (Although it might be a setting on my browser. Maybe double-check)
      if (isFirefox()) return true;
      const result = await fetch(href);
      if (!result || result.status >= 400) throw new Error('not found');
      return true;
    });

  try {
    hasFavicon = hasFavicon || Boolean(await Promise.any(iconLinkFound));
  } catch {
    /* Do Nothing*/
  }
  return hasFavicon;
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
