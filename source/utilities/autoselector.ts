import type { Favicon } from '../types.ts';

import * as emoji from 'https://deno.land/x/emoji/mod.ts';
import LEGACY_EMOJI_SET from '../config/legacy_autoselect_set.ts';

const emojis = emoji.all();

type EmojiMap = { [alias: string]: emoji.Emoji };

const NON_SPACING_MARK = String.fromCharCode(65039); // 65039 - '️' - 0xFE0F;
const reNonSpacing = new RegExp(NON_SPACING_MARK, 'g');
function stripNSB(code: string): string {
  return code.replace(reNonSpacing, '');
}

const byCode: EmojiMap = Object.fromEntries(
  emojis.map((emoji) => {
    return [stripNSB(emoji.emoji), emoji];
  }),
);

const legacySet = LEGACY_EMOJI_SET.map((emoji) => byCode[emoji]);

/**
 * For selecting random favicon from a set.  Currently, only select from
 * Emoji set, so it remains more static.
 *
 * @property version
 * Generally this means unicode version. Used to sandbox to a specific set of
 * favicons, so that they remain the same. Special version is provided for
 * legacy Favioli users to use the original set.
 *
 * @property includeFlags
 * Flags are like, half the emojis. So ignore them by default.
 *
 * @property favicons
 * A set of favicons we can autoselect from.
 */
export default class AutoSelector {
  version = '11.0';
  includeFlags = false;

  get favicons() {
    return legacySet;
  }

  selectFavicon(hostname: string): Favicon {
    const index = Math.abs(sdbm(hostname)) % this.favicons.length;
    const favicon = this.favicons[index] || this.favicons[0];
    return {
      id: favicon.aliases[0],
      emoji: favicon.emoji,
    };
  }
}

/**
 *  Non-cryptographic hashing to get the same index for different keys
 *  @source http://www.cse.yorku.ca/~oz/hash.html
 *  @source https://github.com/sindresorhus/sdbm
 */
function sdbm(key: string): number {
  return String(key).split('').reduce((hash, _, i) => {
    const charCode = key.charCodeAt(i);
    return charCode + (hash << 6) + (hash << 16) - hash;
  }, 0) >>> 0;
}
