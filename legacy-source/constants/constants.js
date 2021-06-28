import { defaultEmojis } from "./defaults";

const isWindows = /^Win\d+$/.test(navigator.platform);
const HACKER_CAT = isWindows ? "🐱‍💻" : ""; // Only Windows has hacker cat

export const EMOJI_SIZE = 256; // Anything larger will causes problems in Google Chrome
export const DEFAULT_SET = defaultEmojis + HACKER_CAT;

export const DEFAULT_OVERRIDES = [];
