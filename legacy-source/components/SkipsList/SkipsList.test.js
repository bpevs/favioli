import { mount, shallow } from "enzyme";
import * as React from "react";
import { SkipsList } from "./SkipsList";
import { Picker } from "emoji-mart";

const mockSkip = "bookface";

test("Should Render SkipsList", () => {
  const wrapper = shallow(
    <SkipsList
      onChange={jest.fn()}
    />,
  );

  expect(wrapper).toMatchSnapshot();
});

test("Should Render SkipsList with existing skips", () => {
  const wrapper = shallow(
    <SkipsList
      skips={[mockSkip]}
      onChange={jest.fn()}
    />,
  );

  expect(wrapper).toMatchSnapshot();
});

test("Should update with new skips", () => {
  const wrapper = mount(
    <SkipsList
      skips={[mockSkip]}
      onChange={jest.fn()}
    />,
  );

  expect(wrapper).toMatchSnapshot();

  const mockSkip1 = "/bookface/";
  wrapper.setProps({ "skips": [mockSkip, mockSkip1] });

  expect(wrapper).toMatchSnapshot();
});

test("Should edit filter", () => {
  const onChange = jest.fn();
  const wrapper = mount(
    <SkipsList
      skips={[mockSkip]}
      onChange={onChange}
    />,
  );
  expect(wrapper.state("skips").length).toBe(1);
  expect(wrapper.find(".override-inputs").children().length).toBe(2);

  const override = wrapper.find(".override-inputs input").first();
  override.simulate("change", mockSkip);

  expect(onChange).toBeCalled();
  expect(wrapper.state("skips").length).toBe(1);
  expect(wrapper.find(".override-inputs").children().length).toBe(2);
});

test("Should add override on editing last in list", () => {
  const onChange = jest.fn();
  const wrapper = mount(
    <SkipsList
      skips={[mockSkip]}
      onChange={onChange}
    />,
  );
  expect(wrapper.state("skips").length).toBe(1);
  expect(wrapper.find(".override-inputs").children().length).toBe(2);

  const override = wrapper.find(".override-inputs input").last();
  override.simulate("change", mockSkip);

  expect(onChange).toBeCalled();
  expect(wrapper.state("skips").length).toBe(2);
  expect(wrapper.find(".override-inputs").children().length).toBe(3);
});

test("Should delete override", () => {
  const onChange = jest.fn();
  const wrapper = mount(
    <SkipsList
      skips={[mockSkip]}
      onChange={onChange}
    />,
  );

  expect(wrapper.state("skips").length).toBe(1);
  expect(wrapper.find(".override-inputs").children().length).toBe(2);

  const override = wrapper.find(".override-inputs button.remove").first();
  override.simulate("click");

  expect(onChange).toBeCalled();
  expect(wrapper.state("skips").length).toBe(0);
  expect(wrapper.find(".override-inputs").children().length).toBe(1);
});
