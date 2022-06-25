import * as emoji from 'emoji';
import type { Emoji } from './emoji.ts';

export interface EmojiMap {
  [name: string]: Emoji;
}

export interface EmojiGroup {
  name: string;
  representativeEmoji: string;
  emojis: Emoji[];
}

export interface EmojiGroups {
  [name: string]: EmojiGroup;
}

export const emojis = emoji.all();
export const byDescription: EmojiMap = Object.fromEntries(
  emojis.map((emoji) => {
    return [emoji.description, emoji];
  }),
);

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

emojiGroups['Custom Emojis'] = {
  name: 'Custom Emojis',
  emojis: [],
  representativeEmoji: '*',
};

export const emojiGroupsArray = Object.keys(emojiGroups).map((name) =>
  emojiGroups[name]
);

export const DEFAULT_EMOJI = Object.freeze(emoji.infoByCode('😀') as Emoji);

export function getEmojiFromFavicon(
  favicon?: FaviconData,
  options?: { customEmojis?: EmojiMap },
): Emoji | undefined {
  if (!favicon) return;
  const customEmoji = options?.customEmojis?.[favicon.id];
  return customEmoji || byDescription[favicon.id];
}

export function createFaviconDataFromEmoji(
  matcher = '',
  emojiInput?: Emoji,
) {
  const id = (emojiInput || DEFAULT_EMOJI).description;
  return { id, matcher };
}

/**
 * Store by ID, and retrieve from storage when we want to use.
 * This allows us to save custom emoji image data and access on demand,
 * saving us space in chrome storage.
 */
export interface FaviconData {
  id: string; // Unique ID representing favicon (emoji.description)
  matcher: string; // String (inc RegExp string) representing the url to match
}
