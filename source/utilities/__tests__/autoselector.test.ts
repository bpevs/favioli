import { assertEquals } from 'asserts';
import { it } from 'bdd';

import Autoselector, { AUTOSELECTOR_VERSION } from '../autoselector.ts';

const { FAVIOLI_LEGACY, UNICODE_12, UNICODE_11, UNICODE_09 } =
  AUTOSELECTOR_VERSION;

it('Should select emoji', () => {
  const autoselector = new Autoselector(AUTOSELECTOR_VERSION.UNICODE_12);
  const emoji = autoselector.selectFavicon('https://favioli.com');
  assertEquals(emoji, {
    emoji: {
      aliases: [
        'tractor',
      ],
      description: 'tractor',
      emoji: '🚜',
      emojiVersion: 1,
      group: 'Travel & Places',
      subgroup: 'transport-ground',
      tags: [
        'tractor',
        'vehicle',
      ],
      unicodeVersion: 8,
    },
    id: 'tractor',
    matcher: 'https://favioli.com',
  });
});

it('Should select different emojis for different sets', () => {
  const legacyEmoji = new Autoselector(FAVIOLI_LEGACY)
    .selectFavicon('https://favioli.com');

  const unicode11Emoji = new Autoselector(UNICODE_11)
    .selectFavicon('https://favioli.com');

  const unicode12Emoji = new Autoselector(UNICODE_12)
    .selectFavicon('https://favioli.com');

  assertEquals(legacyEmoji.emoji?.emoji, '😥');
  assertEquals(unicode12Emoji.emoji?.emoji, '🚜');
  assertEquals(unicode11Emoji.emoji?.emoji, '👄');
});

it('Should default to no flags', () => {
  const includingFlags = new Autoselector(UNICODE_09, { includeFlags: true })
    .selectFavicon('http://bpev.me');

  const withNoFlags = new Autoselector(UNICODE_09)
    .selectFavicon('http://bpev.me');

  assertEquals(includingFlags.emoji?.emoji, '🇬🇲');
  assertEquals(withNoFlags.emoji?.emoji, '🦆');
});

it('Should give the same emoji for the same domain', () => {
  const autoselector = new Autoselector(UNICODE_12);
  assertEquals(
    autoselector.selectFavicon('https://favioli.com').emoji,
    autoselector.selectFavicon('http://favioli.com/lala/blah?hehe=hoho').emoji,
  );
});
