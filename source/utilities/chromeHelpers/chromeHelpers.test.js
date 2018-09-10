import { getTab, getOptions, setOptions } from "./chromeHelpers";


beforeEach(() => {
  jest.clearAllMocks();
});


test("Should get tab", async function () {
  const tabId = 5;
  const callback = jest.fn();

  await getTab(tabId).then(callback);
  expect(chrome.tabs.get.mock.calls[0][0]).toBe(tabId);
  expect(callback).toBeCalled();
});


test("Should get options from storage", async function () {
  const callback = jest.fn();

  await getOptions().then(callback);

  expect(callback).toBeCalled();

  const toFetch = chrome.storage.sync.get.mock.calls[0][0];
  expect(toFetch.indexOf("flagReplaced")).toBeGreaterThan(-1);
  expect(toFetch.indexOf("overrideAll")).toBeGreaterThan(-1);
  expect(toFetch.indexOf("overrides")).toBeGreaterThan(-1);
});


test("Should set options to storage", async function () {
  const callback = jest.fn();
  const myOptions = { myOption1: "myOption1" };

  await setOptions(myOptions).then(callback);

  const fetchedOptions = chrome.storage.sync.set.mock.calls[0][0];
  expect(callback).toBeCalled();
  expect(fetchedOptions).toBe(myOptions);
});
