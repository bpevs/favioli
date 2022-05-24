import { useCallback, useEffect, useState } from 'preact/hooks';
import browserAPI from '../utilities/browser_api.ts';
import {
  requestPermissionToAllSites,
  requestPermissionToSites,
} from '../utilities/permissions.ts';

const { storage, runtime } = browserAPI;

// deno-lint-ignore no-explicit-any
type Storage = Record<string, any>;

export interface BrowserStorage<Type extends Storage> {
  error?: string;
  cache?: Type;
  loading: boolean;
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
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    storage.sync.get(keys, (result: Type) => {
      if (runtime.lastError) setError(runtime.lastError);
      setCache(result);
      setLoading(false);
    });
  }, []);

  const result: BrowserStorage<Type> = {
    error,
    cache,
    loading,

    setCache: useCallback((nextCache: Partial<Type>): void => {
      const nextStorage = { ...cache, ...nextCache };
      setCache(nextStorage as Type);
    }, [cache, setCache]),

    async saveCacheToStorage(): Promise<void> {
      const nextStorage = cache;
      if (!nextStorage) return;
      console.log(nextStorage);

      const origins = nextStorage.siteList
        .map(function validateUrl(site: string) {
          try {
            return new URL(site).origin + '/';
          } catch (e) {
            console.error(e);
            return false;
          } /* Not a URL */
        })
        .filter(Boolean);

      const hasNonUrlPattern = origins.length === nextStorage.siteList.length;
      const hasPermission = hasNonUrlPattern
        ? await requestPermissionToSites(origins)
        : await requestPermissionToAllSites();

      if (!hasPermission) return Promise.reject('No Permission Given');

      return new Promise((resolve, reject) =>
        storage.sync.set(nextStorage, () => {
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
