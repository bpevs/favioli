/* @jsx h */

import { h } from 'preact';
import { useCallback, useState } from 'preact/hooks';

export type Target = { [name: string]: boolean };
export type CheckboxOnChange = (target: Target) => void;

export interface CheckboxProps {
  name: string;
  checked?: boolean;
  label: string;
  onChange?: CheckboxOnChange;
}

export default function Checkbox({
  checked = false,
  name,
  label,
  ...props
}: CheckboxProps) {
  const onChange = useCallback((e: Event) => {
    const { name, checked } = (e?.target as HTMLInputElement);
    if (props.onChange && name && typeof checked === 'boolean') {
      props.onChange({ [name]: checked });
    }
  }, [props.onChange]);

  return (
    <div className='checkbox'>
      <label className='help'>{label}</label>
      <input
        id='flag'
        type='checkbox'
        tabIndex={0}
        name={name}
        checked={checked}
        onChange={onChange}
      />
      <div className='checkmark' />
    </div>
  );
}
