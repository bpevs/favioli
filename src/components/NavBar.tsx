import React from "../deps.ts";
import { OPTIONS_ROUTE } from "../constants";
import { getMessage } from '../utilities/i18n';

const { BYPASSED_SITES, FAVICONS, SETTINGS } = OPTIONS_ROUTE;

export const NavBar = ({ route, onSelect }) =>
  <nav>
    <ul>
      <li className="title">🤯</li>
      <li>
        <a
          className={["navlink", route === FAVICONS && "active"]}
          children={getMessage('optionsRouteFavicons')}
          onClick={onSelect}
          href={`#${FAVICONS}`}
        />
      </li>
      <li>
        <a
          className={["navlink", route === BYPASSED_SITES && "active"]}
          children={getMessage('optionsRouteBypassedSites')}
          onClick={onSelect}
          href={`#${BYPASSED_SITES}`}
        />
      </li>
      <li>
        <a
          className={["navlink", route === SETTINGS && "active"]}
          children={getMessage('optionsRouteSettings')}
          onClick={onSelect}
          href={`#${SETTINGS}`}
        />
      </li>
    </ul>
  </nav>;
