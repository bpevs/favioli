jest.mock("../../utilities/browserHelpers/browserHelpers");

import { shallow } from "enzyme";
import * as React from "react";
import { App } from "./App";
import {
  getOptions,
  setOptions,
} from "../../utilities/browserHelpers/browserHelpers";

beforeEach(() => {
  jest.clearAllMocks();
});

afterEach(() => {
  jest.useRealTimers();
});

test("Should Render App", async () => {
  const wrapper = await shallow(<App />);
  expect(wrapper).toMatchSnapshot();
});

test("Should get options on mount", async () => {
  await shallow(<App />);
  expect(getOptions).toBeCalledTimes(1);
});

test("Should Change Route", async () => {
  const wrapper = await shallow(<App />);
  wrapper.setState({ route: "SETTINGS" });
  expect(wrapper).toMatchSnapshot();
});

test("Should save options", async () => {
  const wrapper = await shallow(<App />);
  wrapper.find("button.save").simulate("click");
  expect(setOptions).toBeCalledTimes(1);
});

test("Should notify user on save for a short time", async () => {
  jest.useFakeTimers();
  const el = await shallow(<App />);

  expect(el.state("status")).toBe("");
  await el.find("button.save").simulate("click");

  await el.update();
  expect(el.state("status")).toBe("Successfully saved.");
  jest.runAllTimers();

  expect(el.state("status")).toBe("");
});
