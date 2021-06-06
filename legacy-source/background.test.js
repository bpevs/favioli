jest.mock("./utilities/browserHelpers/browserHelpers")


import { getOptions, onRuntimeMessage, onTabsUpdated, sendTabsMessage } from "./utilities/browserHelpers/browserHelpers"


beforeAll(async () => {
  jest.clearAllMocks()
  require("./background")
})


test("Did Init", () => {
  expect(getOptions).toBeCalledTimes(1)
  expect(onTabsUpdated).toBeCalledTimes(1)
  expect(onRuntimeMessage).toBeCalledTimes(1)
})

test("Sets Favicon on runtime message", () => {
  jest.useFakeTimers()

  // Normal website without favicon should send with override false
  onRuntimeMessage["mock"].calls[0][0]("updated:tab", {
    tab: {
      id: 5,
      url: "https://www.favioli.com",
    }
  })
  jest.runOnlyPendingTimers()

  expect(sendTabsMessage).toBeCalledWith(5, {
    frameId: 0,
    shouldOverride: false,
    name: "🤣",
  })

  // Normal website with favicon should not message contentScript
  onRuntimeMessage["mock"].calls[0][0]("updated:tab", {
    tab: {
      favIconUrl: "https://www.favioli.com/favicon",
      id: 6,
      url: "https://www.favioli.com",
    }
  })

  // Overridden website should send with override: true
  onRuntimeMessage["mock"].calls[0][0]("updated:tab", {
    tab: {
      favIconUrl: "https://www.bookface.com/favicon",
      id: 7,
      url: "https://www.bookface.com",
    }
  })
  jest.runOnlyPendingTimers()

  expect(sendTabsMessage).toBeCalledTimes(2)
  expect(sendTabsMessage).toBeCalledWith(7, {
    frameId: 0,
    shouldOverride: true,
    name: "😀",
  })
})
