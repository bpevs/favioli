import { EMOJI_SIZE } from "../constants/constants";
import debounce from "lodash.debounce";


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


/**
 * Given an emoji string, append it to the document head
 * @param {string} name
 */
export function appendFaviconLink(name) {
  const href = createEmojiUrl(name);
  const link = createLink(href, EMOJI_SIZE);
  documentHead.appendChild(link);
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
 * @param {number} size
 * @returns {HTMLLinkElement}
 */
function createLink(href, size) {
  const link = document.createElement("link");
  link.rel = "icon";
  link.type = "image/png";
  link.href = href;
  link.setAttribute("sizes", `${size}x${size}`);
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
