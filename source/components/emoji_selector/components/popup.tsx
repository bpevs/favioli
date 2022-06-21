/* @jsx h */

import { Fragment, h } from 'preact';
import { useCallback, useEffect, useState } from 'preact/hooks';
import * as emoji from 'emoji';

import { EmojiGroup, OnSelected, SetIsOpen } from '../types.ts';
import { emojiGroups, emojiGroupsArray } from '../constants.ts';
import Groups from './groups.tsx';

export default function Popup({ isOpen, onSelected, setIsOpen, popupRef }: {
  isOpen: boolean;
  onSelected: OnSelected;
  setIsOpen: SetIsOpen;
  // deno-lint-ignore no-explicit-any
  popupRef: any;
}) {
  const [groupFilter, setGroupFilter] = useState('');
  const [filter, setFilter] = useFilterState('');

  if (!isOpen) return null;

  return (
    <div className='emoji-selector-popup' ref={popupRef}>
      <div className='emoji-header'>
        <input
          className='emoji-search'
          autoFocus
          type='text'
          spellcheck={false}
          placeholder='smile'
          value={filter}
          onChange={setFilter}
          onInput={setFilter}
        />
        <div className='group-selector'>
          {emojiGroupsArray
            .concat({
              name: '',
              representativeEmoji: 'All',
              emojis: [],
            })
            .map((emojiGroup: EmojiGroup) => {
              const isSelected = emojiGroup.name === groupFilter;
              return (
                <button
                  className={`emoji-button ${isSelected ? 'selected' : ''}`}
                  type='button'
                  onClick={() => setGroupFilter(emojiGroup.name)}
                >
                  {emojiGroup.representativeEmoji}
                </button>
              );
            })}
        </div>
      </div>

      <Groups
        emojiGroups={emojiGroups}
        filter={filter}
        groupFilter={groupFilter}
        onSelected={onSelected}
      />
    </div>
  );
}

function useFilterState(initialValue: string): [string, (e: Event) => void] {
  const [filter, setFilter] = useState(initialValue);

  const updateFilter = useCallback((e: Event) => {
    const filter = (e?.target as HTMLInputElement)?.value || '';
    setFilter(filter);
  }, []);

  return [filter, updateFilter];
}
