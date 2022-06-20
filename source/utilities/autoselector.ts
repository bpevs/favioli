import * as emoji from 'emoji';
import LEGACY_EMOJI_SET from '../config/legacy_autoselect_set.ts';
import FaviconData from '../utilities/favicon_data.ts';

const legacySet = LEGACY_EMOJI_SET
  .map((emojiStr: string) => emoji.infoByCode(emojiStr));

/**
 * For selecting random favicon from a set. Currently, only select from
 * Emoji set, so it remains more static (read: CUSTOM EMOJIS ARE NOT AUTOGEN'd)
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

  selectFavicon(url: string): FaviconData {
    let hostname = '';
    try {
      hostname = (new URL(url)).host;
    } catch {
      // Use URL
    }

    const index = Math.abs(sdbm(hostname || url)) % this.favicons.length;
    const favicon = this.favicons[index] || this.favicons[0];
    return {
      id: favicon?.description || `autoselected-${index}`,
      matcher: url,
      emoji: favicon, // Always emoji; custom emojis are not in autoset
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
