import React from "react"
import Override from "./Override"

export default class OverridesList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      overrides: props.overrides,
    }
  }

  onChange(override) {
    const { emoji, filter, index, toDelete } = override
    const overrides = this.state.overrides

    if (toDelete)
      overrides.splice(index, 1)
    else {
      overrides[index] = overrides[index] || {}
      if (emoji != null) overrides[index].emoji = emoji
      if (filter != null) overrides[index].filter = filter
    }

    this.setState(
      { overrides },
      () => this.props.onChange(overrides)
    )
  }

  render() {
    return <div className="override-inputs">{
      this.state.overrides
        .map((override, index) => <Override
          key={index}
          index={index}
          autoFocus={index === this.state.overrides.length - 1}
          onChange={this.onChange.bind(this)}
          emoji={override.emoji}
          filter={override.filter}
        />)
        .concat(<Override
          key="new"
          canDelete={false}
          index={this.state.overrides.length}
          onChange={this.onChange.bind(this)}
        />)
    }
  </div>;
  }
}

OverridesList.defaultProps = {
  overrides: [],
}
