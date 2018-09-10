let createEmojiSelector;

beforeAll(() => {
  jest.clearAllMocks();
  createEmojiSelector = require("./emojiSelector").createEmojiSelector;
});


test("Should create emoji selector", () => {
  createEmojiSelector();

  expect(customElements.define).toHaveBeenCalledTimes(3);

  const [ funTabs, funTab, emojiSelector ] = customElements.define.mock.calls;

  expect(funTabs[0]).toBe("fun-tabs");
  expect(typeof funTabs[1]).toBe("function");

  expect(funTab[0]).toBe("fun-tab");
  expect(typeof funTab[1]).toBe("function");

  expect(emojiSelector[0]).toBe("emoji-selector");
  expect(typeof emojiSelector[1]).toBe("function");
});
