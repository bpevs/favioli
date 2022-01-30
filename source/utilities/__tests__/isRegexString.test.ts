import { assertStrictEquals } from "https://deno.land/std@0.123.0/testing/asserts.ts";

import isRegexString from "../isRegexString.ts";

Deno.test("Checks whether a string is a regex", () => {
  assertStrictEquals(isRegexString("/myurlorsomething"), false);
  assertStrictEquals(isRegexString("/myregex/aa"), false);
  assertStrictEquals(isRegexString("/myregex/"), true);
});
