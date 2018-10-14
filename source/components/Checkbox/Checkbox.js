import React from "react"


function opt (context, func) {
  if (typeof func === "function") return func.bind(context)
  return () => {}
}

export class Checkbox extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      focused: false
    }
  }

  onBlur() {
    this.setState(
      { focused: false },
      opt(this, this.props.onBlur)
    )
  }

  onFocus() {
    this.setState(
      { focused: true },
      opt(this, this.props.onFocus)
    )
  }

  render() {
    const {
      checked = false,
      name,
      onChange,
    } = this.props

    const focusClass = this.state.focused ? " focused": ""

    return (
      <div className={"checkbox" + focusClass}>
        <label className="help">Flag Replaced Favicons</label>
        <input id="flag" name={name} type="checkbox"
          checked={checked}
          onBlur={this.onBlur.bind(this)}
          onChange={e => {
            onChange({ [e.target.name]: e.target.checked })
          }}
          onFocus={this.onFocus.bind(this)}
          tabIndex={0}
        />
        <div className="checkmark" />
      </div>
    )
  }
}
