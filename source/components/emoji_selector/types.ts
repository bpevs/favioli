import type { Emoji } from 'https://deno.land/x/emoji@0.2.0/types.ts';

export type { Emoji };

export type SetIsOpen = (isOpen: boolean) => void;

export type OnSelected = (emoji: Emoji) => void;

export interface EmojiGroup {
  name: string;
  representativeEmoji: string;
  emojis: Emoji[];
}

export interface EmojiGroups {
  [name: string]: EmojiGroup;
}
