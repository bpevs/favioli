/* @jsx h */

import { h } from 'preact';

export interface HeaderProps {
  route?: string;
}

export default function Header({ route }: HeaderProps) {
  const isDefaultRoute = route !== '#settings' && route !== '#about';

  return (
    <nav>
      <ul>
        <li className='logo'>🤯</li>
        <li className={isDefaultRoute ? 'active' : ''}>
          <a children='My Favicons' href='#favicons' />
        </li>
        <li className={route === '#settings' ? 'active' : ''}>
          <a children='Settings' href='#settings' />
        </li>
        <li className={route === '#about' ? 'active' : ''}>
          <a children='About' href='#about' />
        </li>
      </ul>
    </nav>
  );
}
