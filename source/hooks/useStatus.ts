import { useCallback, useEffect, useState } from 'preact/hooks';

const STATUS_TIME = 4000;

export default function useStatus(
  error: string,
  saveCacheToStorage: () => Promise<void>,
) {
  const [status, setStatus] = useState<string>('');

  useEffect(() => {
    setStatus(error);
    setTimeout(() => setStatus(''), STATUS_TIME);
  }, [error]);

  const saveSettings = useCallback(async () => {
    try {
      await saveCacheToStorage();
      setStatus('Successfully Saved');
    } catch (e) {
      setStatus(`Error: ${e}`);
    }
    setTimeout(() => setStatus(''), STATUS_TIME);
  }, [saveCacheToStorage]);

  return { saveSettings, status };
}
