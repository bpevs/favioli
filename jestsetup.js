import "canvas-prebuilt"
import "raf/polyfill" // raf polyfill only for testing in dom
import Enzyme from "enzyme"
import Adapter from "enzyme-adapter-react-16"
import { JSDOM } from "jsdom"


// React 16 Enzyme adapter
Enzyme.configure({ adapter: new Adapter() })

const jsdom = new JSDOM("<!doctype html><body><div id='mount'></div></body></html>")
const { window } = jsdom

function copyProps(src, target) {
  const props = Object.getOwnPropertyNames(src)
    .filter(prop => typeof target[prop] === 'undefined')
    .reduce((result, prop) => ({
      ...result,
      [prop]: Object.getOwnPropertyDescriptor(src, prop),
    }), {})
  Object.defineProperties(target, props)
}

global.window = window
global.document = window.document
global.navigator = {
  userAgent: "node.js",
}
copyProps(window, global)


global.chrome = {
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
    }
  },

  tabs: {
    get: jest.fn((tabId, callback) => {
      if (typeof callback === "function") callback()
    }),

    getCurrent: jest.fn(callback => {
      if (typeof callback === "function") callback();
    }),

    sendMessage: jest.fn(),

    onUpdated: {
      addListener: jest.fn(),
    }
  },
};

global.customElements = {
  define: jest.fn(),
};

global.testContext = {
  measureText: jest.fn(() => ({ width: 100 })),
  clearRect: jest.fn(),
  save: jest.fn(),
  scale: jest.fn(),
  fillText: jest.fn(),
  beginPath: jest.fn(),
  arc: jest.fn(),
  fill: jest.fn(),
  restore: jest.fn(),
};

// HTML Elements
[ "navlink", "navlink", "save", "save", "override-inputs" ]
  .forEach((name, index) => {
    const node = document.createElement("div");
    node.className = name;
    node.appendChild(document.createTextNode(name + index))
    document.body.appendChild(node);
  });

[ "page", "page" ]
  .forEach((name, index) => {
    const node = document.createElement("div");
    node.className = "page navlink" + index;
    document.body.appendChild(node);
  });

[ "flag" ]
  .forEach(name => {
    const node = document.createElement("input");
    node.type= "checkbox";
    node.id = name;
    document.body.appendChild(node);
  });
