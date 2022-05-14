/* @jsx h */

import { h } from 'preact';
import { useCallback, useState } from 'preact/hooks';

import { isRegexString } from '../utilities/predicates.ts';
import EmojiPicker from './EmojiPicker.tsx';
import Only from './Only.tsx';

type Favicon = {
  colons: string;
  emoticons: string[];
  id: string;
  name: string;
  native: string;
  skin: string;
  unified: string;
};

type Target = {
  textValue?: string | null;
  faviconValue?: Favicon;
  index: number;
  toDelete: boolean;
};

export const DEFAULT_FAVICON_INPUT = {
  colons: ':grinning:',
  emoticons: [],
  id: 'grinning',
  name: 'Grinning Face',
  native: '😀',
  skin: null,
  unified: '1f600',
};

export interface ListInputProps {
  autoFocus: boolean;
  canDelete: boolean;
  textValue: string;
  faviconValue: Favicon;
  index: number;
  textPlaceholder?: string;
  onChange: (target: Target) => void;
}

export default function ListInput({
  autoFocus,
  canDelete = true,
  onChange = () => {},
  textPlaceholder = '',
  textValue = '',
  index,
  faviconValue,
}: ListInputProps) {
  const [isPickerOpen, setPickerOpen] = useState(false);
  const onChangeFaviconValue = useCallback(() => {
    onChange({ index, faviconValue, toDelete: false });
    setPickerOpen(false);
  }, []);

  const onChangeTextValue = useCallback((e: Event) => {
    const { value: textValue } = (e?.target as HTMLInputElement);
    onChange({ index, textValue, toDelete: false });
    setPickerOpen(false);
  }, []);

  const onDelete = useCallback(() => {
    onChange({ index, toDelete: canDelete });
    setPickerOpen(false);
  }, []);

  const togglePicker = useCallback(() => {
    setPickerOpen(!isPickerOpen);
  }, []);

  return (
    <div className='list-item'>
      <input
        autoFocus={autoFocus}
        className='filter'
        style={{ color: isRegexString(textValue) ? 'green' : 'black' }}
        value={textValue}
        onChange={onChangeTextValue}
        placeholder={textPlaceholder}
      />

      <button
        children={faviconValue.native}
        className='favicon'
        onClick={togglePicker}
      />

      <Only if={canDelete}>
        <button className='remove' onClick={onDelete} children='X' />
      </Only>

      <Only if={isPickerOpen}>
        <EmojiPicker
          style={{
            boxShadow: '5px 3px 20px rgba(0,0,0,0.2)',
            position: 'absolute',
            right: 0,
            top: 0,
            transform: 'translateY(52%) translateX(-30%)',
            zIndex: 10,
          }}
          emoji={faviconValue.id}
          native={true}
          onSelect={onChangeFaviconValue}
          showSkinTones={false}
          skin={1}
          title='Select Emoji'
        />
      </Only>
    </div>
  );
}
