/* @jsx h */

import { h } from "preact";
import { useCallback } from "preact/hooks";

import isRegexString from "../utilities/isRegexString.ts";
import Only from "./Only.tsx";

type Target = {
  textValue?: string;
  index: number;
  toDelete: boolean;
};

interface ListInputProps {
  autoFocus: boolean;
  canDelete: boolean;
  value: string;
  index: number;
  placeholder: string;
  onChange: (target: Target) => void;
}

export default function ListInput({
  autoFocus = false,
  canDelete = true,
  onChange = () => {},
  placeholder = "",
  value: textValue = "",
  index,
}: ListInputProps) {
  const onChangeValue = useCallback(() => {
    onChange({ textValue, index, toDelete: false });
  }, [onChange]);

  const onDelete = useCallback(() => {
    onChange({ index, toDelete: canDelete });
  }, [onChange]);

  return (
    <div className="list-item">
      <input
        autoFocus={autoFocus}
        className="filter"
        style={{ color: isRegexString(textValue) ? "green" : "black" }}
        value={textValue}
        onChange={onChangeValue}
        placeholder={placeholder}
      />

      <Only if={canDelete}>
        <button
          className="remove"
          onClick={onDelete}
          children="X"
        />
      </Only>
    </div>
  );
}
