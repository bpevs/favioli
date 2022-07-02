/* @jsx h */

import type { ListState } from '../hooks/use_list_state.ts';
import type { Favicon } from '../models/favicon.ts';

import { h } from 'preact';
import { useRef } from 'preact/hooks';

import ListInput, { LIST_TYPE, ListType } from './list_input.tsx';

export type { ListType };
export { LIST_TYPE };

export interface ListProps<Type> {
  type: ListType;
  state: ListState<Favicon>;
}

export default function List<Type,>({ type, state }: ListProps<Type>) {
  const listRef = useRef<HTMLInputElement>(null);
  const { addItem, deleteItem, updateItem, contents } = state;
  return (
    <div className='list' ref={listRef}>
      {contents.map((listItem: Favicon, index: number) => (
        <ListInput
          type={type}
          key={index}
          index={index}
          value={contents[index] || ''}
          autoFocus={index === 0}
          updateItem={updateItem}
          deleteItem={(index: number) => {
            deleteItem(index);
            const firstInput = listRef?.current?.querySelector('input');
            if (firstInput) firstInput.focus();
          }}
        />
      )).concat(
        <ListInput
          type={type}
          key={contents.length}
          index={contents.length}
          addItem={addItem}
        />,
      )}
    </div>
  );
}
