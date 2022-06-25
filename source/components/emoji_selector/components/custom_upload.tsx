/* @jsx h */

import { Fragment, h } from 'preact';
import { useCallback, useState } from 'preact/hooks';
import * as emoji from 'emoji';

import Only from '../../only.tsx';
import { createFaviconURLFromImage } from '../../../utilities/create_favicon_url.ts';
import { SetSwitch } from '../types.ts';

export default function CustomUpload(
  { setIsCustom, submitCustomEmoji }: {
    setIsCustom: SetSwitch;
    submitCustomEmoji: (
      name: string,
      image: string,
      type: string,
    ) => Promise<void>;
  },
) {
  const [image, setSelectedEmoji] = useState('');
  const [name, setName] = useState<string>('');
  const exitIsCustomPage = useCallback(() => setIsCustom(false), [setIsCustom]);
  const submitCustomEmojiCb = useCallback(async () => {
    await submitCustomEmoji(name, image, 'image');
    setIsCustom(false);
  }, [image, name, setIsCustom]);

  const updateName = useCallback((event: Event) => {
    setName((event?.target as HTMLInputElement)?.value || '');
  }, [setName]);

  const updateImage = useCallback(async (event: Event) => {
    const file = (event?.target as HTMLInputElement)?.files?.[0];
    if (file?.name && !name) setName(file.name.match(/(.*)\..*$/)?.[1] || '');
    const url = await createFaviconURLFromImage(
      URL.createObjectURL(file as Blob),
    );
    setSelectedEmoji(url);
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
          onChange={updateName}
        />
      </div>
      <button type='button' onClick={submitCustomEmojiCb}>submit</button>
      <button type='button' onClick={exitIsCustomPage}>cancel</button>
    </div>
  );
}
