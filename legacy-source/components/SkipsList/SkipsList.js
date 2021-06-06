import React from "react"
import { SkipsInput } from "./SkipsInput"


export class SkipsList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      skips: props.skips,
    }
  }

  componentDidUpdate() {
    if (this.state.skips !== this.props.skips) {
      this.setState({ skips: this.props.skips })
    }
  }

  async onChange(skip) {
    const { filter, index, toDelete } = skip
    const skips = this.state.skips

    if (toDelete)
      skips.splice(index, 1)
    else {
      if (filter != null) {
        skips[ index ] = filter
      }
    }

    this.setState({ skips }, () => {
      this.props.onChange({ skips })
    })
  }

  render() {
    return <div className="override-inputs">{
      this.state.skips
        .map((filter, index) => <SkipsInput
          key={index}
          index={index}
          autoFocus={index === this.state.skips.length - 1}
          onChange={this.onChange.bind(this)}
          filter={filter}
        />)
        .concat(<SkipsInput
          key="new"
          canDelete={false}
          index={this.state.skips.length}
          onChange={this.onChange.bind(this)}
        />)
    }
    </div>
  }
}

SkipsList.defaultProps = {
  skips: [],
}
