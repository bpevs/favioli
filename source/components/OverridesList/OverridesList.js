import React from "react"
import { OverrideInput } from "./OverrideInput"

export class OverridesList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      overrides: props.overrides,
    }
  }

  componentDidUpdate() {
    if (this.state.overrides !== this.props.overrides) {
      this.setState({ overrides: this.props.overrides })
    }
  }

  async onChange(override) {
    const { emoji, filter, index, toDelete } = override
    const overrides = this.state.overrides

    if (toDelete)
      overrides.splice(index, 1)
    else {
      overrides[index] = overrides[index] || {}
      if (emoji != null) overrides[index].emoji = emoji
      if (filter != null) overrides[index].filter = filter
    }

    this.setState({ overrides }, () => {
      this.props.onChange({ overrides })
    })
  }

  render() {
    return <div className="override-inputs">{
      this.state.overrides
        .map((override, index) => <OverrideInput
          key={index}
          index={index}
          autoFocus={index === this.state.overrides.length - 1}
          onChange={this.onChange.bind(this)}
          emoji={override.emoji}
          filter={override.filter}
        />)
        .concat(<OverrideInput
          key="new"
          canDelete={false}
          index={this.state.overrides.length}
          onChange={this.onChange.bind(this)}
        />)
    }
  </div>
  }
}

OverridesList.defaultProps = {
  onChange: () => console.log("No onChange method supplied"),
  overrides: [],
}
