jest.mock("react-dom", () => ({ render: jest.fn() }));
jest.mock("./components/App/App");

import React from "react";
import { render } from "react-dom";
import { App } from "./components/App/App";
import "./options";

test("Did mount App to DOM", () => {
  const mountPoint = window.document.getElementById("mount");
  expect(mountPoint).toBeTruthy() // Prevent bad test state
  ;

  expect(render).toBeCalledWith(<App />, mountPoint);
});
