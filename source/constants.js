import { EmojiSet } from "./utilities/EmojiSet";
const isWindows = /^Win\d+$/.test(navigator.platform);


export const EMOJI_SIZE = 256; // Anything larger will causes problems in Google Chrome
export const MIME_IMAGE = "image/png";


export const HACKER_CAT = isWindows && "🐱‍💻"; // Only Windows has hacker cat
const EMOTICONS = [ 128513, 128591 ];
const DINGBATS = [ 9986, 10160 ];
const TRANSPORT_AND_MAP = [ 128640, 128704 ];

export const DEFAULT_SET = new EmojiSet(
  EMOTICONS,
  TRANSPORT_AND_MAP,
  HACKER_CAT
);
