import { createEmojiSelector } from "./emojiSelector";

test.skip("Should create emoji selector", () => {
  createEmojiSelector();

  let emoji;
  expect(emoji).toBeDefined();
});
