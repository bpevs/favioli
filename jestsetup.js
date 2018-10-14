import "canvas-prebuilt"
import Enzyme from "enzyme"
import Adapter from "enzyme-adapter-react-16"
import { JSDOM } from "jsdom"
import "raf/polyfill"


// React 16 Enzyme adapter
Enzyme.configure({ adapter: new Adapter() })


// Imitate Browser
const jsdom = new JSDOM("<!doctype html><body></body></html>")
const { window } = jsdom

global.window = window
global.document = window.document
global.navigator = { userAgent: "node.js" }
copyProps(window, global)


// Add react mountpoint to match our options page html
const mountPoint = document.createElement("div")
mountPoint.setAttribute("id", "mount")
document.body.appendChild(mountPoint)


// Mock Chrome
global.browser = global.chrome = {
  runtime: {
    lastError: null,
    onMessage: {
      addListener: jest.fn(),
    },
    sendMessage: jest.fn(),
  },

  storage: {
    sync: {
      get: jest.fn((value, callback) => {
        if (typeof callback === "function") callback({
          flagReplaced: true,
          overrideAll: false,
          overrides: [ { emoji: "😀", filter: "bookface" } ],
        })
      }),
      set: jest.fn((value, callback) => {
        if (typeof callback === "function") callback()
      }),
    },
  },

  tabs: {
    get: jest.fn((tabId, callback) => {
      if (typeof callback === "function") callback()
    }),

    getCurrent: jest.fn(callback => {
      if (typeof callback === "function") callback()
    }),

    sendMessage: jest.fn(),

    onUpdated: {
      addListener: jest.fn(),
    },
  },
}

// Mock for Canvas
global.testContext = {
  arc: jest.fn(),
  beginPath: jest.fn(),
  clearRect: jest.fn(),
  fill: jest.fn(),
  fillText: jest.fn(),
  measureText: jest.fn(() => ({ width: 100 })),
  restore: jest.fn(),
  save: jest.fn(),
  scale: jest.fn(),
}


/**
 * Copy properties from source to target
 * @param {any} src
 * @param {any} target
 */
function copyProps(src, target) {
  const props = Object.getOwnPropertyNames(src)
    .filter(prop => typeof target[prop] === "undefined")
    .reduce((result, prop) => ({
      ...result,
      [prop]: Object.getOwnPropertyDescriptor(src, prop),
    }), {})
  Object.defineProperties(target, props)
}
