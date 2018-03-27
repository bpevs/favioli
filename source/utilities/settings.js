const defaultSettings = {
  replaceAll: false,
  onTyping: true,
};

export function getSettings(settings) {
  return new Promise(resolve => {
    chrome.storage.sync.get(Object.assign({}, defaultSettings, settings), resolve);
  });
}

export function setSettings(settings) {
  return new Promise(resolve => {
    chrome.storage.sync.set(settings, resolve);
  });
}
