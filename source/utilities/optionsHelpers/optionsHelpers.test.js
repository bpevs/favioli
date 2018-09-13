import { appendOverride, changeRoute, saveOptions, restoreOptions } from "./optionsHelpers"


describe("Override Elements", () => {
  const overridesContainerEl = document.getElementsByClassName("override-inputs")[0]

  test("Should append override", () => {
    const override = { emoji: "😀", filter: /hello/ }
    appendOverride(override, [ override ])
    expect(overridesContainerEl.children.length).toBe(1)
  })

  test.skip("Should delete override", () => {})
  test.skip("Should respond to filter input", () => {})
  test.skip("Should respond to emoji input", () => {})
  test.skip("Should create another override when typing in the last empty space", () => {})
  test.skip("Should respond to regex", () => {})
})

describe("changeRoute", () => {
  test("Should change page when changing route", () => {
    const [ link1, link2 ] = Array.from(document.getElementsByClassName("navlink"))
    const [ page1, page2 ] = Array.from(document.getElementsByClassName("page"))

    changeRoute(link1.textContent)
    expect(page1.style.display).toBe("block")
    expect(page2.style.display).toBe("none")

    changeRoute(link2.textContent)
    expect(page1.style.display).toBe("none")
    expect(page2.style.display).toBe("block")
  })

  test("Should change navLink active state when changing route", () => {
    const [ link1, link2 ] = Array.from(document.getElementsByClassName("navlink"))

    changeRoute(link1.textContent)
    expect(link1.className).toBe("navlink active")
    expect(link2.className).toBe("navlink")

    changeRoute(link2.textContent)
    expect(link1.className).toBe("navlink")
    expect(link2.className).toBe("navlink active")
  })
})

test.skip("Should restore options to UI", () => {})
test.skip("Should save UI to options", () => {})
test.skip("Should notify user when saving options", () => {})
