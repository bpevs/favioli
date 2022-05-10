import { useCallback, useEffect, useState } from 'preact/hooks';
import browserAPI from '../utilities/browserAPI.ts';

const { storage, runtime } = browserAPI;

// deno-lint-ignore no-explicit-any
type Storage = Record<string, any>;

export interface BrowserStorage<Type extends Storage> {
  error?: string;
  cache?: Type;
  setCache: (nextCache: Partial<Type>) => void;
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
  keys: string[],
) {
  const [error, setError] = useState<string>();
  const [cache, setCache] = useState<Type>();

  useEffect(() => {
    storage.sync.get(keys, (result: Type) => {
      if (runtime.lastError) setError(runtime.lastError);
      setCache(result);
    });
  }, []);

  const result: BrowserStorage<Type> = {
    error,
    cache,

    setCache: useCallback((nextCache: Partial<Type>): void => {
      const nextStorage = { ...cache, ...nextCache };
      setCache(nextStorage as Type);
    }, [cache, setCache]),

    saveCacheToStorage(): Promise<void> {
      return new Promise((resolve, reject) =>
        storage.sync.set(cache, () => {
          if (runtime.lastError) {
            setError(runtime.lastError);
            reject(runtime.lastError);
          } else {
            resolve();
          }
        })
      );
    },
  };

  return result;
}
