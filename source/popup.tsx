/* @jsx h */

import { h, render } from 'preact';

const App = () => {
  return (
    <div className='page'>
      HELLO
    </div>
  );
};

const mountPoint = document.getElementById('mount');
if (mountPoint) render(<App />, mountPoint);
