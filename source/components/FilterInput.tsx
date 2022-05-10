/* @jsx h */

import { h } from 'preact';

import isRegexString from '../utilities/isRegexString.ts';

interface FilterInputProps {
  autoFocus?: boolean;
  canDelete?: boolean;
  className?: string;
  value?: string;
  placeholder?: string;
  // deno-lint-ignore no-explicit-any
  onChange: (...args: any[]) => void;
}

export default function FilterInput(props: FilterInputProps) {
  return (
    <input
      {...props}
      className='filter'
      style={{ color: isRegexString(props.value || '') ? 'green' : 'black' }}
    />
  );
}
