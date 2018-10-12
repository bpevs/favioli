const { runtime, storage, tabs } = (typeof chrome ? chrome : browser)

beforeAll(() => {
  jest.clearAllMocks()
  require("./background")
})

test("Did Init", () => {
  expect(storage.sync.get.mock.calls.length).toBe(1)
  expect(tabs.onUpdated.addListener.mock.calls.length).toBe(1)
  expect(runtime.onMessage.addListener.mock.calls.length).toBe(1)
})

test("Sets Favicon on runtime message", () => {
  jest.useFakeTimers()

  runtime.onMessage.addListener.mock.calls[0][0]("updated:tab", {
    tab: {
      id: 5,
      url: "https://www.favioli.com",
    }
  })

  runtime.onMessage.addListener.mock.calls[0][0]("updated:tab", {
    tab: {
      favIconUrl: "https://www.favioli.com/favicon",
      id: 6,
      url: "https://www.favioli.com",
    }
  })

  runtime.onMessage.addListener.mock.calls[0][0]("updated:tab", {
    tab: {
      favIconUrl: "https://www.bookface.com/favicon",
      id: 7,
      url: "https://www.bookface.com",
    }
  })

  jest.runOnlyPendingTimers()
  const [ favioli, bookface ] = tabs.sendMessage.mock.calls

  expect(favioli).toBeDefined()
  expect(favioli[0]).toBe(5)
  expect(favioli[1]).toEqual({
    frameId: 0,
    shouldOverride: false,
    name: "🤣",
  })

  expect(bookface).toBeDefined()
  expect(bookface[0]).toBe(7)
  expect(bookface[1]).toEqual({
    frameId: 0,
    shouldOverride: true,
    name: "😀",
  })
})
