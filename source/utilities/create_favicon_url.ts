import { isFirefox } from './predicates.ts';

export const ICON_SIZE = 256; // Larger will causes problems in Google Chrome
const VERTICAL_OFFSET = (isFirefox() ? 20 : 0); // ff is off-center

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

canvas.width = canvas.height = ICON_SIZE;

if (ctx) {
  ctx.font = `normal normal normal ${ICON_SIZE}px/${ICON_SIZE}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
}

/**
 * Create a favicon image using the system's native emoji character.
 * We render native emojis (rather than emoji spritesheets) for two reasons.
 *  1. Avoid needing to package large image spritesheets with Favioli.
 *  2. Avoid any legal complications from packaging emoji images.
 *
 * This function is expected to be used primarily for favicon autofill.
 *
 * Heavily inspired by emoji-favicon-toolkit
 * @source https://github.com/eligrey/emoji-favicon-toolkit/blob/master/src/emoji-favicon-toolkit.ts
 */
export function createFaviconURLFromChar(char: string): string {
  if (!char || !ctx) return '';

  // Calculate sizing
  const { width } = ctx.measureText(char);
  // (ICON_SIZE + (ICON_SIZE / PIXEL_GRID)) / 2
  const center = (ICON_SIZE + (ICON_SIZE / 16)) / 2;
  const scale = Math.min(ICON_SIZE / width, 1);
  const centerScaled = center / scale;

  // Draw emoji
  ctx.clearRect(0, 0, ICON_SIZE, ICON_SIZE);
  ctx.save();
  ctx.scale(scale, scale);
  ctx.fillText(char, centerScaled, centerScaled + VERTICAL_OFFSET);

  ctx.restore();
  return canvas.toDataURL('image/png');
}
