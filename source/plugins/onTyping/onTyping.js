// Use 💬 when user is typing
import { setFavicon } from "../../utilities/setFavicon";


const TYPING_EMOJI = "💬";
const modified_inputs = new Set;
let currentFavicon;
let initialFavicon;


export function onTyping(favicon) {
  currentFavicon = favicon;
  initialFavicon = favicon;
  addEventListener("beforeinput", ensureDefaultValueAccess);
  addEventListener("input", updateInputFavicon);
}


function ensureDefaultValueAccess({ target }) {
  if (!target) return;
  const { dataset, defaultValue, textContent, value } = target;
  if (!defaultValue || !dataset.defaultValue) {
    dataset.defaultValue = String(value || textContent).trim();
  }
}

function updateInputFavicon({ target }) {
  if (!target) return;
  const { defaultValue, dataset, textContent, value } = target;

  const defaultInputValue = defaultValue ? defaultValue.trim() : dataset.defaultValue;
  const currentInputValue = String(value || textContent).trim();
  const isWriting = defaultInputValue !== currentInputValue;

  modified_inputs[isWriting ? "add" : "delete"](target);
  const nextFavicon = !modified_inputs.size ? initialFavicon : TYPING_EMOJI;

  if (currentFavicon !== nextFavicon) {
    currentFavicon = nextFavicon;
    setFavicon(nextFavicon);
  }
}
