import { assertEquals, assertStrictEquals } from 'test/asserts';
import { describe, it } from 'test/bdd';

import { isRegexString, parseRegExp } from '../regex_utils.ts';

describe('isRegexString and parseRegExp', () => {
  it('/myurlorsomething', () => {
    assertStrictEquals(isRegexString('/myurlorsomething'), false);
    assertEquals(parseRegExp('/myurlorsomething'), null);
  });
  it('/myregex/i', () => {
    assertStrictEquals(isRegexString('/myregex/i'), true);
    assertEquals(parseRegExp('/myregex/i'), /myregex/i);
  });
  it('/myregex/', () => {
    assertStrictEquals(isRegexString('/myregex/'), true);
    assertEquals(parseRegExp('/myregex/'), /myregex/);
  });
  it('/myr\\/egex/', () => {
    assertStrictEquals(isRegexString('/myr\\/egex/'), true);
    assertEquals(parseRegExp('/myr\\/egex/'), /myr\/egex/);
  });
  it('/myregex/aaa', () => {
    assertStrictEquals(isRegexString('/myregex/aaa'), false);
    assertEquals(parseRegExp('/myregex/aaa'), null);
  });
});
