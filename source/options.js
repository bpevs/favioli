var status = document.getElementById("status");


function save_options() {
  var replaceAll = document.getElementById("replace-all").checked;

  chrome.storage.sync.set({
    replaceAll
  }, function() {
    // Update status to let user know options were saved.
    status.textContent = "Options saved.";
    setTimeout(() => status.textContent = "", 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  chrome.storage.sync.get({
    replaceAll: false
  }, function(items) {
    document.getElementById("replace-all").checked = items.replaceAll;
  });
}

document.addEventListener("DOMContentLoaded", restore_options);
document.getElementById("save").addEventListener("click", save_options);
