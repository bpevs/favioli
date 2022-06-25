/* @jsx h */

import { Fragment, h } from 'preact';
import { useCallback, useEffect, useRef, useState } from 'preact/hooks';
import * as emoji from 'emoji';

import useFocusObserver from '../../hooks/use_focus_observer.ts';
import { DEFAULT_EMOJI } from './constants.ts';
import { OnSelected } from './types.ts';
import { createCustomEmoji, Emoji } from '../../utilities/emoji.ts';

import EmojiButton from './components/emoji_button.tsx';
import Popup from './components/popup.tsx';

function areSameEmoji(emoji1: Emoji, emoji2: Emoji): boolean {
  if (!emoji1 || !emoji2) return false;
  if (emoji1.imageURL && (emoji1.imageURL === emoji2.imageURL)) return true;
  if (emoji1.videoURL && (emoji1.videoURL === emoji2.videoURL)) return true;
  if (emoji1.emoji && (emoji1.emoji === emoji2.emoji)) return true;
  return false;
}

export default function EmojiSelector(
  { onAddedCustomEmoji, onSelected, value, customEmojis, frequentlyUsed }: {
    value?: Emoji;
    onSelected: OnSelected;
    onAddedCustomEmoji: (description: string, url: string) => Promise<void>;
    customEmojis: { [name: string]: Emoji };
    frequentlyUsed: Emoji[];
  },
) {
  const buttonRef = useRef<HTMLButtonElement>();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [selectedEmoji, setSelectedEmoji] = useState<Emoji>(DEFAULT_EMOJI);

  // For reverting to default state when list_items are deleted
  useEffect(function updateStateWithNewValue() {
    try {
      const passedEmoji = value;
      if (!passedEmoji) return setSelectedEmoji(DEFAULT_EMOJI);
      if (!areSameEmoji(passedEmoji, selectedEmoji)) {
        setSelectedEmoji(passedEmoji);
      }
    } catch {
      setSelectedEmoji(DEFAULT_EMOJI);
    }
  }, [value]);

  return (
    <Fragment>
      <EmojiButton
        emoji={selectedEmoji}
        className='emoji-selector-button'
        ref={buttonRef}
        onClick={useCallback(() => {
          setIsOpen(!isOpen);
          setIsCustom(false);
        }, [isOpen])}
      />
      <Popup
        popupRef={useFocusObserver(
          useCallback(() => {
            setIsOpen(false);
            setIsCustom(false);
          }, [setIsOpen]),
          [buttonRef],
        )}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        isCustom={isCustom}
        setIsCustom={setIsCustom}
        customEmojis={customEmojis}
        submitCustomEmoji={onAddedCustomEmoji}
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
