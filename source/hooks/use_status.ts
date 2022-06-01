import { useCallback, useEffect, useState } from 'preact/hooks';

const STATUS_TIME = 4000;

export default function useStatus(
  error: string,
  save: (...args: any[]) => Promise<void>,
) {
  const [status, setStatus] = useState<string>('');

  useEffect(() => {
    setStatus(error);
    setTimeout(() => setStatus(''), STATUS_TIME);
  }, [error]);

  return {
    status,
    save: useCallback(async (...args: any[]) => {
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
