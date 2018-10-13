import { EmojiSet } from "./EmojiSet";

let emojis;

beforeEach(() => {
  emojis = new EmojiSet("😀 😁 😂 🤣 😃 😄 😅 😆 😉 😊");
});

test("Should return emojis as an array", () => {
  expect(Array.isArray(emojis.get())).toBe(true);
  expect(emojis.get().length).toBe(10);
});

test("Should build from string codes", () => {
  const emojis = new EmojiSet(55382, [ 55363, 55364, 55365, "😆"], [ 55357, 55367 ], {})
  expect(emojis.get().length).toBe(15)

  emojis.get().forEach(emoji => {
    expect(typeof emoji === "string").toBe(true)
  })
})

test("Should return emoji from string", () => {
  expect(emojis.getEmojiFromHost("www.facebook.com")).toBe("😉");
  expect(emojis.getEmojiFromHost("www.google.com")).toBe("😆");
  expect(emojis.getEmojiFromHost("localhost:3000")).toBe("😃");
  expect(emojis.getEmojiFromHost("localhost:3001")).toBe("😄");
});

test("Should return emoji from location host", () => {
  expect(emojis.getEmoji()).toBe("😊");
});
