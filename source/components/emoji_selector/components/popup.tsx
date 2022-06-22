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
        <div className='emoji-group-selector'>
          {emojiGroupsArray
            .map((emojiGroup: EmojiGroup) => {
              const isSelected = emojiGroup.name === groupFilter;
              return (
                <div
                  className={`emoji-group-selector-button ${isSelected ? 'selected' : ''}`}
                  onClick={() =>
                    setGroupFilter(
                      emojiGroup.name === groupFilter ? '' : emojiGroup.name,
                    )}
                >
                  {emojiGroup.representativeEmoji}
                </div>
              );
            })}
        </div>
        <input
          className='emoji-filter-input'
          autoFocus
          type='text'
          spellcheck={false}
          placeholder='Search'
          value={filter}
          onChange={setFilter}
          onInput={setFilter}
        />
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
