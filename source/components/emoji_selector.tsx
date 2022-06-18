/* @jsx h */

import { Fragment, h } from 'preact';
import { useCallback, useMemo, useState } from 'preact/hooks';
import * as emoji from 'emoji';
import type { Emoji } from 'https://deno.land/x/emoji@0.2.0/types.ts';

const emojis = emoji.all();
const emojiGroups = {};

// create emojiGroups
emojiGroups.All = emojis;
// emojiGroups.frequentlyUsed = [];
// emojiGroups.custom = [];
emojis.forEach((emoji) => {
  if (!emojiGroups[emoji.group]) {
    emojiGroups[emoji.group] = [];
  }
  emojiGroups[emoji.group].push(emoji);
});

interface EmojiSelectorProps {
  // deno-lint-ignore no-explicit-any
  [name: string]: any;
}

export default function EmojiSelector(props: EmojiSelectorProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<Emoji>(
    typeof props.value === 'string'
      ? emoji.infoByCode(props.value)
      : emoji.infoByCode('😀'),
  );
  const onEmojiSelected = useCallback((emoji) => {
    if (isOpen) {
      props.onEmojiSelected(emoji);
      setSelected(emoji);
      setIsOpen(false);
    }
  }, [isOpen, setIsOpen]);

  return (
    <Fragment>
      <Button isOpen={isOpen} setIsOpen={setIsOpen} emoji={selected} />
      <Selector isOpen={isOpen} onEmojiSelected={onEmojiSelected} />
    </Fragment>
  );
}

function Button({ isOpen, setIsOpen, emoji }) {
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

function Selector({ isOpen, onEmojiSelected }) {
  const [currGroup, setCurrGroup] = useState(Object.keys(emojiGroups)[0]);
  const [filter, setFilter] = useState('');

  if (!isOpen) return null;

  return (
    <div className='emoji-selector-popup'>
      <input
        type='text'
        spellcheck={false}
        placeholder='smile'
        value={filter}
        className='emoji-search'
        onChange={(e) => {
          setFilter(e.target.value);
        }}
        onInput={(e) => {
          setFilter(e.target.value);
        }}
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
  { emojiGroups = [], setGroup }: { emojiGroups: EmojiGroup[]; setGroup: any },
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

function Group({ name, emojis, onSelect }) {
  const selectionButtons = emojis.map((emoji) => (
    <button
      className='emoji-button'
      type='button'
      onClick={(e) => {
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
