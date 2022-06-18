/* @jsx h */

import { h } from 'preact';
import { useCallback } from 'preact/hooks';

import { isRegexString } from '../utilities/predicates.ts';
import EmojiSelector from './emoji_selector.tsx';
import Only from './only.tsx';

type Target = {
  textValue?: string;
  index: number;
  toDelete: boolean;
};

interface ListInputProps {
  autoFocus?: boolean;
  canDelete?: boolean;
  type?: 'TEXT' | 'EMOJI';
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
  type = 'TEXT',
  placeholder = '',
  value = {},
  index,
}: ListInputProps) {
  const onChangeInput = useCallback((e: Event) => {
    const site = (e.target as HTMLInputElement).value;
    const nextValue = { emoji: value.emoji, site };
    addItem ? addItem(nextValue) : updateItem(index, nextValue);
  }, [index, value, updateItem, addItem]);

  const onChangeEmoji = useCallback((emoji) => {
    const nextValue = { emoji: emoji?.emoji, site: value.site };
    addItem ? addItem(nextValue) : updateItem(index, nextValue);
  }, [index, value, updateItem, addItem]);

  const onClickDelete = useCallback(() => {
    if (deleteItem) deleteItem(index);
  }, [index, deleteItem]);

  return (
    <div className='list-item'>
      <input
        autoFocus={autoFocus}
        className='filter'
        onInput={onChangeInput}
        onChange={onChangeInput}
        placeholder={placeholder}
        style={{ color: isRegexString(value) ? 'green' : 'black' }}
        value={value?.site || ''}
      />

      <Only if={type === 'EMOJI'}>
        <EmojiSelector
          value={value?.emoji}
          onEmojiSelected={onChangeEmoji}
        />
      </Only>

      <Only if={Boolean(deleteItem)}>
        <button
          aria-label='delete'
          type='button'
          className='remove'
          onClick={onClickDelete}
          children='❌'
        />
      </Only>
    </div>
  );
}
