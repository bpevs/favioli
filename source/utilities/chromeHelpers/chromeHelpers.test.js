import { getTab, getOptions, setOptions } from "./chromeHelpers";

test.skip("Should get tab", async function () {
  const tab = await getTab();
  expect(tab).toBeDefined();
});

test.skip("Should get options from storage", async function () {
  const options = await getOptions();
  expect(options).toBeDefined();
});

test.skip("Should set options to storage", async function () {
  await setOptions({ moop: "moop" });
  const options = await getOptions();
  expect(options.moop).toBeDefined();
});

