/* @jsx h */
import type { OnSelected, SetSwitch } from '../types.ts';
import type { Emoji } from '../../../utilities/emoji.ts';
import type {
  EmojiGroup,
  EmojiGroups,
} from '../../../utilities/favicon_data.ts';

import { Fragment, h } from 'preact';
import { useCallback, useMemo } from 'preact/hooks';

import EmojiButton from './emoji_button.tsx';

export default function Groups(
  { groupFilter, filter, onSelected, emojiGroups, setIsCustom }: {
    groupFilter: string;
    filter: string;
    onSelected: OnSelected;
    emojiGroups: EmojiGroups;
    setIsCustom: SetSwitch;
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
      {groupFilter === '' || groupFilter === 'Custom Emojis'
        ? (
          <button type='button' onClick={() => setIsCustom(true)}>
            Add Custom Emoji
          </button>
        )
        : ''}
    </Fragment>
  );
}
