/* @jsx h */

import type { ListState } from '../hooks/useListState.ts';

import { h } from 'preact';

import ListInput from './ListInput.tsx';

export interface ListProps<Type> {
  type: 'EMOJI' | 'TEXT';
  state: ListState<Type>;
  // deno-lint-ignore no-explicit-any
  onChange: (...args: any[]) => void;
}

export default function List<Type,>({ type, state }: ListProps<Type>) {
  const listInputs = state.listItems.map((listItem: Type, index: number) => {
    const isLastItem = index === state.listItems.length - 1;
    return (
      <ListInput
        canDelete
        key={index}
        index={index}
        autoFocus={isLastItem}
        updateListItem={state.updateListItem}
        deleteListItem={state.deleteListItem}
      />
    );
  });

  const newItemInput = (
    <ListInput
      key={state.listItems.length}
      index={state.listItems.length}
      addListItem={state.addListItem}
    />
  );

  return (
    <div className='list'>
      {listInputs.concat(newItemInput)}
    </div>
  );
}
