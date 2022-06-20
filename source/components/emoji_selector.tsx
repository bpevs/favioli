/* @jsx h */

import { Fragment, h } from 'preact';
import { useCallback, useEffect, useMemo, useState } from 'preact/hooks';
import * as emoji from 'emoji';
import type { Emoji } from 'https://deno.land/x/emoji@0.2.0/types.ts';

const emojis = emoji.all();

// create emojiGroups
const emojiGroups: { [groupName: string]: Emoji[] } = {
  All: emojis,
  // frequentlyUsed: [],
  // custom: [],
};

emojis.forEach((emoji) => {
  if (!emojiGroups[emoji.group]) {
    emojiGroups[emoji.group] = [];
  }
  emojiGroups[emoji.group].push(emoji);
});

type OnEmojiSelected = (emoji: Emoji) => void;
interface EmojiSelectorProps {
  value?: string;
  onEmojiSelected: OnEmojiSelected;
}

const defaultEmoji = emoji.infoByCode('😀') as Emoji;

export default function EmojiSelector(props: EmojiSelectorProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedEmoji, setSelectedEmoji] = useState<Emoji>(defaultEmoji);
  const onEmojiSelected = useCallback((emoji: Emoji) => {
    if (isOpen) {
      props.onEmojiSelected(emoji);
      setSelectedEmoji(emoji);
      setIsOpen(false);
    }
  }, [isOpen, setIsOpen]);

  useEffect(() => {
    try {
      if (!props.value) return;
      const initialEmoji = emoji.infoByCode(props.value);
      if (initialEmoji) {
        setSelectedEmoji(initialEmoji);
      }
    } catch {
      // Emoji doesn't exist
    }
  }, [props.value]);

  return (
    <Fragment>
      <Button isOpen={isOpen} setIsOpen={setIsOpen} emoji={selectedEmoji} />
      <Selector isOpen={isOpen} onEmojiSelected={onEmojiSelected} />
    </Fragment>
  );
}

function Button({ isOpen, setIsOpen, emoji }: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  emoji: Emoji;
}) {
  const onClick = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  return (
    <button
      className='emoji-selector-button'
      type='button'
      onClick={onClick}
    >
      {emoji.emoji}
    </button>
  );
}

function Selector({ isOpen, onEmojiSelected }: {
  isOpen: boolean;
  onEmojiSelected: OnEmojiSelected;
}) {
  const [currGroup, setCurrGroup] = useState(Object.keys(emojiGroups)[0]);
  const [filter, setFilter] = useState('');
  const updateFilter = useCallback((e: Event) => {
    const filter = (e?.target as HTMLInputElement)?.value || '';
    setFilter(filter);
  }, []);

  if (!isOpen) return null;

  return (
    <div className='emoji-selector-popup'>
      <input
        type='text'
        spellcheck={false}
        placeholder='smile'
        value={filter}
        className='emoji-search'
        onChange={updateFilter}
        onInput={updateFilter}
      />
      <GroupSelector
        emojiGroups={Object.keys(emojiGroups).map((name) => {
          const emojis = emojiGroups[name];
          const representativeEmoji = emojis[0].emoji;
          return { name, emojis, representativeEmoji };
        })}
        setGroup={setCurrGroup}
      />
      <Group
        onSelect={onEmojiSelected}
        name={currGroup}
        emojis={emojiGroups[currGroup]
          .filter((emoji) => {
            if (!emoji) return false;
            if (!filter) return true;
            return new RegExp(filter).test(
              emoji.tags.concat(emoji.aliases).concat([
                emoji.group,
                emoji.subgroup,
              ]).join(' '),
            );
          })}
      />
      <div className='emoji-footer'>
        <ColorSelector />
      </div>
    </div>
  );
}

function ColorSelector() {
  return (
    <button type='button' className='emoji-color-selector'>
      {'🤯'}
    </button>
  );
}

interface EmojiGroup {
  name: string;
  representativeEmoji: string;
  emojis: Emoji[];
}

// Group Name + Representative
function GroupSelector(
  { emojiGroups = [], setGroup }: {
    emojiGroups: EmojiGroup[];
    setGroup: (name: string) => void;
  },
) {
  const groupButtons = useMemo(() =>
    emojiGroups.map((emojiGroup) => {
      return (
        <button
          className='emoji-button'
          type='button'
          onClick={() => setGroup(emojiGroup.name)}
        >
          {emojiGroup.representativeEmoji}
        </button>
      );
    }), [emojiGroups]);

  return (
    <div className='group-selector'>
      {groupButtons}
    </div>
  );
}

function Group({ name, emojis, onSelect }: {
  name: string;
  emojis: Emoji[];
  onSelect: (emoji: Emoji) => void;
}) {
  const selectionButtons = emojis.map((emoji) => (
    <button
      className='emoji-button'
      type='button'
      onClick={() => {
        onSelect(emoji);
      }}
    >
      {emoji.emoji}
    </button>
  ));

  return (
    <div>
      <p>{name}</p>
      {selectionButtons}
      <p>
        <button type='button'>add custom emoji</button>
      </p>
    </div>
  );
}
