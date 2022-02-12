import { useState } from "preact/hooks";

export default () => {
  const [value, setValue] = useState("");

  return {
    value,
    onChange: (event: Event) => {
      const target = (event.target as HTMLInputElement);
      setValue(target.value);
    },
    reset: () => setValue(""),
  };
};
