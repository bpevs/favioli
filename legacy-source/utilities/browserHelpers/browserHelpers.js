import getEmojiFromLegacyString from "../../constants/emoji2Name";

const CHROME = "CHROME";
const FIREFOX = "FIREFOX";
const { storage, runtime, tabs } = isBrowser("CHROME") ? chrome : browser;

const defaultOptions = {
  flagReplaced: false,
  overrideAll: false,
  overrides: [],
  skips: [],
};

/**
 * Add a listener for runtime messages
 * @param  {...any} args
 */
export function onRuntimeMessage(...args) {
  runtime.onMessage.addListener(...args);
}

/**
 * Add a listener for tab messages
 * @param  {...any} args
 */
export function onTabsUpdated(...args) {
  tabs.onUpdated.addListener(...args);
}

/**
 * Get information about a tab
 * @param {number} tabId
 */
export function getTab(tabId) {
  return new Promise((resolve) => tabs.get(tabId, resolve));
}

/**
 * Get options.
 */
export function getOptions() {
  return new Promise((resolve, reject) =>
    storage.sync.get(
      Object.keys(defaultOptions),
      (options) => {
        if (runtime.lastError) return reject(runtime.lastError);

        const overrides = (options && options.overrides || [])
          .map(normalizeOverride.bind(this, options));
        const skips = (options && options.skips || []);

        resolve(
          Object.assign({}, defaultOptions, options, { overrides, skips }),
        );
      },
    )
  );
}

/**
 * Legacy Favioli used straight emoji strings. Using the format of
 * EmojiMart allows us great flexibility for future expansion. This takes
 * an emoji object OR an emoji string, and converts it to an object.
 * @param {any} options
 * @param {string | object} override
 */
function normalizeOverride(options, override) {
  return Object.assign({}, override, {
    emoji: typeof override.emoji === "string"
      ? getEmojiFromLegacyString(options.overrides[0].emoji)
      : override.emoji,
  });
}

/**
 * What browser is this?
 * @param {string} toCheck to check
 */
export function isBrowser(toCheck) {
  let currentBrowser = CHROME;
  try {
    if (navigator.userAgent.indexOf("Firefox") > 0) currentBrowser = FIREFOX;
  } finally {
    if (!toCheck) return currentBrowser;
    if (toCheck === CHROME && currentBrowser === CHROME) return true;
    if (toCheck === FIREFOX && currentBrowser === FIREFOX) return true;
    return false;
  }
}

/**
 * Send a runtime message
 * @param  {...any} args
 */
export function sendRuntimeMessage(...args) {
  runtime.sendMessage(...args);
}

/**
 * Send a tab message
 * @param  {string} id
 * @param  {object} options
 */
export function sendTabsMessage(id, options) {
  tabs.sendMessage(id, options);
}

/**
 * Set Options
 * @param {object} toSet
 */
export function setOptions(toSet) {
  if (!toSet) return;

  const options = {
    flagReplaced: Boolean(toSet.flagReplaced),
    overrideAll: Boolean(toSet.overrideAll),
    overrides: toSet.overrides || defaultOptions.overrides,
    skips: toSet.skips || defaultOptions.skips,
  };

  return new Promise((resolve, reject) =>
    storage.sync.set(
      options,
      () => runtime.lastError ? reject(runtime.lastError) : resolve(),
    )
  )
    .then(() => runtime.sendMessage("updated:options"));
}
