import React, { useCallback, useState } from "../deps.ts";
import { isRegexString } from "../utilities/isRegexString.ts";

const DEFAULT_INPUT = '';

export interface ListInputProps {
  autoFocus: any;
  canDelete: boolean;
  value: string;
  index: number;
  placeholder: string;
  onChange: (
    value: string | null,
    index: number,
    toDelete: boolean
  ) => void;
}

export default function ListInput({
  autoFocus,
  canDelete = true,
  onChange = () => {},
  placeholder='',
  value = '',
}: ListInputProps) {
  const onChangeValue = useCallback(() => {
    onChange(value, index, false);
  });

  const onDelete = useCallback(() => {
    onChange(null, index, canDelete);
  });

  return (
    <div className="list-item">
      <input
        autoFocus={autoFocus}
        className="filter"
        style={{ color: isRegexString(filter) ? "green" : "black" }}
        value={value}
        onChange={onChangeValue}
        placeholder={placeholder}
      />

      {canDelete
        ? <button className="remove" onClick={onDelete} children="X" />
        : ""}
    </div>
  )
}
