export const getOptions = jest.fn(() =>
  Promise.resolve({
    flagReplaced: true,
    overrideAll: false,
    overrides: [{
      emoji: {
        colons: ":grinning:",
        emoticons: [],
        id: "grinning",
        name: "Grinning Face",
        native: "😀",
        skin: null,
        unified: "1f600",
      },
      filter: "bookface",
    }],
  })
);

export const onRuntimeMessage = jest.fn();
export const onTabsUpdated = jest.fn();
export const sendRuntimeMessage = jest.fn();
export const sendTabsMessage = jest.fn();
export const setOptions = jest.fn(() => Promise.resolve());
