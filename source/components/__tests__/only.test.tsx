/* @jsx h */
import { h } from 'preact';
import { assertEquals } from 'std/asserts';
import { describe, it } from 'std/bdd';
import { render } from '@testing-library/preact';

import '../../utilities/test_dom.ts';
import Only from '../only.tsx';

it('should render if === true', () => {
  const { container } = render(
    <Only if={true}>
      <span>hello</span>
    </Only>,
  );
  assertEquals(container.textContent, 'hello');
});

it('should not render if === false', () => {
  const { container } = render(
    <Only if={false}>
      <span>hello</span>
    </Only>,
  );
  assertEquals(container.textContent, '');
});
