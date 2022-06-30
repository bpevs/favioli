/* @jsx h */
import type { BrowserStorage } from '../../../hooks/use_browser_storage.ts';
import type { EmojiMap } from '../../../models/emoji.ts';
import type { Settings } from '../../../models/settings.ts';
import type { SetRoute } from '../types.ts';

import { Fragment, h } from 'preact';
import { useCallback, useContext, useState } from 'preact/hooks';

import { deleteEmoji, emoji } from '../../../models/emoji.ts';
import { SettingsContext } from '../../../models/settings.ts';
import Only from '../../only.tsx';
import { ROUTE } from '../types.ts';
import EmojiButton from './emoji_button.tsx';

export default function CustomDelete({
  customEmojis,
  setRoute,
}: {
  customEmojis: EmojiMap;
  setRoute: SetRoute;
}) {
  const settings = useContext<BrowserStorage<Settings>>(SettingsContext);
  const { cache, saveToStorageBypassCache } = settings;
  return (
    <div className='emoji-custom-upload'>
      <div className='emoji-group'>
        {Object.keys(customEmojis)
          .map((name) => {
            const emoji = customEmojis[name];
            return (
              <EmojiButton
                className='emoji-selector-button'
                onClick={async () => {
                  try {
                    if (confirm(`Delete ${name}?`)) {
                      await deleteEmoji(emoji);
                      await saveToStorageBypassCache({
                        ...cache,
                        customEmojiIds: cache.customEmojiIds
                          .filter((desc: string) => desc !== emoji.description),
                      });
                      setRoute(ROUTE.DEFAULT);
                    }
                  } catch (e) {
                    confirm(e);
                  }
                }}
                emoji={emoji}
              />
            );
          })}
      </div>
      <button
        type='button'
        onClick={useCallback(() => setRoute(ROUTE.DEFAULT), [setRoute])}
      >
        cancel
      </button>
    </div>
  );
}
