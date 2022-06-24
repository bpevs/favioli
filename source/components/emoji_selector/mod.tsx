/* @jsx h */

import { Fragment, h } from 'preact';
import { useCallback, useEffect, useRef, useState } from 'preact/hooks';
import * as emoji from 'emoji';

import useFocusObserver from '../../hooks/use_focus_observer.ts';
import { DEFAULT_EMOJI } from './constants.ts';
import { Emoji, OnSelected } from './types.ts';

import Popup from './components/popup.tsx';

export default function EmojiSelector({ onSelected, value }: {
  value?: string;
  onSelected: OnSelected;
}) {
  // deno-lint-ignore no-explicit-any
  const buttonRef = useRef<any>();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedEmoji, setSelectedEmoji] = useState<Emoji>(DEFAULT_EMOJI);

  // On new value passed to selector, attempt to set it as the current state
  useEffect(() => {
    try {
      const passedEmoji = emoji.infoByCode(value || '');
      if (!passedEmoji) return setSelectedEmoji(DEFAULT_EMOJI);
      if (selectedEmoji?.emoji === passedEmoji?.emoji) return;
      setSelectedEmoji(passedEmoji);
    } catch {
      setSelectedEmoji(DEFAULT_EMOJI);
    }
  }, [value]);

  return (
    <Fragment>
      <button
        type='button'
        className='emoji-selector-button'
        ref={buttonRef}
        onClick={useCallback(() => setIsOpen(!isOpen), [isOpen])}
      >
        {selectedEmoji?.emoji}
      </button>
      <Popup
        popupRef={useFocusObserver(
          useCallback(() => setIsOpen(false), [setIsOpen]),
          [buttonRef],
        )}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onSelected={useCallback((emoji: Emoji) => {
          if (!isOpen) return;
          onSelected(emoji);
          setSelectedEmoji(emoji);
          setIsOpen(false);
        }, [isOpen, setIsOpen])}
      />
    </Fragment>
  );
}
