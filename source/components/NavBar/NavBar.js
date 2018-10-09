import React from "react";


export const NavBar = ({
  route, onSelect
}) => <nav><ul>
  <li className="title">🤯</li>
  <li><a
    className={"navlink " + (route === "OVERRIDES" ? "active" : "")}
    children="Overrides"
    onClick={onSelect}
    href="#overrides" />
  </li>
  <li><a
    className={"navlink " + (route === "SETTINGS" ? "active" : "")}
    children="Settings"
    onClick={onSelect}
    href="#settings" />
  </li>
</ul></nav>
