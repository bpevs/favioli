/* @jsx h */
import type { Emoji } from '../../../utilities/emoji.ts';
import type { EmojiGroup } from '../../../utilities/favicon_data.ts';

import { Fragment, h } from 'preact';
import { useCallback, useEffect, useMemo, useState } from 'preact/hooks';
import * as emoji from 'emoji';

import { OnSelected, SetSwitch } from '../types.ts';
import {
  emojiGroups,
  emojiGroupsArray,
} from '../../../utilities/favicon_data.ts';
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
    popupRef: any;
    setIsCustom: SetSwitch;
    setIsOpen: SetSwitch;
    customEmojis: { [name: string]: Emoji };
    submitCustomEmoji: (
      name: string,
      image: string,
      type: string,
    ) => Promise<void>;
  },
) {
  const [groupFilter, setGroupFilter] = useState('');
  const [filter, setFilter] = useFilterState('');
  useEffect(() => {
    emojiGroups['Custom Emojis'].emojis = Object.keys(customEmojis).map((id) =>
      customEmojis[id]
    );
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
