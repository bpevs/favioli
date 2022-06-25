import * as emoji from 'emoji';
import LEGACY_EMOJI_SET from '../config/legacy_autoselect_set.ts';
import {
  createFaviconDataFromEmoji,
  FaviconData,
} from '../utilities/favicon_data.ts';
import { Emoji } from './emoji.ts';

export const AUTOSELECTOR_VERSION = Object.freeze({
  UNICODE_12: 'UNICODE_12',
  UNICODE_11: 'UNICODE_11',
  UNICODE_10: 'UNICODE_10',
  UNICODE_09: 'UNICODE_09',
  UNICODE_08: 'UNICODE_08',
  UNICODE_07: 'UNICODE_07',
  UNICODE_06: 'UNICODE_06',
  FAVIOLI_LEGACY: 'FAVIOLI_LEGACY',
});

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
export default class Autoselector {
  constructor(version: string, options: { includeFlags?: boolean } = {}) {
    this.version = version;
    this.includeFlags = options?.includeFlags || false;
  }

  cache: {
    [versionId: string]: Emoji[];
  } = {};

  version = AUTOSELECTOR_VERSION.UNICODE_12;
  includeFlags = false;

  get favicons() {
    const cacheId = `${this.version}_${this.includeFlags}`;
    if (this.cache[cacheId]) return this.cache[cacheId];

    let next;

    if (this.version === AUTOSELECTOR_VERSION.FAVIOLI_LEGACY) {
      next = LEGACY_EMOJI_SET.map((str) => emoji.infoByCode(str));
    }

    if (/^UNICODE_\d\d$/.test(this.version)) {
      next = getFilteredFavicons(
        Number(this.version.split('_')[1]),
        this.includeFlags,
      );
    }

    if (next && Array.isArray(next)) {
      this.cache[cacheId] = next.filter(Boolean) as Emoji[];
      return this.cache[cacheId];
    }

    throw new Error('Invalid Autoselector Version');
  }

  selectFavicon(url: string): FaviconData {
    let hostname = '';
    try {
      hostname = (new URL(url)).host;
    } catch {
      // Use URL
    }

    const index = Math.abs(sdbm(hostname || url)) % this.favicons.length;
    const emoji = this.favicons[index] || this.favicons[0];
    return createFaviconDataFromEmoji(url, emoji);
  }
}

function getFilteredFavicons(unicodeVersion: number, includeFlags: boolean) {
  if (!(unicodeVersion > 0)) {
    throw new Error(`invalid unicode version ${unicodeVersion}`);
  }
  return emoji.all()
    .filter((emoji: Emoji) => {
      if (!includeFlags && emoji.subgroup.includes('flag')) return false;
      return emoji.unicodeVersion <= unicodeVersion;
    });
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
