const defaultSettings = {
  overrides: [],
  overrideAll: false,
};

export function getTab(tabId) {
  return new Promise(resolve => (browser || chrome).tabs.get(tabId, resolve));
}

export function getSettings(settings) {
  const toGet = Object.assign({}, defaultSettings, settings);
  return new Promise(resolve => (browser || chrome).storage.sync.get(toGet, resolve));
}

export function setSettings(toSet) {
  return new Promise(resolve => (browser || chrome).storage.sync.set(toSet, resolve));
}
