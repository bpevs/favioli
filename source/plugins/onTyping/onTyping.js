// Use 💬 when user is typing
import { setFavicon } from "../../utilities/setFavicon";


const TYPING_EMOJI = "💬";
const DEFAULT_VALUE = "defaultValue";
const modifiedInputs = new Set;
let currentFavicon;
let initialFavicon;


export function onTyping(favicon) {
  currentFavicon = favicon;
  initialFavicon = favicon;
  addEventListener("beforeinput", ensureDefaultValueAccess);
  addEventListener("input", updateInputFavicon);
}


function ensureDefaultValueAccess(evt) {
  if (!evt.target) return;
  const { dataset, textContent, value } = evt.target;
  
  if (!(DEFAULT_VALUE in evt.target || DEFAULT_VALUE in dataset)) {
    evt.target.dataset.defaultValue = value || textContent;
  }
}

function updateInputFavicon({ target }) {
  if (!target) return;
  const { dataset, textContent, value } = target;

  const defaultInputValue = (DEFAULT_VALUE in target) ? target.defaultValue : dataset.defaultValue;
  const currentInputValue = value || textContent;
  const isWriting = String(currentInputValue).trim() !== String(defaultInputValue).trim();

  isWriting ? modifiedInputs.add(target) : modifiedInputs.delete(target);
  const nextFavicon = modifiedInputs.size ? TYPING_EMOJI : initialFavicon;

  if (currentFavicon !== nextFavicon) {
    currentFavicon = nextFavicon;
    setFavicon(nextFavicon);
  }
}
