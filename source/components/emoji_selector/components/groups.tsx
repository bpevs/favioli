/* @jsx h */
import { Fragment, h } from 'preact';
import { useCallback, useMemo } from 'preact/hooks';

import { Emoji, EmojiGroup, EmojiGroups, OnSelected } from '../types.ts';

export default function Groups(
  { groupFilter, filter, onSelected, emojiGroups }: {
    groupFilter: string;
    filter: string;
    onSelected: OnSelected;
    emojiGroups: EmojiGroups;
  },
) {
  const emojiFilter = useCallback((emoji: Emoji) => {
    const { tags, aliases, group, subgroup } = emoji;
    return new RegExp(filter)
      .test([...tags, ...aliases, group, subgroup].join(' '));
  }, [filter]);

  const filteredEmojiGroups = useMemo(() => {
    return Object.keys(emojiGroups)
      .filter((name: string) => !groupFilter || groupFilter === name)
      .map((name: string): EmojiGroup => ({
        ...emojiGroups[name],
        emojis: filter
          ? emojiGroups[name].emojis.filter(emojiFilter)
          : emojiGroups[name].emojis,
      }));
  }, [emojiGroups, groupFilter, filter]);

  const emojiGroupComponents = filteredEmojiGroups
    .filter((emojiGroup: EmojiGroup) => emojiGroup?.emojis?.length)
    .map((emojiGroup: EmojiGroup) => (
      <div className='emoji-group'>
        <p>{emojiGroup.name}</p>
        {emojiGroup.emojis.map((emoji) => (
          <button
            className='emoji-button'
            type='button'
            onClick={() => onSelected(emoji)}
          >
            {emoji.emoji}
          </button>
        ))}
      </div>
    ));

  return (
    <Fragment>
      {emojiGroupComponents.length ? emojiGroupComponents : 'No Matches'}
    </Fragment>
  );
}
