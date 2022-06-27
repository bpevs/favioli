/* @jsx h */
import type { BrowserStorage } from '../hooks/use_browser_storage.ts';
import type { Emoji } from '../models/emoji.ts';
import type { Favicon } from '../models/favicon.ts';
import type { Settings } from '../models/settings.ts';

import { h } from 'preact';
import { useCallback, useContext } from 'preact/hooks';

import { createEmoji, emoji, getEmoji, saveEmoji } from '../models/emoji.ts';
import { SettingsContext } from '../models/settings.ts';
import { isRegexString } from '../utilities/predicates.ts';
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

export default function ListInput({
  autoFocus = false,
  addItem,
  deleteItem,
  updateItem = () => {},
  type,
  placeholder = '',
  value,
  index,
}: ListInputProps) {
  const settings = useContext<BrowserStorage<Settings>>(SettingsContext);
  const { cache, saveToStorageBypassCache } = settings;

  const onChangeMatcher = useCallback((e: Event) => {
    const matcher = (e.target as HTMLInputElement).value;
    const next = { emojiId: value?.emojiId || '', matcher };
    addItem ? addItem(next) : updateItem(index, next);
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
