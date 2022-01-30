/* @jsx h */

import { Fragment, h } from "preact";
import { StateUpdater } from "preact/hooks";

export interface FaviconsPageProps {
  default?: boolean;
  path?: string;
  onChange?: StateUpdater<Record<string, void>>;
}

export default function FaviconsPage(props: FaviconsPageProps) {
  return (
    <Fragment>
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
    </Fragment>
  );
}
