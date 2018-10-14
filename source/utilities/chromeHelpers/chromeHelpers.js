import getEmojiFromLegacyString from "../../constants/emoji2Name"

const CHROME = "CHROME"
const FIREFOX = "FIREFOX"
const { storage, runtime, tabs } = (isBrowser("CHROME") ? chrome : browser)


const defaultOptions = {
  flagReplaced: false,
  overrideAll: false,
  overrides: [],
}


/**
 * Get information about a tab
 * @param {number} tabId
 */
export function getTab(tabId) {
  return new Promise(resolve => tabs.get(tabId, resolve))
}


/**
 * Get options.
 */
export function getOptions() {
  return new Promise((resolve, reject) => storage.sync.get(
    Object.keys(defaultOptions),
    options => {
      if (runtime.lastError) return reject(runtime.lastError)

      // Legacy Favioli used straight emoji strings. Using the format of
      // EmojiMart allows us great flexibility for future expansion
      const overrides = (options && options.overrides || [])
        .map(override => Object.assign({}, override, {
          emoji: typeof override.emoji === "string"
            ? getEmojiFromLegacyString(options.overrides[0].emoji)
            : override.emoji,
        }))

      resolve(Object.assign({}, defaultOptions, options, { overrides }))
    },
  ))
}

/**
 * What browser is this?
 * @param {string} toCheck to check
 */
export function isBrowser(toCheck) {
  let currentBrowser = CHROME
  try {
    if (navigator.userAgent.indexOf("Firefox") > 0) currentBrowser = FIREFOX
  } finally {
    if (!toCheck) return currentBrowser
    if (toCheck === CHROME && currentBrowser === CHROME) return true
    if (toCheck === FIREFOX && currentBrowser === FIREFOX) return true
    return false
  }
}

/**
 * Set Options
 * @param {object} toSet
 */
export function setOptions(toSet) {
  if (!toSet) return

  const options = {
    flagReplaced: Boolean(toSet.flagReplaced),
    overrideAll: Boolean(toSet.overrideAll),
    overrides: toSet.overrides || defaultOptions,
  }

  return new Promise((resolve, reject) => storage.sync.set(
    options,
    () => runtime.lastError ? reject(runtime.lastError) : resolve(),
  ))
  .then(() => runtime.sendMessage("updated:options"))
}
