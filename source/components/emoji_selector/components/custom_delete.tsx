/* @jsx h */
import type { EmojiMap } from '../../../models/emoji.ts';
import type { SetRoute } from '../types.ts';
import type { Settings } from '../../../models/settings.ts';

import { Fragment, h } from 'preact';
import { useCallback, useContext, useState } from 'preact/hooks';

import { SettingsContext } from '../../../models/settings.ts';
import { deleteEmoji, emoji } from '../../../models/emoji.ts';
import { createFaviconURLFromImage } from '../../../utilities/image_helpers.ts';
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
      <div classname='emoji-group'>
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
                          .filter((desc) => desc !== emoji.description),
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
