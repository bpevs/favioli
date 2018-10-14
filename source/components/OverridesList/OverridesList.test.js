import { mount, shallow } from "enzyme"
import * as React from "react"
import { OverridesList } from "./OverridesList"
import { Picker } from "emoji-mart"

const mockOverride = {
  emoji: {
      "colons": ":grinning:",
      "emoticons": [],
      "id": "grinning",
      "name": "Grinning Face",
      "native": "😀",
      "skin": null,
      "unified": "1f600",
  },
  filter: "bookface",
}

test("Should Render OverridesList", () => {
  const wrapper = shallow(<OverridesList
    onChange={jest.fn()}
  />)

  expect(wrapper).toMatchSnapshot()
})

test("Should Render OverridesList with existing overrides", () => {
  const wrapper = shallow(<OverridesList
    overrides={[ mockOverride ]}
    onChange={jest.fn()}
  />)

  expect(wrapper).toMatchSnapshot()
})

test("Should update with new overrides", () => {
  const wrapper = mount(<OverridesList
    overrides={[ mockOverride ]}
    onChange={jest.fn()}
  />)

  expect(wrapper).toMatchSnapshot()

  const mockOverride1 = Object.assign({}, mockOverride, { filter: "/bookface/" })
  wrapper.setProps({ "overrides": [ mockOverride, mockOverride1 ] })

  expect(wrapper).toMatchSnapshot()
})


test("Should edit filter", () => {
  const onChange = jest.fn()
  const wrapper = mount(<OverridesList
    overrides={[ mockOverride ]}
    onChange={onChange}
  />)
  expect(wrapper.state("overrides").length).toBe(1)
  expect(wrapper.find(".override-inputs").children().length).toBe(2)

  const override = wrapper.find(".override-inputs input").first()
  override.simulate("change", mockOverride)

  expect(onChange).toBeCalled()
  expect(wrapper.state("overrides").length).toBe(1)
  expect(wrapper.find(".override-inputs").children().length).toBe(2)
})


test("Should add override on editing last in list", () => {
  const onChange = jest.fn()
  const wrapper = mount(<OverridesList
    overrides={[ mockOverride ]}
    onChange={onChange}
  />)
  expect(wrapper.state("overrides").length).toBe(1)
  expect(wrapper.find(".override-inputs").children().length).toBe(2)

  const override = wrapper.find(".override-inputs input").last()
  override.simulate("change", mockOverride)

  expect(onChange).toBeCalled()
  expect(wrapper.state("overrides").length).toBe(2)
  expect(wrapper.find(".override-inputs").children().length).toBe(3)
})


test("Should delete override", () => {
  const onChange = jest.fn()
  const wrapper = mount(<OverridesList
    overrides={[ mockOverride ]}
    onChange={onChange}
  />)

  expect(wrapper.state("overrides").length).toBe(1)
  expect(wrapper.find(".override-inputs").children().length).toBe(2)

  const override = wrapper.find(".override-inputs button.remove").first()
  override.simulate("click")

  expect(onChange).toBeCalled()
  expect(wrapper.state("overrides").length).toBe(0)
  expect(wrapper.find(".override-inputs").children().length).toBe(1)
})


test("Should open emojimart on clicking emoji button", () => {
  const onChange = jest.fn()
  const wrapper = mount(<OverridesList
    onChange={onChange}
  />)

  const override = wrapper.find(".override-inputs button.emoji").first()
  override.simulate("click")
  expect(onChange).toHaveBeenCalledTimes(0)

  expect(wrapper.find(Picker).first().exists()).toBe(true)
})

test("Should run onChange and close emojimart on selecting emoji", () => {
  const onChange = jest.fn()
  const wrapper = mount(<OverridesList
    onChange={onChange}
  />)

  const override = wrapper.find(".override-inputs button.emoji").first()
  override.simulate("click", mockOverride)

  const emoji = wrapper.find("span.emoji-mart-emoji span").first()
  emoji.simulate("click")

  expect(onChange).toHaveBeenCalledTimes(1)
  expect(wrapper.find(Picker).first().exists()).toBe(false)
})
