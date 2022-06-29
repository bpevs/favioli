/* @jsx h */
import type { Emoji, EmojiGroup, EmojiMap } from '../../../models/emoji.ts';
import type { OnSelected, SetSwitch } from '../types.ts';
import type { Ref } from 'preact';

import { Fragment, h } from 'preact';
import { useCallback, useEffect, useMemo, useState } from 'preact/hooks';

import { emoji, emojiGroups, emojiGroupsArray } from '../../../models/emoji.ts';
import Groups from './groups.tsx';
import CustomUpload from './custom_upload.tsx';

const POPUP_WIDTH = 350;
const BUTTON_HEIGHT = 32;

export default function Popup(
  {
    isCustom,
    isOpen,
    onSelected,
    popupRef,
    setIsCustom,
    setIsOpen,
    submitCustomEmoji,
    customEmojis,
  }: {
    isOpen: boolean;
    isCustom: boolean;
    onSelected: OnSelected;
    // deno-lint-ignore no-explicit-any
    popupRef: Ref<any>;
    setIsCustom: SetSwitch;
    setIsOpen: SetSwitch;
    customEmojis: EmojiMap;
    submitCustomEmoji: (
      name: string,
      image: string,
      type: string,
    ) => Promise<void>;
  },
) {
  const [groupFilter, setGroupFilter] = useState('');
  const [filter, setFilter] = useFilterState('');

  const allEmojis = useMemo(() => {
    emojiGroups['Custom Emojis'].emojis = Object.keys(customEmojis)
      .map((id) => customEmojis[id]);
    return { ...emojiGroups };
  }, [customEmojis]);

  if (!isOpen) return null;

  if (isCustom) {
    return (
      <div className='emoji-selector-popup' ref={popupRef}>
        <CustomUpload
          setIsCustom={setIsCustom}
          submitCustomEmoji={submitCustomEmoji}
        />
      </div>
    );
  }

  return (
    <div className='emoji-selector-popup' ref={popupRef}>
      <div className='emoji-header'>
        <div className='emoji-group-selector'>
          {emojiGroupsArray
            .map((emojiGroup: EmojiGroup) => {
              const { name, representativeEmoji } = emojiGroup;
              const isSelected = name === groupFilter;
              const isSelectedClass = isSelected ? 'selected' : '';
              return (
                <div
                  className={`emoji-group-selector-button ${isSelectedClass}`}
                  onClick={() => setGroupFilter(isSelected ? '' : name)}
                >
                  {representativeEmoji}
                </div>
              );
            })}
        </div>
        <input
          className='emoji-filter-input'
          type='text'
          spellcheck={false}
          placeholder='Search'
          value={filter}
          onChange={setFilter}
          onInput={setFilter}
        />
      </div>

      <Groups
        setIsCustom={setIsCustom}
        emojiGroups={allEmojis}
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
