import React from "react";


export default ({ onSelect }) => <nav><ul>
  <li className="title">🤯</li>
  <li><a
    className="navlink"
    children="Overrides"
    onClick={onSelect}
    href="#overrides" />
  </li>
  <li><a
    className="navlink"
    children="Settings"
    onClick={onSelect}
    href="#settings" />
  </li>
</ul></nav>
