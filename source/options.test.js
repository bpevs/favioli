jest.mock("./utilities/optionsHelpers/optionsHelpers", () => ({
  appendOverride: jest.fn(),
  changeRoute: jest.fn(),
  restoreOptions: jest.fn(() => Promise.resolve({
    overrides: [ "a", "b", "c" ]
  })),
  saveOptions: jest.fn(),
}))

import { appendOverride, changeRoute, restoreOptions, saveOptions } from "./utilities/optionsHelpers/optionsHelpers"
import "./options"

beforeAll(() => {
  document.dispatchEvent(new Event("DOMContentLoaded"))
})

afterEach(() => {
  jest.clearAllMocks()
})

test("Should initialize", () => {
  expect(changeRoute).toBeCalledWith("overrides") // Route to overrides
  expect(restoreOptions).toBeCalled() // Restore from chromeStorage

  // Append override element for each override
  const overrides = [ "a", "b", "c" ];
  expect(appendOverride).toHaveBeenCalledTimes(3)
  expect(appendOverride).toBeCalledWith("a", overrides)
  expect(appendOverride).toBeCalledWith("b", overrides)
  expect(appendOverride).toBeCalledWith("c", overrides)
})

test("Should attempt to save on clicking save button", () => {
  const firstSaveButton = document.getElementsByClassName("save")[0]
  firstSaveButton.dispatchEvent(new Event("click"))
  expect(saveOptions).toHaveBeenCalledTimes(1)

  // Override expected to slice because Overrides will have 1 extra
  // unsaved input for in-progress override additions
  expect(saveOptions).toHaveBeenCalledWith({
    flagReplaced: false,
    overrides: [ "a", "b" ],
  })
})

test("Should attempt to save with updated checkbox state", () => {
  const firstSaveButton = document.getElementsByClassName("save")[0]
  const flagCheckbox = document.getElementById("flag")

  flagCheckbox.checked = true
  firstSaveButton.dispatchEvent(new Event("click"))
  expect(saveOptions).toHaveBeenCalledTimes(1)

  // Override expected to slice because Overrides will have 1 extra
  // unsaved input for in-progress override additions
  expect(saveOptions).toHaveBeenCalledWith({
    flagReplaced: true,
    overrides: [ "a", "b" ],
  })
})

test("NavLinks should change route", () => {
  Array.from(document.getElementsByClassName("navlink"))
    .forEach(navLink => navLink.dispatchEvent(new Event("click")))

  expect(changeRoute).toHaveBeenCalledTimes(2)
  expect(changeRoute).toBeCalledWith("navlink0")
  expect(changeRoute).toBeCalledWith("navlink1")
})
