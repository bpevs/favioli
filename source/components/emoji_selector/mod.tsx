/* @jsx h */
import type { Emoji, EmojiMap } from '../../models/emoji.ts';
import type { Settings } from '../../models/settings.ts';
import type { BrowserStorage } from '../../hooks/use_browser_storage.ts';

import { Fragment, h } from 'preact';
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'preact/hooks';

import useBrowserStorage from '../../hooks/use_browser_storage.ts';
import useFocusObserver from '../../hooks/use_focus_observer.ts';
import {
  areEqualEmojis,
  createEmoji,
  DEFAULT_EMOJI,
  emoji,
  getEmoji,
  getEmojis,
  getEmojiStorageId,
  saveEmoji,
} from '../../models/emoji.ts';
import { SettingsContext } from '../../models/settings.ts';
import EmojiButton from './components/emoji_button.tsx';
import Popup from './components/popup.tsx';
import { OnSelected } from './types.ts';

const defaultState = {};
export default function EmojiSelector({ onSelected, emojiId }: {
  emojiId?: string;
  onSelected: OnSelected;
}) {
  const settings = useContext<BrowserStorage<Settings>>(SettingsContext);
  const { cache, setCache, saveToStorageBypassCache } = settings;
  const [customEmojis, setCustomEmojis] = useState({});
  useEffect(() => {
    const currIds = Object.keys(customEmojis).sort();
    const matches = cache.customEmojiIds.sort()
      .every((value, index) => currIds[index] === value);

    if (!matches) {
      (async function fetchEmojis() {
        setCustomEmojis(await getEmojis(cache.customEmojiIds));
      })();
    }
  }, [cache.customEmojiIds]);

  const buttonRef = useRef<HTMLButtonElement>();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [selectedEmoji, setSelectedEmoji] = useState<Emoji>(DEFAULT_EMOJI);

  // For reverting to default state when list_items are deleted
  useEffect(function updateStateWithNewValue() {
    emojiIdToEmoji();
    async function emojiIdToEmoji() {
      if (!emojiId) return setSelectedEmoji(DEFAULT_EMOJI);
      const nextEmoji = await getEmoji(emojiId);
      if (!nextEmoji) return setSelectedEmoji(DEFAULT_EMOJI);
      if (!areEqualEmojis(nextEmoji, selectedEmoji)) {
        setSelectedEmoji(nextEmoji);
      }
    }
  }, [emojiId]);

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
        submitCustomEmoji={useCallback(async (description, url) => {
          await saveEmoji(createEmoji(description, url));
          const customEmojiIds = Array.from(
            new Set(cache.customEmojiIds.concat(description)),
          );
          await saveToStorageBypassCache({ ...cache, customEmojiIds });
        }, [settings, cache.customEmojiIds])}
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
