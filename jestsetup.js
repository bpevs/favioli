import "canvas-prebuilt"

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
        if (typeof callback === "function") callback()
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
[ "navlink", "navlink", "save", "save" ]
  .forEach((name, index) => {
    const node = document.createElement("div");
    node.className = name;
    node.appendChild(document.createTextNode(name + index))
    document.body.appendChild(node);
  });

[ "flag" ]
  .forEach(name => {
    const node = document.createElement("input");
    node.type= "checkbox";
    node.id = name;
    document.body.appendChild(node);
  });
