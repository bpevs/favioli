/* @jsx h */
import type { BrowserStorage } from '../../../hooks/use_browser_storage.ts';
import type { Settings } from '../../../models/settings.ts';
import type { SetRoute } from '../types.ts';

import { h } from 'preact';
import { useCallback, useContext, useState } from 'preact/hooks';

import { createEmoji, emoji, saveEmoji } from '../../../models/emoji.ts';
import { SettingsContext } from '../../../models/settings.ts';
import { createFaviconURLFromImage } from '../../../utilities/image_helpers.ts';
import Only from '../../only.tsx';
import { ROUTE } from '../types.ts';

export default function CustomUpload({ setRoute }: { setRoute: SetRoute }) {
  const settings = useContext<BrowserStorage<Settings>>(SettingsContext);
  const { cache, saveToStorageBypassCache } = settings;
  const { customEmojiIds } = cache;

  const [imageURL, setImageURL] = useState('');
  const [description, setDescription] = useState<string>('');

  const updateImageURL = useCallback(async (event: Event) => {
    if (event.target instanceof HTMLInputElement) {
      const file = event.target?.files?.[0];
      const name = (file?.name || '').match(/(.*)\..*$/)?.[1] || '';
      if (name && !description) setDescription(name); // Autofill desc if none
      if (file instanceof Blob) {
        setImageURL(await createFaviconURLFromImage(URL.createObjectURL(file)));
      }
    }
  }, [description, setImageURL, setDescription]);

  const updateDescription = useCallback(({ target }: Event) => {
    if (target instanceof HTMLInputElement) setDescription(target.value || '');
  }, [setDescription]);

  const saveCustomEmoji = useCallback(async () => {
    try {
      await saveEmoji(createEmoji(description, imageURL));
      const deduped = Array.from(new Set(customEmojiIds.concat(description)));
      await saveToStorageBypassCache({ ...cache, customEmojiIds: deduped });
      setRoute(ROUTE.DEFAULT);
    } catch (e) {
      confirm(e);
    }
  }, [cache, description, imageURL]);

  const goBack = useCallback(() => setRoute(ROUTE.DEFAULT), [setRoute]);

  return (
    <div className='emoji-custom-upload'>
      <div>Upload Custom Favicon</div>
      <div className='emoji-custom-upload-form'>
        <label className='emoji-group-title'>Favicon Image</label>
        <input name='Favicon Image' type='file' onChange={updateImageURL} />
        <Only if={Boolean(imageURL)}>
          <img className='preview' width={100} height={100} src={imageURL} />
        </Only>

        <label className='custom-emoji-group-title'>Favicon Name</label>
        <input
          style='margin: 10px 0 20px 0;'
          name='Name'
          placeholder='Name'
          value={description}
          onChange={updateDescription}
        />
      </div>
      <button type='button' onClick={saveCustomEmoji}>submit</button>
      <button type='button' onClick={goBack}>cancel</button>
    </div>
  );
}
