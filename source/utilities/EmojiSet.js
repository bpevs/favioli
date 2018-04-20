/**
 * @class
 * An Emoji Set is a collection of emojis we select from.
 *
 */

export class EmojiSet {

  /**
   * @constructor
   * Accepts an array of arguments that can be any of:
   * char | char[] | char code | [start char code, end char code]
   * e.g. [[ 100. 500 ], "🐱‍💻"]
   *
   * @param {...*} args
   */
  constructor(...args) {
    this.emojis = this.flattenEmojis(args).filter(emoji => emoji.trim());
  }

  /**
   * Creates one giant array of emojis from all the constructor params.
   * .@param {any[]} args
   */
  flattenEmojis = args => {
    if (typeof args === "string") return args.split(" ");
    if (typeof args === "number") return [ String.fromCodePoint(args) ];
    if (isRange(args)) return rangeToCharArray.apply(null, args);
    if (Array.isArray(args)) {
      return Array.prototype.concat(...args.map(this.flattenEmojis));
    }
  }

  /**
   * Returns a copy of our emoji data
   * .@return {string[]} Emoji Array
   */
  get() {
    return this.emojis.slice();
  }

  /**
   * Gets a single emoji dependent on our location
   * .@return {string} emoji
   */
  getEmoji() {
    return this.getEmojiFromHost(location.host);
  }


  /**
   * Gets a single emoji from a host string
   *  @param {string} host
   * .@return {string} emoji
   */
  getEmojiFromHost(host) {
    const emojiIndex = Math.abs(sdbm(host)) % this.emojis.length;
    return this.emojis[emojiIndex];
  }
}


/**
 *  Determines whether we have a number tuple
 *  @param {any} item
 * .@return {boolean}
 */
function isRange(item) {
  return Array.isArray(item)
    && item.length === 2
    && typeof item[0] === "number"
    && typeof item[1] === "number";
}


/**
 *  Gets an array of emojis from a codePoint tuple
 *  @param {number} first
 *  @param {number} last
 * .@return {string[]} emoji array
 */
function rangeToCharArray(first, last) {
  return Array(last - first)
    .fill(null)
    .map((_, i) => String.fromCodePoint(i + first));
}


/**
 *  Non-cryptographic hashing to get the same emoji index for different keys
 *  @source http://www.cse.yorku.ca/~oz/hash.html
 *  @source https://github.com/sindresorhus/sdbm

 *  @param {any} key
 * .@return {number} index
 */
function sdbm(key){
  return String(key).split("").reduce((hash, char, i) => {
    const charCode = key.charCodeAt(i);
    return charCode + (hash << 6) + (hash << 16) - hash;
  }, 0) >>> 0;
}
