import { assertEquals, assertStrictEquals } from 'test/asserts';
import { it } from 'test/bdd';

import Autoselector, { AUTOSELECTOR_VERSION } from '../favicon_autoselector.ts';

const { FAVIOLI_LEGACY, UNICODE_12, UNICODE_11, UNICODE_09 } =
  AUTOSELECTOR_VERSION;

it('Should select favicon', () => {
  const autoselector = new Autoselector(AUTOSELECTOR_VERSION.UNICODE_12);
  const favicon = autoselector.selectFavicon('https://favioli.com');
  assertStrictEquals(favicon.emojiId, 'tractor');
  assertStrictEquals(favicon.matcher, 'https://favioli.com');
});

it('Should select different emojis for different sets', () => {
  const url = 'https://favioli.com';

  const legacyFavicon = new Autoselector(FAVIOLI_LEGACY).selectFavicon(url);
  assertEquals(legacyFavicon.emojiId, 'sad but relieved face');

  const unicode11Favicon = new Autoselector(UNICODE_11).selectFavicon(url);
  assertEquals(unicode11Favicon.emojiId, 'mouth');

  const unicode12Favicon = new Autoselector(UNICODE_12).selectFavicon(url);
  assertEquals(unicode12Favicon.emojiId, 'tractor');
});

it('Should default to no flags', () => {
  const url = 'http://bpev.me';

  const noFlags = new Autoselector(UNICODE_09).selectFavicon(url);
  assertEquals(noFlags.emojiId, 'duck');

  const hasFlags = new Autoselector(UNICODE_09, { includeFlags: true })
    .selectFavicon(url);
  assertEquals(hasFlags.emojiId, 'flag: Gambia');
});

it('Should give the same emoji for the same domain', () => {
  const autoselect = new Autoselector(UNICODE_12);

  assertEquals(
    autoselect.selectFavicon('https://favioli.com').emojiId,
    autoselect.selectFavicon('http://favioli.com/lala/blah?hehe=hoho').emojiId,
  );
});
