/* @jsx h */
import type { BrowserStorage } from '../hooks/use_browser_storage.ts';
import type { Settings } from '../utilities/settings.ts';

import * as emoji from 'emoji';
import { h } from 'preact';
import { useCallback, useContext } from 'preact/hooks';

import { StorageContext } from '../hooks/use_browser_storage.ts';
import { createCustomEmoji, Emoji } from '../utilities/emoji.ts';
import FaviconData from '../utilities/favicon_data.ts';
import { isRegexString } from '../utilities/predicates.ts';
import EmojiSelector from './emoji_selector/mod.tsx';
import Only from './only.tsx';

type Target = {
  matcher?: string;
  index: number;
  toDelete: boolean;
};

interface ListInputProps {
  autoFocus?: boolean;
  canDelete?: boolean;
  type: 'IGNORE' | 'FAVICON';
  index: number;
  value?: FaviconData;
  placeholder?: string;
  deleteItem?: (index: number) => void;
  addItem?: (listitem: FaviconData) => void;
  updateItem?: (index: number, listItem: FaviconData) => void;
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
  const storage = useContext<BrowserStorage<Settings>>(StorageContext);
  const { cache, saveToStorage } = storage;
  const { customEmojis = {}, frequentlyUsed = [] } = cache?.emojiDatabase || {};

  const onChangeInput = useCallback((e: Event) => {
    const matcher = (e.target as HTMLInputElement).value;
    const next = new FaviconData(value?.emoji, matcher);
    addItem ? addItem(next) : updateItem(index, next);
  }, [index, value, updateItem, addItem]);

  const onChangeEmoji = useCallback((selectedEmoji: Emoji) => {
    const next = new FaviconData(selectedEmoji, value?.matcher);
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
        onInput={onChangeInput}
        onChange={onChangeInput}
        placeholder={placeholder}
        style={{ color }}
        value={value?.matcher || ''}
      />

      <Only if={type === 'FAVICON'}>
        <EmojiSelector
          value={value?.emoji}
          onSelected={onChangeEmoji}
          customEmojis={customEmojis}
          frequentlyUsed={frequentlyUsed}
          onAddedCustomEmoji={async (description: string, imageURL: string) => {
            if (!cache?.emojiDatabase) return;
            await saveToStorage({
              emojiDatabase: {
                ...cache.emojiDatabase,
                customEmojis: {
                  ...customEmojis,
                  [description]: createCustomEmoji({ description, imageURL }),
                },
              },
            });
          }}
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
