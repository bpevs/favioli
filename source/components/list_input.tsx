/* @jsx h */

import { h } from 'preact';
import { useCallback } from 'preact/hooks';

import { isRegexString } from '../utilities/predicates.ts';
import Only from './Only.tsx';

type Target = {
  textValue?: string;
  index: number;
  toDelete: boolean;
};

interface ListInputProps {
  autoFocus?: boolean;
  canDelete?: boolean;
  index: number;
  value?: string;
  placeholder?: string;
  deleteItem?: (index: number) => void;
  // deno-lint-ignore no-explicit-any
  addItem?: (listitem: any) => void;
  // deno-lint-ignore no-explicit-any
  updateItem?: (index: number, listItem: any) => void;
}

export default function ListInput({
    autoFocus = false,
    addItem,
    deleteItem,
    updateItem = () => {},
    placeholder = '',
    value = '',
    index,
  }: ListInputProps) {

  const onChange = useCallback((e: Event) => {
    const { value } = (e.target as HTMLInputElement);
    addItem ? addItem(value) : updateItem(index, value);
  }, [index, value, updateItem, addItem]);

  const onClickDelete = useCallback(() => {
    if (deleteItem) deleteItem(index);
  }, [index, deleteItem]);

  return (
    <div className='list-item'>
      <input
        autoFocus={autoFocus}
        className='filter'
        onInput={onChange}
        onChange={onChange}
        placeholder={placeholder}
        style={{ color: isRegexString(value) ? 'green' : 'black' }}
        value={value}
      />

      <Only if={Boolean(deleteItem)}>
        <button
          aria-label="delete"
          type="button"
          className='remove'
          onClick={onClickDelete}
          children='❌'
        />
      </Only>
    </div>
  );
}
