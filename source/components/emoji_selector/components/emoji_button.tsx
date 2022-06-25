/* @jsx h */
import { h } from 'preact';
import { Emoji } from '../../../utilities/emoji.ts';

export default function EmojiButton({
  emoji,
  ...props // passthrough button props
}: {
  emoji: Emoji;
  // deno-lint-ignore no-explicit-any
  [name: string]: any;
}) {
  const isCustom = Boolean(emoji?.imageURL?.length || emoji?.videoURL?.length);

  if (isCustom) {
    return (
      <button type='button' {...props}>
        <img src={emoji?.imageURL} />
      </button>
    );
  }

  return <button type='button' {...props}>{emoji.emoji}</button>;
}
