import React from "react"
import { getOptions, setOptions } from "../utilities/chromeHelpers/chromeHelpers";
import Checkbox from "./Checkbox"
import NavBar from "./NavBar"
import OverridesList from "./OverridesList";
const { runtime } = (typeof chrome ? chrome : browser);
import { emojiIndex } from "emoji-mart"
import getEmojiFromLegacyString from "../constants/emoji2Name"

window.allEmojis = {};
window.emojis = {}

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

  _saveOptions(overrides) {
    console.log(overrides)
    if (overrides && overrides[0] && overrides[0].emoji) {
      console.log(getEmojiFromLegacyString(overrides[0].emoji.native))
    }
  }

  render() {
    const pages = {
      overrides: <OverridesList onChange={this._saveOptions} />,
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
