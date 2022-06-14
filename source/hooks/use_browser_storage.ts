import { useCallback, useEffect, useState } from 'preact/hooks';
import browserAPI from 'browser';
const { storage, runtime } = browserAPI;

// deno-lint-ignore no-explicit-any
type Storage = Record<string, any>;

export interface BrowserStorage<Type extends Storage> {
  error?: string;
  cache?: Type;
  loading: boolean;
  setCache: (nextCache: Partial<Type>, saveImmediately?: boolean) => void;
  saveCacheToStorage: () => Promise<void>;
}

/**
 * Interact with BrowserStorage as little as possible.
 * This method probably does NOT work well if multiple sessions open at once.
 * Basically:
 *   - Fetch current saved data from Browser on init, and save locally
 *   - get `cache` data from the locally cached copy
 *   - `setCache` onChange data to the locally cached copy without interacting with BrowserStorage
 *   - `saveCacheToStorage` saves that local data into browserStorage on a separate interaction
 */
export default function useBrowserStorage<Type extends Storage>(
  keys: readonly string[],
) {
  const [error, setError] = useState<string>();
  const [cache, setCache] = useState<Type>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    storage.sync.get(keys)
      .then((storage) => {
        if (runtime?.lastError?.message) setError(runtime?.lastError?.message);
        setCache(storage as Type);
        setLoading(false);
      });

    browserAPI.storage.onChanged.addListener(async () => {
      setCache(await storage.sync.get(keys) as Type);
    });
  }, []);

  const saveToStorage = useCallback(
    (next: Partial<Type> | void): Promise<void> => {
      if (!next) return Promise.resolve();

      return storage.sync.set(next)
        .then(() => {
          if (runtime?.lastError?.message) {
            setError(runtime?.lastError?.message);
            throw new Error(runtime?.lastError?.message);
          }
        });
    },
    [],
  );

  const result: BrowserStorage<Type> = {
    error,
    cache,
    loading,

    setCache: useCallback(
      (nextCache: Partial<Type>, saveImmediately = false): void => {
        const nextStorage = { ...cache, ...nextCache };
        setCache(nextStorage as Type);
        if (saveImmediately) saveToStorage(nextStorage);
      },
      [cache, setCache],
    ),

    saveCacheToStorage: useCallback((): Promise<void> => {
      return saveToStorage(cache);
    }, [cache]),
  };

  return result;
}
