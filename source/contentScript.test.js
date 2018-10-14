jest.mock("./utilities/faviconHelpers/faviconHelpers", () => ({
  appendFaviconLink: jest.fn(),
  removeAllFaviconLinks: jest.fn()
}))

import { isBrowser } from "./utilities/chromeHelpers/chromeHelpers"
import { appendFaviconLink, removeAllFaviconLinks } from "./utilities/faviconHelpers/faviconHelpers"
const { runtime, storage } = (isBrowser("CHROME") ? chrome : browser)

beforeAll(() => {
  jest.clearAllMocks()
  require("./contentScript")
})

test("Did init", () => {
  expect(storage.sync.get.mock.calls.length).toBe(1)
  expect(runtime.onMessage.addListener.mock.calls.length).toBe(1)
})

test("Attempts to append favicon on update call", () => {
  jest.useFakeTimers()

  runtime.onMessage.addListener.mock.calls[0][0]({
    frameId: 0,
    shouldOverride: false,
    name: "🤣",
  })

  jest.runOnlyPendingTimers()
  expect(appendFaviconLink).toBeCalledWith("🤣", false)
  expect(removeAllFaviconLinks).toHaveBeenCalledTimes(0)

  runtime.onMessage.addListener.mock.calls[0][0]({
    frameId: 0,
    shouldOverride: true,
    name: "🤣",
  })

  jest.runOnlyPendingTimers()
  expect(removeAllFaviconLinks).toBeCalled()
  expect(appendFaviconLink).toBeCalledWith("🤣", true)
})

