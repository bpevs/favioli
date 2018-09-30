const { storage, runtime, tabs } = (typeof chrome ? chrome : browser);


const defaultOptions = {
  flagReplaced: false,
  overrideAll: false,
  overrides: [],
};


/**
 * Get information about a tab
 * @param {number} tabId
 */
export function getTab(tabId) {
  return new Promise(resolve => tabs.get(tabId, resolve));
}


/**
 * Get options.
 */
export function getOptions() {
  return new Promise((resolve, reject) => storage.sync.get(
    Object.keys(defaultOptions),
    items => {
      if(runtime.lastError) reject(runtime.lastError);
      else resolve(Object.assign({}, defaultOptions, items));
    }
  ));
}


/**
 * Set Options
 * @param {object} toSet
 */
export function setOptions(toSet) {
  return new Promise((resolve, reject) => storage.sync.set(
    toSet,
    () => {
      if(runtime.lastError) reject(runtime.lastError);
      else resolve();
    }
  ));
}
