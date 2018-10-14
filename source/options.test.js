jest.mock("react-dom", () => ({ render: jest.fn() }))
jest.mock("./components/App/App", () => ({
  App: () => <div></div>
}))


import React from "react"
import { render } from "react-dom"
import { App } from "./components/App/App"
import "./options"


test("Did mount App to DOM", () => {
  const [ comp, node ] = render.mock.calls[0]
  expect(comp).toEqual(<App />)

  const mountPoint = window.document.getElementById("mount")
  expect(mountPoint).toBeTruthy()
  expect(node).toEqual(mountPoint)
})
