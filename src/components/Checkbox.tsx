import { React } from "../deps.ts";

export type Target = { [name: string]: boolean };

export interface CheckboxProps {
  checked?: boolean;
  name: string;
  label: string;
  onChange?: (target: Target) => void;
}

export default function Checkbox({
  checked = false,
  name,
  label,
  ...props
}: CheckboxProps) {
  const [isFocused, setFocused] = React.useState(false);

  const onBlur = React.useCallback(() => {
    setFocused(false);
  }, [setFocused]);

  const onFocus = React.useCallback(() => {
    setFocused(true);
  }, [setFocused]);

  const onChange = React.useCallback((e) => {
    const { name, checked } = e?.target || {};
    if (props.onChange) props.onChange({ [name]: checked });
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
