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
