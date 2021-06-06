import { isRegexString } from "./isRegexString";

test("Checks whether a string is a regex", () => {
  expect(isRegexString("/myurlorsomething")).toBe(false);
  expect(isRegexString("/myregex/aa")).toBe(false);
  expect(isRegexString("/myregex/")).toBe(true);
});
