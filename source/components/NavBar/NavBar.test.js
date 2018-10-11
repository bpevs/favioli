import { mount, shallow } from "enzyme"
import * as React from "react"
import { NavBar } from "./NavBar"


test("Should Render NavBar", () => {
  const wrapper1 = shallow(<NavBar
    route="OVERRIDES"
    onSelect={jest.fn()}
  />)

  expect(wrapper1).toMatchSnapshot()

  const wrapper2 = shallow(<NavBar
    route="SETTINGS"
    onSelect={jest.fn()}
  />)

  expect(wrapper2).toMatchSnapshot()
});

test("Should run onSelect on click", () => {
  const onSelect = jest.fn()
  const wrapper = mount(<NavBar
    route="SETTINGS"
    onSelect={onSelect}
  />)

  wrapper.find("a").first().simulate("click")
  expect(onSelect).toBeCalled()
});
