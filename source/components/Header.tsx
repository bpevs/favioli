/* @jsx h */

import { h } from "preact";

export interface HeaderProps {
  default?: boolean;
  path?: string;
}

export default function Header(props: HeaderProps) {
  return (
    <nav>
      <ul>
        <li className="title">🤯</li>
        <li>
          <a
            className="navlink active"
            children="My Favicons"
            href="/favicons"
          />
        </li>
        <li>
          <a
            className="navlink"
            children="Settings"
            href="/settings"
          />
        </li>
      </ul>
    </nav>
  );
}
