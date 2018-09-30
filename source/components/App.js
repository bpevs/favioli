import React from "react"
import Checkbox from "./Checkbox"
import NavBar from "./NavBar"
import OverridesList from "./OverridesList";

export class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      route: window.location.hash.substr(1) || "overrides",
    }
  }

  componentDidMount() {
    // const options = await restoreOptions()
    // this.setState(options)
  }

  _changeRoute(evt) {
    const route = evt.target.href.match(/\#(.*)/)[1]
    this.setState({ route })
  }

  _saveOptions() {

  }

  render() {
    const pages = {
      overrides: <OverridesList />,
      settings: (<div>
        <Checkbox />
      </div>),
    }

    return (
      <div>
        <NavBar onSelect={this._changeRoute.bind(this)} />
        <div className="page">
          <h1 className="title">
            {this.state.route.toUpperCase()}
          </h1>
          {pages[this.state.route]}
        </div>
      </div>
    )
  }
}
