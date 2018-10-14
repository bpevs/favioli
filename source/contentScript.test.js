jest.mock("./utilities/browserHelpers/browserHelpers")


import { getOptions, onRuntimeMessage, sendRuntimeMessage } from "./utilities/browserHelpers/browserHelpers"
import { appendFaviconLink, removeAllFaviconLinks } from "./utilities/faviconHelpers/faviconHelpers"


jest.mock("./utilities/faviconHelpers/faviconHelpers", () => ({
  appendFaviconLink: jest.fn(),
  removeAllFaviconLinks: jest.fn()
}))


beforeAll(() => {
  jest.clearAllMocks()
  require("./contentScript")
})


test("Did init", () => {
  expect(getOptions).toBeCalledTimes(1)
  expect(onRuntimeMessage).toBeCalledTimes(1)
  expect(sendRuntimeMessage).toBeCalledTimes(1)
})


test("Attempts to append favicon on update call", () => {
  jest.useFakeTimers()

  // Fake a browser runtime message call
  onRuntimeMessage["mock"].calls[0][0]({
    frameId: 0,
    shouldOverride: false,
    name: "🤣",
  })
  jest.runOnlyPendingTimers()

  expect(appendFaviconLink).toBeCalledWith("🤣", false)
  expect(removeAllFaviconLinks).toHaveBeenCalledTimes(0)


  // Fake another browser runtime message call
  onRuntimeMessage["mock"].calls[0][0]({
    frameId: 0,
    shouldOverride: true,
    name: "🤣",
  })
  jest.runOnlyPendingTimers()

  expect(removeAllFaviconLinks).toBeCalled()
  expect(appendFaviconLink).toBeCalledWith("🤣", true)
})

