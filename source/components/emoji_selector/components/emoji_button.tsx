/* @jsx h */
import type { Emoji } from '../../../models/emoji.ts';

import { h } from 'preact';

export default function EmojiButton({
  emoji,
  ...props // passthrough button props
}: {
  emoji: Emoji;
  // deno-lint-ignore no-explicit-any
  [name: string]: any;
}) {
  if (emoji?.imageURL) {
    return (
      <button type='button' {...props}>
        <img src={emoji?.imageURL} />
      </button>
    );
  }

  return <button type='button' {...props}>{emoji.emoji}</button>;
}
