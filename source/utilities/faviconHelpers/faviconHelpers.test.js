import { appendFaviconLink, removeAllFaviconLinks } from "./faviconHelpers"

describe("appendFaviconLink", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    removeAllFaviconLinks()
  })

  test("Should append a favicon link to the document head", () => {
    expect(Array.from(document.getElementsByTagName("link")).length).toBe(0)
    appendFaviconLink("😀", false)
    expect(Array.from(document.getElementsByTagName("link")).length).toBe(2)

    const links = Array.from(document.getElementsByTagName("link"))
    const [ emojiLink, defaultFavicon ] = links
    expect(links.length).toBe(2)

    expect(emojiLink.rel).toBe("icon")
    expect(emojiLink.type).toBe("image/png")
    expect(emojiLink.href.length).toBeGreaterThan(100)

    expect(defaultFavicon.href).toMatch(/favicon\.ico$/)
  })

  test("Should replace existing favioli-generated link", () => {
    expect(Array.from(document.getElementsByTagName("link")).length).toBe(0)
    appendFaviconLink("😀", false)
    appendFaviconLink("🐱‍", false)
    const links = Array.from(document.getElementsByTagName("link"))
    const [ emojiLink, defaultFavicon ] = links
    expect(links.length).toBe(2)

    expect(emojiLink.rel).toBe("icon")
    expect(emojiLink.type).toBe("image/png")
    expect(emojiLink.href.length).toBeGreaterThan(100)
    expect(global.testContext.fillText).toHaveBeenCalledTimes(2)
    const [ face, cat ] = global.testContext.fillText.mock.calls
    expect(face[0]).toBe("😀")
    expect(cat[0]).toBe("🐱‍")

    expect(defaultFavicon.href).toMatch(/favicon\.ico$/)
  })

  test.skip("Should add flag to favicon if flagReplaced is enabled", () => {})
  test.skip("Should be able to override existing favicon link", () => {})
})


describe("removeAllFaviconLinks", () => {
  test.skip("Should remove all icon links from document head", () => {
    removeAllFaviconLinks()

    const hasFaviconLink = true
    expect(hasFaviconLink).toBe(false)
  })
})
