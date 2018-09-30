import React from "react"
import Override from "./Override"

const DEFAULT_EMOJI = "😀";
const DEFAULT_FILTER = "";


export default ({ overrides = [] }) => <div className="override-inputs">{
  overrides
    .map((override, index) => <Override key={index} override={override} />)
    .concat(<Override key="new" override={{
      emoji: DEFAULT_EMOJI,
      filter: DEFAULT_FILTER,
    }} />)
}</div>
