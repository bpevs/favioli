import { EMOJI_SIZE } from "../constants";
import { getOptions, isBrowser } from "../browserHelpers/browserHelpers";

// Append new favicon links to the document head
const documentHead = document.getElementsByTagName("head")[0];
const PIXEL_GRID = 16;

// TODO: Not entirely sure why ff is vertically off-centered atm.
// This is temporary workaround
const verticalOffset = (isBrowser("FIREFOX") ? 40 : 0);

// Initialize canvas and context to render emojis
const canvas = (typeof global !== "undefined")
  ? require("canvas").createCanvas()
  : document.createElement("canvas");
canvas.width = canvas.height = EMOJI_SIZE;

const context = (typeof global !== "undefined" && global.testContext) ||
  canvas.getContext("2d");
context.font =
  `normal normal normal ${EMOJI_SIZE}px/${EMOJI_SIZE}px sans-serif`;
context.textAlign = "center";
context.textBaseline = "middle";

let settings = {};
let hasFavicon = false;

/** @type {?HTMLElement} */
let existingFavicon = null;

export default function createFaviconFromNativeEmoji() {
}
