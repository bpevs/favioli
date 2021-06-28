import { getOptions, getTab, isBrowser, setOptions } from "./browserHelpers";
const { storage, tabs } = isBrowser("CHROME")
  ? window["chrome"]
  : window["browser"];

beforeEach(() => {
  jest.clearAllMocks();
});

test("Should get tab", async function () {
  const tabId = 5;
  const callback = jest.fn();

  await getTab(tabId).then(callback);
  expect(tabs.get["mock"].calls[0][0]).toBe(tabId);
  expect(callback).toBeCalled();
});

test("Should get options from storage", async function () {
  const callback = jest.fn();

  await getOptions().then(callback);

  expect(callback).toBeCalled();

  const toFetch = storage.sync.get["mock"].calls[0][0];
  expect(toFetch.indexOf("flagReplaced")).toBeGreaterThan(-1);
  expect(toFetch.indexOf("overrideAll")).toBeGreaterThan(-1);
  expect(toFetch.indexOf("overrides")).toBeGreaterThan(-1);
});

test("Should convert emoji string overrides to objects", async function () {
  const options = await getOptions();

  expect(options.overrides[0].emoji).toEqual({
    "colons": ":grinning:",
    "emoticons": [],
    "id": "grinning",
    "name": "Grinning Face",
    "native": "😀",
    "short_names": [
      "grinning",
    ],
    "skin": null,
    "unified": "1f600",
  });
});

test("Should set options to storage", async function () {
  const callback = jest.fn();
  const myOptions = {
    flagReplaced: false,
    overrideAll: true,
    overrides: ["override1"],
    skips: [],
    moo: "hehehe",
  };

  await setOptions(myOptions).then(callback);

  const fetchedOptions = storage.sync.set["mock"].calls[0][0];
  expect(callback).toBeCalled();

  delete myOptions.moo; // Trim unsupported options
  expect(fetchedOptions).toEqual(myOptions);
});
