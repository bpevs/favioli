/* @jsx h */
import type { Emoji, EmojiMap } from '../../models/emoji.ts';
import type { Settings } from '../../models/settings.ts';
import type { BrowserStorage } from '../../hooks/use_browser_storage.ts';
import type { OnSelected, Route } from './types.ts';

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
import { ROUTE } from './types.ts';

const defaultState = {};
export default function EmojiSelector({ onSelected, emojiId }: {
  emojiId?: string;
  onSelected: OnSelected;
}) {
  const buttonRef = useRef<HTMLButtonElement>();
  const settings = useContext<BrowserStorage<Settings>>(SettingsContext);
  const { cache, setCache, saveToStorageBypassCache } = settings;

  const [customEmojis, setCustomEmojis] = useState<EmojiMap>({});
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [route, setRoute] = useState<Route>(ROUTE.DEFAULT);
  const [selectedEmoji, setSelectedEmoji] = useState<Emoji>(DEFAULT_EMOJI);

  useEffect(() => {
    const currIds = Object.keys(customEmojis).sort();
    if (currIds.length > cache.customEmojiIds.length) {
      const nextEmojis: EmojiMap = {};
      cache.customEmojiIds.forEach((id: string) => {
        nextEmojis[id] = customEmojis[id];
      });
      setCustomEmojis(nextEmojis);
      return;
    }

    const matches = cache.customEmojiIds.sort()
      .every((value, index) => currIds[index] === value);

    if (matches) return;

    (async function fetchEmojis() {
      setCustomEmojis(await getEmojis(cache.customEmojiIds));
    })();
  }, [cache.customEmojiIds]);

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
        className='emoji-selector-button'
        emoji={selectedEmoji}
        onClick={useCallback(() => {
          setIsOpen(!isOpen);
          setRoute(ROUTE.DEFAULT);
        }, [isOpen])}
        ref={buttonRef}
      />
      <Popup
        customEmojis={customEmojis}
        isOpen={isOpen}
        popupRef={useFocusObserver(
          useCallback(() => {
            setIsOpen(false);
            setRoute(ROUTE.DEFAULT);
          }, [setIsOpen]),
          [buttonRef],
        )}
        onSelected={useCallback((emoji: Emoji) => {
          if (!isOpen) return;
          onSelected(emoji);
          setSelectedEmoji(emoji);
          setIsOpen(false);
        }, [isOpen, setIsOpen])}
        route={route}
        setIsOpen={setIsOpen}
        setRoute={setRoute}
      />
    </Fragment>
  );
}
