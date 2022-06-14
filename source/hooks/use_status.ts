import { useCallback, useEffect, useState } from 'preact/hooks';

const STATUS_TIME = 4000;

// deno-lint-ignore no-explicit-any
type SaveFunc = (...args: any[]) => any | void;

export default function useStatus(
  error: string,
  save: SaveFunc,
) {
  const [status, setStatus] = useState<string>('');

  useEffect(() => {
    setStatus(error);
    setTimeout(() => setStatus(''), STATUS_TIME);
  }, [error]);

  return {
    status,
    save: useCallback<SaveFunc>(async (...args) => {
      try {
        await save(...args);
        setStatus('Successfully Saved');
      } catch (e) {
        setStatus(`Error: ${e}`);
      }
      setTimeout(() => setStatus(''), STATUS_TIME);
    }, [save]),
  };
}
