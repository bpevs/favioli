import type { Emoji as BaseEmoji } from 'emoji';
import type { BrowserStorage } from '../hooks/use_browser_storage.ts';

import browserAPI from 'browser';
import * as emoji from 'emoji';
import { isEmojiSupported } from 'is_emoji_supported';
import { createContext } from 'preact';

const { freeze, fromEntries, keys } = Object;
const { storage } = browserAPI || {};

export interface Emoji extends emoji.Emoji {
  imageURL?: string; // Support Custom Emojis
}

export interface EmojiGroup {
  name: string;
  representativeEmoji: string;
  emojis: readonly Emoji[];
}

export interface EmojiGroups {
  [name: string]: EmojiGroup;
}

export interface EmojiMap {
  [name: string]: Emoji;
}

export { emoji };
export const emojis = freeze(emoji.all());

export const DEFAULT_EMOJI = freeze(emoji.infoByCode('😀') as Emoji);
export const CUSTOM_GROUP_NAME = 'Custom Emojis';

export const emojiGroups: EmojiGroups = createEmojiGroups(emojis);
export const emojiGroupsArray = freeze(
  keys(emojiGroups).map((name) => emojiGroups[name]),
);

const DEFAULT_CUSTOM_EMOJI_IDS: string[] = [];
export const CustomEmojiContext = createContext<BrowserStorage<string[]>>({
  loading: true,
  cache: DEFAULT_CUSTOM_EMOJI_IDS,
  setCache: () => {},
  saveCacheToStorage: async () => {},
  saveToStorageBypassCache: async () => {},
});

export function createEmoji(
  description: string,
  imageURL: string,
): Emoji {
  return {
    emoji: '',
    description,
    group: CUSTOM_GROUP_NAME,
    subgroup: 'custom-emojis',
    emojiVersion: 0,
    unicodeVersion: 0,
    tags: [],
    aliases: [description],
    imageURL,
  };
}

export async function deleteEmoji(emojiToDelete: Emoji): Promise<void> {
  const desc: string = emojiToDelete.description;
  await storage.sync.remove(getEmojiStorageId(desc));
}

export const getEmojiStorageId = (id: string) => `Custom Emoji: ${id}`;
const byDescription: EmojiMap = fromEntries(
  emojis
    .filter(emoji => isEmojiSupported(emoji.emoji))
    .map((emoji) => [emoji.description, emoji]),
);

export async function getEmoji(desc: string): Promise<Emoji | undefined> {
  if (byDescription[desc]) return byDescription[desc];
  const storageID = getEmojiStorageId(desc);
  try {
    const resp = await storage.sync.get([storageID]);
    return resp[storageID] as Emoji;
  } catch {
    return;
  }
}

export async function getEmojis(descs: string[]): Promise<EmojiMap> {
  const localEmojis: EmojiMap = {};
  const customDescIds: string[] = [];
  descs.forEach((desc: string) => {
    if (byDescription[desc]) localEmojis[desc] = byDescription[desc];
    else customDescIds.push(getEmojiStorageId(desc));
  });
  const customEmojis = await storage.sync.get(customDescIds) as EmojiMap;
  const customEmojiWithProperName: EmojiMap = {};
  Object.keys(customEmojis).forEach((storageId) => {
    const emoji = customEmojis[storageId];
    customEmojiWithProperName[emoji.description] = emoji;
  });
  return { ...localEmojis, ...customEmojiWithProperName };
}

export async function saveEmoji(emojiToSave: Emoji): Promise<void> {
  const desc: string = emojiToSave.description;
  if (byDescription[desc]) throw new Error('This Emoji Already Exists!');
  await storage.sync.set({ [getEmojiStorageId(desc)]: emojiToSave });
}

export function areEqualEmojis(emoji1?: Emoji, emoji2?: Emoji): boolean {
  if (!emoji1 || !emoji2) return false;
  if (emoji1.imageURL && (emoji1.imageURL === emoji2.imageURL)) return true;
  if (emoji1.emoji && (emoji1.emoji === emoji2.emoji)) return true;
  return false;
}

function createEmojiGroups(emojis: readonly Emoji[]): EmojiGroups {
  const emojiGroups: {
    [name: string]: {
      name: string;
      representativeEmoji: string;
      emojis: Emoji[];
    };
  } = {};

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

  emojiGroups[CUSTOM_GROUP_NAME] = {
    name: CUSTOM_GROUP_NAME,
    emojis: [],
    representativeEmoji: '*',
  };

  return freeze(emojiGroups);
}
