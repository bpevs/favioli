import { mount, shallow } from "enzyme"
import * as React from "react"
import { Checkbox } from "./Checkbox"


test("Should Render Checkbox", () => {
  const wrapper = shallow(<Checkbox
    checked={true}
    name="my-checkbox"
    onChange={jest.fn()}
  />)

  expect(wrapper).toMatchSnapshot()
});

test("Should Render Checkbox unchecked", () => {
  const wrapper = shallow(<Checkbox
    checked={false}
    name="my-checkbox1"
    onChange={jest.fn()}
  />)

  expect(wrapper).toMatchSnapshot()
});

test("Should run onChange on change", () => {
  const onChanged = jest.fn()
  const wrapper = mount(<Checkbox
    name="my-checkbox3"
    onChange={onChanged}
  />)

  wrapper.find("input").simulate("change")
  expect(wrapper).toMatchSnapshot()
  expect(onChanged).toBeCalled()
});
