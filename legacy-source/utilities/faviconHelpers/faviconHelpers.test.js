jest.mock("../browserHelpers/browserHelpers", () => {
  return {
    getOptions: jest.fn(() => Promise.resolve({ flagReplaced: true })),
    isBrowser: jest.fn(() => false),
  };
});

import { appendFaviconLink, removeAllFaviconLinks } from "./faviconHelpers";

describe("appendFaviconLink", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    removeAllFaviconLinks();
  });

  test("Should append a favicon link to the document head", () => {
    expect(Array.from(document.getElementsByTagName("link")).length).toBe(0);
    appendFaviconLink("😀", false);
    expect(Array.from(document.getElementsByTagName("link")).length).toBe(2);

    const links = Array.from(document.getElementsByTagName("link"));
    const [emojiLink, defaultFavicon] = links;
    expect(links.length).toBe(2);

    expect(emojiLink.rel).toBe("icon");
    expect(emojiLink.type).toBe("image/png");
    expect(emojiLink.href.length).toBeGreaterThan(100);

    expect(defaultFavicon.href).toMatch(/favicon\.ico$/);
  });

  test("Shouldn't append favicon if none is passed", () => {
    appendFaviconLink();
  });

  test("Should replace existing favioli-generated link", () => {
    expect(Array.from(document.getElementsByTagName("link")).length).toBe(0);
    appendFaviconLink("😀", false);
    appendFaviconLink("🐱‍", false);
    const links = Array.from(document.getElementsByTagName("link"));
    const [emojiLink, defaultFavicon] = links;
    expect(links.length).toBe(2);

    expect(emojiLink.rel).toBe("icon");
    expect(emojiLink.type).toBe("image/png");
    expect(emojiLink.href.length).toBeGreaterThan(100);
    expect(global.testContext.fillText).toHaveBeenCalledTimes(2);
    const [face, cat] = global.testContext.fillText.mock.calls;
    expect(face[0]).toBe("😀");
    expect(cat[0]).toBe("🐱‍");

    expect(defaultFavicon.href).toMatch(/favicon\.ico$/);
  });

  test("Should add flag to favicon if flagReplaced is enabled", () => {
    expect(Array.from(document.getElementsByTagName("link")).length).toBe(0);
    appendFaviconLink("😀", false);
    expect(global.testContext.beginPath).toBeCalled();
    expect(global.testContext.arc).toBeCalled();
    expect(global.testContext.fillStyle).toBe("red");
    expect(global.testContext.fill).toBeCalled();
  });

  test("Should not attempt to catch missing favicon.ico files if overriding", () => {
    document.head.appendChild(
      Object.assign(document.createElement("link"), { rel: "icon" }),
    );
    document.head.appendChild(
      Object.assign(document.createElement("link"), { rel: "icon" }),
    );
    expect(Array.from(document.getElementsByTagName("link")).length).toBe(2);
    appendFaviconLink("😀", true);
    expect(Array.from(document.getElementsByTagName("link")).length).toBe(3);
  });
});

describe("removeAllFaviconLinks", () => {
  test("Should remove all icon links from document head", () => {
    document.head.appendChild(
      Object.assign(document.createElement("link"), { rel: "icon" }),
    );
    document.head.appendChild(
      Object.assign(document.createElement("link"), { rel: "icon" }),
    );
    removeAllFaviconLinks();
    expect(Array.from(document.getElementsByTagName("link")).length).toBe(0);
  });

  test("Should reset existingFavicon if removing all favicons", () => {
    appendFaviconLink("😀", true);
    removeAllFaviconLinks();
    appendFaviconLink("😀", false);
    expect(Array.from(document.getElementsByTagName("link")).length).toBe(2);
  });
});
