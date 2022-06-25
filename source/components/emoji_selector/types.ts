import { Emoji } from '../../utilities/emoji.ts';

export type SetSwitch = (state: boolean) => void;

export type OnSelected = (emoji: Emoji) => void;
