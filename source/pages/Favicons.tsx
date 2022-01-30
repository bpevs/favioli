/* @jsx h */

import { h } from "preact";

export interface FaviconsPageProps {
  default?: boolean;
  path?: string;
}

export default function FaviconsPage(props: FaviconsPageProps) {
  return (
    <div>
      <h1>Modify Favicons for These Sites:</h1>
      <ul>
        <li>favicon 1</li>
        <li>favicon 2</li>
        <li>favicon 3</li>
      </ul>

      <h1>Ignore These Sites:</h1>
      <ul>
        <li>ignore 1</li>
        <li>ignore 2</li>
        <li>ignore 3</li>
      </ul>
    </div>
  );
}
