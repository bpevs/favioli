import * as emoji from 'emoji';
import type { Emoji } from 'https://deno.land/x/emoji@0.2.0/types.ts';

const DEFAULT_EMOJI = emoji.infoByCode('😀') as Emoji;

/**
 * Local Icon Database
 * Used to store favicons for later usage.
 */
export default class FaviconData {
  id: string; // Unique ID representing favicon (nickname, etc)
  matcher: string; // String (inc RegExp string) representing the url to match
  video?: string; // Priority 1: Optional multiframe favicon
  image?: string; // Priority 2: Optional singleframe favicon
  emoji?: Emoji; // Priority 3: Optional emoji favicon

  constructor(emojiInput?: Emoji, matcher: string = '') {
    const selectedEmoji = emojiInput || DEFAULT_EMOJI;
    this.id = selectedEmoji.description;
    this.matcher = matcher;
    this.emoji = selectedEmoji;
  }
}
