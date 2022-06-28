import { useCallback, useEffect, useState } from 'preact/hooks';
import browserAPI from 'browser';

const { storage, runtime } = browserAPI;

// deno-lint-ignore no-explicit-any
type Storage = Record<string, any>;

export interface BrowserStorage<Type extends Storage> {
  error?: string;
  cache: Type;
  loading: boolean;
  setCache: (nextCache: Partial<Type>, saveImmediately?: boolean) => void;
  saveCacheToStorage: () => Promise<void>;
  saveToStorageBypassCache: (next: Partial<Type>) => Promise<void>;
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
type Keys = string | readonly string[];
export default function useBrowserStorage<Type extends Storage>(
  keys: Keys,
  defaultState: Type,
) {
  const [error, setError] = useState<string>();
  const [cache, setCache] = useState<Type>(defaultState);
  const [loading, setLoading] = useState<boolean>(true);

  const updateState = useCallback(
    // deno-lint-ignore no-explicit-any
    async function (changes: void | { [key: string]: any }) {
      const keyArray = Array.isArray(keys) ? keys : [keys];
      const noChange = changes &&
        !keyArray.some((key) => Boolean(changes[key]));
      if (!keyArray.length || noChange) return;

      const nextState: Type = Array.isArray(keys)
        ? await storage.sync.get(keyArray) as Type
        : (await storage.sync.get(keyArray))[keys as string] as Type;
      if (runtime?.lastError?.message) setError(runtime?.lastError?.message);
      if (nextState) setCache(nextState);
      setLoading(false);
    },
    [keys],
  );

  useEffect(function () {
    updateState();
    if (!storage.onChanged.hasListener(updateState)) {
      storage.onChanged.addListener(updateState);
    }
    return () => {
      storage.onChanged.removeListener(updateState);
    };
  }, []);

  const saveToStorage = useCallback(
    async (next: Partial<Type> | void): Promise<void> => {
      if (!next) return;

      await storage.sync.set(
        Array.isArray(keys) ? next : { [keys as string]: next },
      );

      if (runtime?.lastError?.message) setError(runtime?.lastError?.message);
    },
    [keys],
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

    // Save new data; don't save pre-existing cache (set storage before cache)
    saveToStorageBypassCache: useCallback(
      async (next: Partial<Type>): Promise<void> => {
        await saveToStorage(next);
        setCache({ ...cache, ...next });
      },
      [cache, setCache],
    ),
  };

  return result;
}
