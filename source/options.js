import React from "react"
import ReactDOM from "react-dom"
import { App } from "./components/App/App"

window.allEmojis = {}
window.emojis = {}

ReactDOM.render(
  <App />,
  document.querySelector("#mount")
)
