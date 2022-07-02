/* @jsx h */
import type { OnSelected, SetRoute } from '../types.ts';
import type { Emoji, EmojiGroup, EmojiGroups } from '../../../models/emoji.ts';

import { Fragment, h } from 'preact';
import { useCallback, useMemo } from 'preact/hooks';

import Only from '../../only.tsx';
import EmojiButton from './emoji_button.tsx';
import { ROUTE } from '../types.ts';

export default function Groups(
  { groupFilter, filter, onSelected, emojiGroups, setRoute }: {
    groupFilter: string;
    filter: string;
    onSelected: OnSelected;
    emojiGroups: EmojiGroups;
    setRoute: SetRoute;
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
    .filter((emojiGroup: EmojiGroup) => {
      if (emojiGroup?.emojis?.length) return true;
      if (emojiGroup.name === groupFilter) return true;
      return false;
    })
    .map((emojiGroup: EmojiGroup) => (
      <div className='emoji-group'>
        <p className='emoji-group-title'>{emojiGroup.name}</p>
        {emojiGroup.emojis.map((emoji) => (
          <EmojiButton
            className='emoji-group-button'
            onClick={() => onSelected(emoji)}
            emoji={emoji}
          />
        ))}
      </div>
    ));

  // If groupFilter, still show group, just for the title
  const shouldNotShowGroups = !groupFilter && !emojiGroupComponents.length;

  return (
    <Fragment>
      {shouldNotShowGroups ? '' : emojiGroupComponents}
      {!emojiGroupComponents.length ? 'No Matches' : ''}
      <Only if={groupFilter === '' || groupFilter === 'Custom Emojis'}>
        <button
          className='custom-emoji-button'
          type='button'
          onClick={() => setRoute(ROUTE.CREATE_CUSTOM)}
        >
          Add Custom Emoji
        </button>
        <button
          className='custom-emoji-button'
          type='button'
          onClick={() => setRoute(ROUTE.DELETE_CUSTOM)}
        >
          Remove Custom Emoji
        </button>
      </Only>
    </Fragment>
  );
}
