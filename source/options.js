import "./utilities/emojiSelector";
import { getSettings, setSettings } from "./utilities/chromeHelpers";


const status = document.getElementById("status");
const el = {
  onTyping: document.getElementById("on-typing"),
  replaceAll: document.getElementById("replace-all"),
};

const emojiEl = document.getElementsByTagName("emoji-selector")[0];
console.log(emojiEl);
emojiEl.addEventListener("emoji-selected", function (e) {
  console.log(e);
});


async function save_options() {
  const success = await setSettings({
    onTyping: el.onTyping.checked,
    replaceAll: el.replaceAll.checked,
  });

  // Update status to let user know options were saved.
  status.textContent = "Options saved.";
  setTimeout(() => status.textContent = "", 750);

  chrome.runtime.sendMessage(undefined, "updated:settings");
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
async function restore_options() {
  const settings = await getSettings();
  el.onTyping.checked = settings.onTyping;
  el.replaceAll.checked = settings.replaceAll;
}


document.addEventListener("DOMContentLoaded", restore_options);
document.getElementById("save").addEventListener("click", save_options);
