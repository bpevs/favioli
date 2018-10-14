import { Picker } from "emoji-mart"
import React from "react"
import { isRegexString } from "../../utilities/isRegexString/isRegexString"


const DEFAULT_EMOJI = {
  colons: ":grinning:",
  emoticons: [],
  id: "grinning",
  name: "Grinning Face",
  native: "😀",
  skin: null,
  unified: "1f600",
}

const DEFAULT_FILTER = ""


export class OverrideInput extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      pickerIsOpen: false,
    }
  }

  _changeFilter(evt) {
    this.props.onChange({
      filter: evt.target.value,
      index: this.props.index,
    })
    this.setState({
      pickerIsOpen: false,
    })
  }

  _delete() {
    this.props.onChange({
      index: this.props.index,
      toDelete: true,
    })
  }

  _selectEmoji(emoji) {
    this.setState(
      { pickerIsOpen: false },
      () => this.props.onChange({
        emoji,
        index: this.props.index,
      }),
    )
  }

  _togglePicker() {
    const pickerIsOpen = !this.state.pickerIsOpen
    this.setState({ pickerIsOpen })
  }

  render() {
    const { pickerIsOpen } = this.state
    const { emoji, filter } = this.props
    const filterColor = isRegexString(filter) ? "green" : "black"

    return <div className="override">
      <input
        autoFocus={this.props.autoFocus}
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
         ? <button className="remove" onClick={this._delete.bind(this)}>X</button>
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
  onChange: () => { return },
}
