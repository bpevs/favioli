import { EMOJI_SIZE, MIME_IMAGE } from "../constants/constants";


const PIXEL_GRID = 16;

// Canvas setup
const canvas = document.createElement("canvas");
canvas.width = canvas.height = EMOJI_SIZE;

// Context setup
const context = canvas.getContext("2d");
context.font = `normal normal normal ${EMOJI_SIZE}px/${EMOJI_SIZE}px sans-serif`;
context.textAlign = "center";
context.textBaseline = "middle";


export function createEmojiUrl(emoji) {
  const char = String(emoji) || "";

  // Calculate sizing
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

  return canvas.toDataURL(MIME_IMAGE);
}
