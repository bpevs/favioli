import { shallow } from "enzyme"
import * as React from "react"
import { App } from "./App"
import { isBrowser } from "../../utilities/chromeHelpers/chromeHelpers"
const { storage } = (isBrowser("CHROME") ? chrome : browser)


beforeEach(() => {
  jest.clearAllMocks()
})

afterEach(() => {
  jest.useRealTimers()
})

test("Should Render App", async () => {
  const wrapper = await shallow(<App />)
  expect(wrapper).toMatchSnapshot()
});

test("Should get options on mount", async () => {
  await shallow(<App />)
  const getOptions = storage.sync.get.mock
  expect(getOptions.calls.length).toBe(1)
})

test("Should Change Route", async () => {
  const wrapper = await shallow(<App />)
  wrapper.setState({ route: "SETTINGS" })
  expect(wrapper).toMatchSnapshot()
})

test("Should save options", async () => {
  const setOptions = storage.sync.get.mock
  const wrapper = await shallow(<App />)
  wrapper.find("button.save").simulate("click")
  expect(setOptions.calls.length).toBe(1)
})

test("Should notify user on save for a short time", async () => {
  jest.useFakeTimers()
  const el = await shallow(<App />)

  expect(el.state("status")).toBe("")
  await el.find("button.save").simulate("click")

  await el.update()
  expect(el.state("status")).toBe("Successfully saved.")
  jest.runAllTimers()

  expect(el.state("status")).toBe("")
})
