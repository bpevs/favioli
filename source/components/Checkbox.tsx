/* @jsx h */

import { h } from "preact";
import { useCallback, useState } from "preact/hooks";

export type Target = { [name: string]: boolean };

export interface CheckboxProps {
  name: string;
  checked?: boolean;
  label: string;
  onChange?: (target: Target) => void;
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
  }, [setFocused]);

  const onFocus = useCallback(() => {
    setFocused(true);
  }, [setFocused]);

  const onChange = useCallback((e: Event) => {
    const { name, checked } = (e?.target as HTMLInputElement);
    if (props.onChange && name && typeof checked === "boolean") {
      props.onChange({ [name]: checked });
    }
  }, [props.onChange]);

  return (
    <div className={`checkbox ${isFocused ? "focused" : ""}`}>
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
