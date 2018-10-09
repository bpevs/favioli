import React from "react";
import ReactDOM from "react-dom";
import { getOptions, setOptions } from "./utilities/chromeHelpers/chromeHelpers";
import { Checkbox, NavBar, OverridesList } from "./components/components"

window.allEmojis = {};
window.emojis = {}

export class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      route: window.location.hash.substr(1) || "overrides",
      status: "",
    }

    this._changeRoute = this._changeRoute.bind(this)
    this._saveOptions = this._saveOptions.bind(this)
    this._updateOptions = this._updateOptions.bind(this)
  }

  async componentDidMount() {
    const options = await getOptions()
    this.setState(options)
  }

  _changeRoute(evt) {
    const route = evt.target.href.match(/\#(.*)/)[1]
    this.setState({ route })
  }

  async _saveOptions() {
    await setOptions(this.state)

    // Update status to let user know options were saved.
    this.setState({ status: "Successfully saved." }, () => {
      setTimeout(() => this.setState({ status: "" }), 1000);
    })
  }

  _updateOptions(options) {
    this.setState(options)
  }

  render() {
    const { flagReplaced, overrides, status } = this.state;
    const route = this.state.route.toUpperCase()

    const pages = {
      OVERRIDES: <OverridesList
        onChange={this._updateOptions.bind(this)}
        overrides={overrides}
      />,
      SETTINGS: (<div>
        <Checkbox
          checked={flagReplaced}
          name="flagReplaced"
          onChange={this._updateOptions.bind(this)}
        />
      </div>),
    }

    return (
      <div>
        <NavBar
          onSelect={this._changeRoute.bind(this)}
          route={route}
        />
        <div className="page">
          <h1 className="title">{route}</h1>
          {pages[route]}
          <button
            children="Save"
            className="save"
            onClick={this._saveOptions.bind(this)} />
        </div>
        <div id="status">{status}</div>
      </div>
    )
  }
}

ReactDOM.render(
  <App />,
  document.querySelector("#mount")
);
