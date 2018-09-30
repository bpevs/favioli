import React from "react"
import debounce from "lodash.debounce";
import { Picker } from "emoji-mart"
import { isRegexString } from "../utilities/isRegexString/isRegexString";


const DEFAULT_EMOJI = {
  "id": "grinning",
  "name": "Grinning Face",
  "colons": ":grinning:",
  "emoticons": [],
  "unified": "1f600",
  "skin": null,
  "native": "😀"
};

const DEFAULT_FILTER = "";


export default class OverrideInput extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      emoji: props.emoji,
      filter: props.filter,
      pickerIsOpen: false,
    }
  }

  _changeFilter(evt) {
    this.setState({ filter: evt.target.value })
  }

  _selectEmoji(emoji) {
    this.setState({ emoji, pickerIsOpen: false })
  }

  _togglePicker() {
    const pickerIsOpen = !this.state.pickerIsOpen
    this.setState({ pickerIsOpen })
  }

  render() {
    const { emoji, filter, pickerIsOpen } = this.state
    const filterColor = isRegexString(filter) ? "green" : "black";

    return <div className="override">
      <input
        className="filter"
        style={{ color: filterColor }}
        value={filter}
        onChange={this._changeFilter.bind(this)}
        placeholder="favioli.com" />

      <button
        children={emoji.native}
        className="emoji"
        onClick={this._togglePicker.bind(this)}
      />

      {
        this.props.canDelete
         ? <button className="remove">X</button>
         : ""
      }

      { pickerIsOpen ? <Picker
        style={{
          boxShadow: "5px 3px 20px rgba(0,0,0,0.2)",
          position: "absolute",
          right: 0,
          top: 0,
          transform: "translateY(52%) translateX(-30%)",
          zIndex: 10,
        }}
        emoji={emoji.id}
        native={true}
        onSelect={this._selectEmoji.bind(this)}
        showSkinTones={false}
        skin={1}
        title="Select Emoji"
      /> : ""}
    </div>
  }
}

OverrideInput.defaultProps = {
  canDelete: true,
  emoji: DEFAULT_EMOJI,
  filter: DEFAULT_FILTER,
}
