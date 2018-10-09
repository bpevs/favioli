import React from "react"


export const Checkbox = ({
  checked = false,
  name,
  onChange
}) => <div className="checkbox">
  <label className="help">Flag Replaced Favicons</label>
  <input id="flag" name={name} type="checkbox"
    onChange={e => {
      onChange({ [e.target.name]: e.target.checked })
    }}
    checked={checked}
  />
  <div className="checkmark" />
</div>
