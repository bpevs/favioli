import type { Emoji as BaseEmoji } from 'https://deno.land/x/emoji@0.2.0/types.ts';

/**
 * Favioli Emoji type supports custom image and animated Emoji.
 */
interface Emoji extends BaseEmoji {
  imageURL?: string;
  videoURL?: string;
}

export type { Emoji };

export function createCustomEmoji({ description, imageURL, videoURL }: {
  description: string;
  imageURL?: string;
  videoURL?: string;
}): Emoji {
  if (!imageURL && !videoURL) throw new Error('No URLs given');

  return {
    emoji: '',
    description,
    group: 'Custom Emojis',
    subgroup: 'custom-emojis',
    emojiVersion: 0,
    unicodeVersion: 0,
    tags: [],
    aliases: [description],
    skinTones: false,
    imageURL,
    videoURL,
  };
}
