import { Emoji } from '../../models/emoji.ts';

export type SetSwitch = (state: boolean) => void;
export type OnSelected = (emoji: Emoji) => void;
export type SetRoute = (state: string) => void;

export const ROUTE = {
  DEFAULT: 'DEFAULT',
  CREATE_CUSTOM: 'CREATE_CUSTOM',
  DELETE_CUSTOM: 'DELETE_CUSTOM',
};

export type Route =
  | typeof ROUTE.DEFAULT
  | typeof ROUTE.CREATE_CUSTOM
  | typeof ROUTE.DELETE_CUSTOM;
