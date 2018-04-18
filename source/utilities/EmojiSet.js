// EmojiSet
// Accepts an array of arguments that can be any of:
//  - string emoji
//  - char code
//  - char code range
//  - character array
// [[ 100. 500 ], "🐱‍💻"]

/**
 * @class EmojiSet
 */
export class EmojiSet {
  constructor(...args) {
    this.flattenEmojis = this.flattenEmojis.bind(this);
    this.emojis = this.flattenEmojis(args).filter(emoji => emoji.trim());
  }

  flattenEmojis(args) {
    if (typeof args === "string") return args.split(" ");
    if (typeof args === "number") return [ String.fromCodePoint(args) ];
    if (isRange(args)) return rangeToCharArray.apply(null, args);
    if (Array.isArray(args)) {
      return Array.prototype.concat(...args.map(this.flattenEmojis));
    }
  }

  get() {
    return this.emojis.slice();
  }

  getEmoji() {
    const emojiIndex = Math.abs(sdbm(location.host)) % this.emojis.length;
    return this.emojis[emojiIndex];
  }

  getEmojiFromHost(host) {
    const emojiIndex = Math.abs(sdbm(host)) % this.emojis.length;
    return this.emojis[emojiIndex];
  }
}


function isRange(item) {
  return Array.isArray(item)
    && item.length === 2
    && typeof item[0] === "number"
    && typeof item[1] === "number";
}


// Get all the emojis in a codePoint range
function rangeToCharArray(first, last) {
  return Array(last - first)
    .fill(null)
    .map((_, i) => String.fromCodePoint(i + first));
}


// Non-cryptographic hashing to get the same emoji index for different keys
// http://www.cse.yorku.ca/~oz/hash.html
// https://github.com/sindresorhus/sdbm
function sdbm(key){
  return String(key).split("").reduce((hash, char, i) => {
    const charCode = key.charCodeAt(i);
    return charCode + (hash << 6) + (hash << 16) - hash;
  }, 0) >>> 0;
}
