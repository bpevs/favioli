import React, { useCallback, useState } from "../deps.ts";

export interface CheckboxProps {
  checked?: boolean;
  name: string;
  label: string;
  onChange?: (...args: any[]) => void;
}

export default function Checkbox({
  checked = false,
  name,
  label,
  ...props
}: CheckboxProps) {
  const [isFocused, setFocused] = useState(false);

  const onBlur = useCallback(() => {
    setFocused(false);
  });

  const onFocus = useCallback(() => {
    setFocused(true);
  });

  const onChange = useCallback((e) => {
    const { name, checked } = e?.target || {};
    props.onChange({ [name]: checked });
  });

  const focusClass = isFocused ? "focused" : "";

  return (
    <div className={`checkbox ${focusClass}`}>
      <label className="help">{label}</label>
      <input
        id="flag"
        type="checkbox"
        tabIndex={0}
        name={name}
        checked={checked}
        onBlur={onBlur}
        onFocus={onFocus}
        onChange={onChange}
      />
      <div className="checkmark" />
    </div>
  );
}
