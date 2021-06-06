import React from "react"
import { isRegexString } from "../../utilities/isRegexString/isRegexString"

const DEFAULT_FILTER = ""


export class SkipsInput extends React.Component {
  constructor(props) {
    super(props)
  }

  _changeFilter(evt) {
    this.props.onChange({
      filter: evt.target.value,
      index: this.props.index,
    })
  }

  _delete() {
    this.props.onChange({
      index: this.props.index,
      toDelete: true,
    })
  }

  render() {
    const { filter } = this.props
    const filterColor = isRegexString(filter) ? "green" : "black"

    return <div className="list-item">
      <input
        autoFocus={this.props.autoFocus}
        className="filter"
        style={{ color: filterColor }}
        value={filter}
        onChange={this._changeFilter.bind(this)}
        placeholder="favioli.com" />

      {
        this.props.canDelete
          ? <button className="remove" onClick={this._delete.bind(this)}>X</button>
          : ""
      }
    </div>
  }
}

SkipsInput.defaultProps = {
  canDelete: true,
  filter: DEFAULT_FILTER,
  onChange: () => { return },
}
