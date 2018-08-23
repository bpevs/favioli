import memoize from "lodash.memoize";
import { EMOJI_SIZE } from "../constants/constants";


// Append new favicon links to the document head
const documentHead = document.getElementsByTagName("head")[0];
const PIXEL_GRID = 16;

// Initialize canvas and context to render emojis
const canvas = document.createElement("canvas");
canvas.width = canvas.height = EMOJI_SIZE;

const context = canvas.getContext("2d");
context.font = `normal normal normal ${EMOJI_SIZE}px/${EMOJI_SIZE}px sans-serif`;
context.textAlign = "center";
context.textBaseline = "middle";

// Emoji Blob creation can be a tad heavy
const memoizedEmojiUrl = memoize(createEmojiUrl);

/**
 * Given an emoji string, append it to the document head
 * @param {string} name
 * @param {boolean} shouldOverride
 */
let existingFavicon = null;

export function appendFaviconLink(name, shouldOverride) {
  const href = memoizedEmojiUrl(name);

  if (existingFavicon) {
    existingFavicon.setAttribute("href", href);
  } else {
    const link = createLink(href, EMOJI_SIZE, "image/png");
    existingFavicon = documentHead.appendChild(link);

    if (!shouldOverride) {
      const defaultLink = createLink("/favicon.ico");
      documentHead.appendChild(defaultLink);
    }
  }
}

/**
 * Removes all icon link tags
 */
export function removeAllFaviconLinks() {
  Array.prototype
    .slice.call(document.getElementsByTagName("link"))
    .filter(isIconLink)
    .forEach(link => link.remove());
}

/**
 * Creates Emoji Data Url for Favicon
 * @param {string} emoji
 * @returns {string}
 */
function createEmojiUrl(emoji) {
  if (!emoji) return;

  // Calculate sizing
  const char = String(emoji);
  const { width } = context.measureText(char);
  const center = (EMOJI_SIZE + EMOJI_SIZE / PIXEL_GRID) / 2;
  const scale = Math.min(EMOJI_SIZE / width, 1);
  const center_scaled = center / scale;

  // Draw emoji
  context.clearRect(0, 0, EMOJI_SIZE, EMOJI_SIZE);
  context.save();
  context.scale(scale, scale);
  context.fillText(char, center_scaled, center_scaled);
  context.restore();

  return canvas.toDataURL("image/png");
}

/**
 * Given a url, create a favicon link
 * @param {string} href
 * @param {number=} size
 * @param {string=} type
 * @returns {HTMLLinkElement}
 */
function createLink(href, size, type) {
  const link = document.createElement("link");
  link.rel = "icon";
  link.href = href;
  if (type) {
    link.type = type;
  }
  if (size) {
    link.setAttribute("sizes", `${size}x${size}`);
  }
  return link;
}

/**
 * Checks whether a link is an icon rel
 * @param {HTMLLinkElement} link
 * @returns {boolean}
 */
function isIconLink(link) {
  return link.rel.toLowerCase().indexOf("icon") !== -1;
}
