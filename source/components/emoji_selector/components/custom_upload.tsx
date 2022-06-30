/* @jsx h */
import type { SetRoute } from '../types.ts';

import { Fragment, h } from 'preact';
import { useCallback, useState } from 'preact/hooks';

import { emoji } from '../../../models/emoji.ts';
import { createFaviconURLFromImage } from '../../../utilities/image_helpers.ts';
import Only from '../../only.tsx';
import { ROUTE } from '../types.ts';

export default function CustomUpload(
  { setRoute, submitCustomEmoji }: {
    setRoute: SetRoute;
    submitCustomEmoji: (name: string, image: string) => Promise<void>;
  },
) {
  const [image, setSelectedEmoji] = useState('');
  const [name, setName] = useState<string>('');

  const updateImage = useCallback(async (event: Event) => {
    if (event.target instanceof HTMLInputElement) {
      const file = event.target?.files?.[0];
      if (file?.name && !name) setName(file.name.match(/(.*)\..*$/)?.[1] || '');
      const url = await createFaviconURLFromImage(
        URL.createObjectURL(file as Blob),
      );
      setSelectedEmoji(url);
    }
  }, [setSelectedEmoji, setName, name]);

  return (
    <div className='emoji-custom-upload'>
      <div>Upload Custom Favicon</div>

      <div className='emoji-custom-upload-form'>
        <label className='emoji-group-title'>Favicon Image</label>
        <input name='Favicon Image' type='file' onChange={updateImage} />
        <Only if={Boolean(image)}>
          <img width={100} height={100} src={image} className='preview' />
        </Only>

        <label style='margin-top: 20px;' className='emoji-group-title'>
          Favicon Name
        </label>
        <input
          style='margin: 10px 0 20px 0;'
          name='Name'
          placeholder='Name'
          value={name}
          onChange={useCallback(({ target }: Event) => {
            if (target instanceof HTMLInputElement) {
              setName(target.value || '');
            }
          }, [setName])}
        />
      </div>
      <button
        type='button'
        onClick={useCallback(() => submitCustomEmoji(name, image), [
          name,
          image,
        ])}
      >
        submit
      </button>
      <button
        type='button'
        onClick={useCallback(() => setRoute(ROUTE.DEFAULT), [setRoute])}
      >
        cancel
      </button>
    </div>
  );
}
