import { assert, assertEquals, assertRejects } from 'std/asserts';
import { describe, it } from 'std/bdd';
import { assertSpyCall, assertSpyCalls, stub } from 'std/mock';
import { assertSnapshot } from 'std/snapshot';

import browserAPI from 'browser';

import {
  areEqualEmojis,
  createEmoji,
  getEmoji,
  getEmojis,
  saveEmoji,
} from '../emoji.ts';

it('createEmoji', async (t) => {
  await assertSnapshot(t, createEmoji('poro', 'poro://poro-url'));
});

describe('getEmoji', () => {
  it('should get emoji from local Emoji DB', async () => {
    const emoji = await getEmoji('grinning squinting face');
    assertEquals(emoji?.emoji, '😆');
  });

  it('should get emoji from storage.sync', async () => {
    const storageStub = stub(browserAPI.storage.sync, 'get', () => {
      return Promise.resolve({
        'Custom Emoji: poro': createEmoji('poro', 'poro://poro-url'),
      });
    });
    const emoji = await getEmoji('poro');
    assertEquals(emoji?.imageURL, 'poro://poro-url');
    assertEquals(emoji?.description, 'poro');
    assertSpyCalls(storageStub, 1);
    assertSpyCall(storageStub, 0, {
      args: [['Custom Emoji: poro']],
    });
    storageStub.restore();
  });
});

describe('saveEmoji', () => {
  it('should set emoji to storage.sync', async () => {
    const storageStub = stub(
      browserAPI.storage.sync,
      'set',
      () => Promise.resolve(),
    );
    const emoji = createEmoji('poro', 'poro://poro-url');
    await saveEmoji(emoji);
    assertSpyCalls(storageStub, 1);
    assertSpyCall(storageStub, 0, {
      args: [{ 'Custom Emoji: poro': emoji }],
      returned: Promise.resolve(),
    });
    storageStub.restore();
  });

  it('should error if emoji exists in local DB', async () => {
    const storageStub = stub(
      browserAPI.storage.sync,
      'set',
      () => Promise.resolve(),
    );
    const emoji = createEmoji('grinning squinting face', 'poro://poro-url');
    const errorMessage = 'This Emoji Already Exists!';
    await assertRejects(() => saveEmoji(emoji), Error, errorMessage);
    storageStub.restore();
  });
});

it('getEmojis', async () => {
  const storageStub = stub(browserAPI.storage.sync, 'get', () => {
    return Promise.resolve([
      createEmoji('poro', 'poro://poro-url'),
      createEmoji('nother', 'nother://nother-custom-emoji'),
    ]);
  });
  const emojis = await getEmojis(['nother', 'poro', 'grinning squinting face']);
  assertEquals(emojis['grinning squinting face'].emoji, '😆');
  assertEquals(emojis['poro'].imageURL, 'poro://poro-url');
  assertEquals(emojis['nother'].imageURL, 'nother://nother-custom-emoji');

  assertSpyCalls(storageStub, 1);

  const expectedArgs = [['Custom Emoji: nother', 'Custom Emoji: poro']];
  assertSpyCall(storageStub, 0, { args: expectedArgs });
  storageStub.restore();
});

describe('areEqualEmojis', async () => {
  const emoji_1a = await getEmoji('grinning squinting face');
  const emoji_1b = await getEmoji('grinning squinting face');
  const emoji_2 = await getEmoji('tractor');
  const customEmoji_1a = createEmoji('poro', 'poro://poro-url');
  const customEmoji_1b = createEmoji('poro', 'poro://poro-url');

  if (!emoji_1a || !emoji_1b || !emoji_2) throw new Error('Bad emoji creation');

  it('emoji_1a === emoji_1b', () => assert(areEqualEmojis(emoji_1a, emoji_1b)));
  it('emoji_1a !== emoji_2', () => assert(!areEqualEmojis(emoji_1a, emoji_2)));
  it('emoji_1b !== emoji_2', () => assert(!areEqualEmojis(emoji_1b, emoji_2)));
  it('customEmoji_1a === customEmoji_1b', () =>
    assert(areEqualEmojis(customEmoji_1a, customEmoji_1b)));
  it('customEmoji_1a !== emoji_1a', () =>
    assert(!areEqualEmojis(customEmoji_1a, emoji_1a)));
});
