/* @jsx h */

import type { ListState } from '../hooks/use_list_state.ts';

import { h } from 'preact';
import ListInput from './list_input.tsx';

export interface ListProps<Type> {
  type: 'EMOJI' | 'TEXT';
  state: ListState<string>;
}

export default function List<Type,>({ type, state }: ListProps<Type>) {
  const listInputs = state.contents.map((listItem: string, index: number) => {
    const isLastItem = index === state.contents.length - 1;
    return (
      <ListInput
        canDelete
        key={index}
        index={index}
        value={state.contents[index] || ""}
        autoFocus={isLastItem}
        updateItem={state.updateItem}
        deleteItem={state.deleteItem}
      />
    );
  });

  const newItemInput = (
    <ListInput
      key={state.contents.length}
      index={state.contents.length}
      addItem={state.addItem}
    />
  );

  return (
    <div className='list'>
      {listInputs.concat(newItemInput)}
    </div>
  );
}
