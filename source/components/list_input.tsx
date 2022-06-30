/* @jsx h */
import type { Emoji } from '../models/emoji.ts';
import type { Favicon } from '../models/favicon.ts';

import { h } from 'preact';
import { useCallback, useMemo } from 'preact/hooks';

import { isRegexString } from '../utilities/regex_utils.ts';
import EmojiSelector from './emoji_selector/mod.tsx';
import Only from './only.tsx';

const IGNORE = 'IGNORE';
const FAVICON = 'FAVICON';
type ListType = typeof IGNORE | typeof FAVICON;

type Target = {
  matcher?: string;
  index: number;
  toDelete: boolean;
};

interface ListInputProps {
  autoFocus?: boolean;
  canDelete?: boolean;
  type: ListType;
  index: number;
  value?: Favicon;
  placeholder?: string;
  deleteItem?: (index: number) => void;
  addItem?: (listitem: Favicon) => void;
  updateItem?: (index: number, listItem: Favicon) => void;
}

const choices = [
  'favioli.com',
  'https://favioli.com',
  'favioli',
  '/favioli.com$/i',
  '/http:\\/\\//',
];

export default function ListInput({
  autoFocus = false,
  addItem,
  deleteItem,
  updateItem = () => {},
  type,
  value,
  index,
}: ListInputProps) {
  const onChangeMatcher = useCallback((e: Event) => {
    if (e.target instanceof HTMLInputElement) {
      const next = { emojiId: value?.emojiId || '', matcher: e.target.value };
      addItem ? addItem(next) : updateItem(index, next);
    }
  }, [index, value, updateItem, addItem]);

  const onChangeEmoji = useCallback((selectedEmoji: Emoji) => {
    const next = {
      emojiId: selectedEmoji.description,
      matcher: value?.matcher || '',
    };
    addItem ? addItem(next) : updateItem(index, next);
  }, [index, value, updateItem, addItem]);

  const onClickDelete = useCallback(() => {
    if (deleteItem) deleteItem(index);
  }, [index, deleteItem]);

  const color = isRegexString(value?.matcher || '') ? 'green' : 'black';
  const placeholder = useMemo(() => {
    return choices[Math.floor(Math.random() * choices.length)];
  }, []);

  return (
    <div className='list-item'>
      <input
        autoFocus={autoFocus}
        className='filter'
        onInput={onChangeMatcher}
        onChange={onChangeMatcher}
        placeholder={placeholder}
        style={{ color }}
        value={value?.matcher || ''}
      />

      <Only if={type === FAVICON}>
        <EmojiSelector
          emojiId={value?.emojiId}
          onSelected={onChangeEmoji}
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
