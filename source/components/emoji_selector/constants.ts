import type { Emoji, EmojiGroups } from './types.ts';

import * as emoji from 'emoji';

const emojis = emoji.all();

export const emojiGroups: EmojiGroups = {};

emojis.forEach((emoji) => {
  if (!emojiGroups[emoji.group]) {
    emojiGroups[emoji.group] = {
      name: emoji.group,
      emojis: [emoji],
      representativeEmoji: emoji.emoji,
    };
  } else {
    emojiGroups[emoji.group].emojis.push(emoji);
  }
});

emojiGroups["Custom Emojis"] = {
  name: 'Custom Emojis',
  emojis: [],
  representativeEmoji: '*',
};

export const emojiGroupsArray = Object.keys(emojiGroups).map((name) =>
  emojiGroups[name]
);
export const DEFAULT_EMOJI = Object.freeze(emoji.infoByCode('😀') as Emoji);
