const { get, set } = chrome.storage.sync;

const defaultSettings = {
  replaceAll: false,
  onTyping: true,
};

export function getSettings(settings) {
  return new Promise(resolve => {
    get(Object.assign({}, defaultSettings, settings), resolve);
  });
}

export function setSettings(settings) {
  return new Promise(resolve => {
    set(settings, resolve);
  });
}
