import { getSettings, setSettings } from "./utilities/settings";
const replaceAll = document.getElementById("replace-all");
const status = document.getElementById("status");


async function save_options() {
  const success = await setSettings({
    replaceAll: replaceAll.checked
  });

  // Update status to let user know options were saved.
  status.textContent = "Options saved.";
  setTimeout(() => status.textContent = "", 750);
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
async function restore_options() {
  const settings = await getSettings();
  replaceAll.checked = settings.replaceAll;
}


document.addEventListener("DOMContentLoaded", restore_options);
document.getElementById("save").addEventListener("click", save_options);
