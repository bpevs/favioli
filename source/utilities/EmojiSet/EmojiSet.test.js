import { EmojiSet } from "./EmojiSet";

let emojis;

beforeEach(() => {
  emojis = new EmojiSet("😀 😁 😂 🤣 😃 😄 😅 😆 😉 😊");
});

test("Should return emojis as an array", () => {
  expect(Array.isArray(emojis.get())).toBe(true);
  expect(emojis.get().length).toBe(10);
});
