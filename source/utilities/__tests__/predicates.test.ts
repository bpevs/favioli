import { assertStrictEquals } from 'std/asserts';
import { it } from 'std/bdd';

import { isRegexString } from '../predicates.ts';

it('should check if a string is regex', () => {
  assertStrictEquals(isRegexString('/myurlorsomething'), false);
  assertStrictEquals(isRegexString('/myregex/aa'), false);
  assertStrictEquals(isRegexString('/myregex/'), true);
});
