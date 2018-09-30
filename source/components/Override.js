import React from "react"
import { Picker } from "emoji-mart"

export default ({ override }) => <div>
  <input
    className="site-selector"
    value={override.filter}
    placeholder="favioli.com" />
  <button
    className="face-selector">
      {override.emoji}
    </button>
  <Picker
    emoji="exploding_head"
    native={true}
    title="Select Emoji"
    />
</div>
