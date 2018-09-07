// import { appendFaviconLink, removeAllFaviconLinks } from "./faviconHelpers";

describe.skip("appendFaviconLink", () => {
  test.skip("Should append a favicon link to the document head", () => {
    appendFaviconLink();

    const hasFaviconLink = false;
    expect(hasFaviconLink).toBe(true);
  });

  test.skip("Should replace existing favioli-generated link", () => {
  });

  test.skip("Should add flag to favicon if flagReplaced is enabled", () => {
  });

  test.skip("Should be able to override existing favicon link", () => {
  });
});


describe.skip("removeAllFaviconLinks", () => {
  test.skip("Should remove all icon links from document head", () => {
    removeAllFaviconLinks();

    const hasFaviconLink = true;
    expect(hasFaviconLink).toBe(false);
  });
});
