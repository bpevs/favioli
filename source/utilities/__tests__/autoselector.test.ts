import { assertEquals } from 'asserts';
import { it } from 'bdd';

import {
  createFaviconDataFromEmoji,
  getEmojiFromFavicon,
} from '../favicon_data.ts';
import Autoselector, { AUTOSELECTOR_VERSION } from '../autoselector.ts';

const { FAVIOLI_LEGACY, UNICODE_12, UNICODE_11, UNICODE_09 } =
  AUTOSELECTOR_VERSION;

it('Should select emoji', () => {
  const autoselector = new Autoselector(AUTOSELECTOR_VERSION.UNICODE_12);
  const emoji = autoselector.selectFavicon('https://favioli.com');
  assertEquals(
    emoji,
    createFaviconDataFromEmoji(
      'https://favioli.com',
      getEmojiFromFavicon(emoji),
    ),
  );
});

it('Should select different emojis for different sets', () => {
  const legacyEmoji = new Autoselector(FAVIOLI_LEGACY)
    .selectFavicon('https://favioli.com');

  const unicode11Emoji = new Autoselector(UNICODE_11)
    .selectFavicon('https://favioli.com');

  const unicode12Emoji = new Autoselector(UNICODE_12)
    .selectFavicon('https://favioli.com');

  assertEquals(getEmojiFromFavicon(legacyEmoji)?.emoji, '😥');
  assertEquals(getEmojiFromFavicon(unicode12Emoji)?.emoji, '🚜');
  assertEquals(getEmojiFromFavicon(unicode11Emoji)?.emoji, '👄');
});

it('Should default to no flags', () => {
  const includingFlags = new Autoselector(UNICODE_09, { includeFlags: true })
    .selectFavicon('http://bpev.me');

  const withNoFlags = new Autoselector(UNICODE_09)
    .selectFavicon('http://bpev.me');

  assertEquals(getEmojiFromFavicon(includingFlags)?.emoji, '🇬🇲');
  assertEquals(getEmojiFromFavicon(withNoFlags)?.emoji, '🦆');
});

it('Should give the same emoji for the same domain', () => {
  const autoselector = new Autoselector(UNICODE_12);
  assertEquals(
    getEmojiFromFavicon(autoselector.selectFavicon('https://favioli.com'))
      ?.emoji,
    getEmojiFromFavicon(
      autoselector.selectFavicon('http://favioli.com/lala/blah?hehe=hoho'),
    )?.emoji,
  );
});
