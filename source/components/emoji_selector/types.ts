import { Emoji } from '../../utilities/emoji.ts';

export type SetSwitch = (state: boolean) => void;

export type OnSelected = (emoji: Emoji) => void;

export interface EmojiGroup {
  name: string;
  representativeEmoji: string;
  emojis: Emoji[];
}

export interface EmojiGroups {
  [name: string]: EmojiGroup;
}
