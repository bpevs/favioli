/* @jsx h */

import type { ListState } from '../hooks/use_list_state.ts';

import { h } from 'preact';
import { useRef } from 'preact/hooks';

import { FaviconData } from '../utilities/favicon_data.ts';
import ListInput from './list_input.tsx';

export interface ListProps<Type> {
  type: 'FAVICON' | 'IGNORE';
  state: ListState<FaviconData>;
}

export default function List<Type,>({ type, state }: ListProps<Type>) {
  const listRef = useRef<HTMLInputElement>(null);
  const listInputs = state.contents.map(
    (listItem: FaviconData, index: number) => {
      return (
        <ListInput
          type={type}
          key={index}
          index={index}
          value={state.contents[index] || ''}
          autoFocus={index === 0}
          updateItem={state.updateItem}
          deleteItem={(index) => {
            state.deleteItem(index);
            const firstInput = listRef?.current?.querySelector('input');
            if (firstInput) firstInput.focus();
          }}
        />
      );
    },
  );

  const newItemInput = (
    <ListInput
      type={type}
      key={state.contents.length}
      index={state.contents.length}
      addItem={state.addItem}
    />
  );

  return (
    <div className='list' ref={listRef}>
      {listInputs.concat(newItemInput)}
    </div>
  );
}
