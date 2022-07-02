/* @jsx h */
import type { Emoji } from '../../../models/emoji.ts';
import type { Ref } from 'preact';

import { h } from 'preact';

interface EmojiButtonProps {
  emoji: Emoji;
  className?: string;
  onClick?: (e: Event) => void;
  // deno-lint-ignore no-explicit-any
  ref?: Ref<any>;
}

export default function EmojiButton({
  emoji,
  ...props
}: EmojiButtonProps) {
  if (emoji?.imageURL) {
    return (
      <button type='button' {...props}>
        <img src={emoji?.imageURL} />
      </button>
    );
  }

  return <button type='button' {...props}>{emoji.emoji}</button>;
}
