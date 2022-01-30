/* @jsx h */

import { h } from "preact";

export interface HeaderProps {
  default?: boolean;
  path?: string;
}

export default function Header(props: HeaderProps) {
  return (
    <div>
      <a href="/favicons">Favicons</a>
      <a href="/settings">Settings</a>
    </div>
  );
}
