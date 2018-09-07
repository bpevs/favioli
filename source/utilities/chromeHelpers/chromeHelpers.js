const { storage, tabs } = chrome;

const defaultOptions = {
  overrides: [],
  overrideAll: false,
  flagReplaced: false,
};

export function getTab(tabId) {
  return new Promise(resolve => tabs.get(tabId, resolve));
}

export function getOptions(options) {
  const toGet = Object.assign({}, defaultOptions, options);
  return new Promise(resolve => storage.sync.get(toGet, resolve));
}

export function setOptions(toSet) {
  return new Promise(resolve => storage.sync.set(toSet, resolve));
}
