/* @jsx h */

import { h } from "preact";
import { useCallback } from "preact/hooks";

import FilterInput from "./FilterInput.tsx";
import Only from "./Only.tsx";

type Target = {
  textValue?: string;
  index: number;
  toDelete: boolean;
};

interface ListInputProps {
  autoFocus?: boolean;
  canDelete?: boolean;
  index: number;
  value?: string;
  placeholder?: string;
  deleteListItem?: (index: number) => void;
  // deno-lint-ignore no-explicit-any
  addListItem?: (listitem: any) => void;
  // deno-lint-ignore no-explicit-any
  updateListItem?: (index: number, listItem: any) => void;
}

export default function ListInput(props: ListInputProps) {
  const {
    autoFocus = false,
    canDelete = true,
    addListItem = () => {},
    deleteListItem = () => {},
    updateListItem = () => {},
    placeholder = "",
    value = "",
    index,
  } = props;

  const onChange = useCallback((e: Event) => {
    const target = (e.target as HTMLInputElement);
    if (addListItem) {
      addListItem(target.value);
    } else {
      updateListItem(index, target.value);
    }
  }, [index, updateListItem, addListItem]);

  const onClickDelete = useCallback((e: Event) => {
    if (deleteListItem) deleteListItem(index);
  }, [index, deleteListItem]);

  return (
    <div className="list-item">
      <FilterInput
        autoFocus={autoFocus}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />

      <Only if={canDelete}>
        <button
          className="remove"
          onClick={onClickDelete}
          children="X"
        />
      </Only>
    </div>
  );
}
