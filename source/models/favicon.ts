import type { Emoji } from './emoji.ts';

export interface Favicon {
  // String (inc RegExp string) representing the url to match
  matcher: string;
  /**
   * Unique ID representing favicon (emoji.description)
   * We store emojis by ID and retrieve from storage when we want to use.
   * This allows us to save custom emoji image data and access on demand,
   * saving us space in chrome storage.
   */
  emojiId?: string;
}

export function createFavicon(matcher = '', emoji?: Emoji): Favicon {
  return { matcher, emojiId: emoji?.description };
}
