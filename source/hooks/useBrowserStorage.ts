import browserAPI from "../utilities/browserAPI.ts";

const { storage, runtime } = browserAPI;

// deno-lint-ignore no-explicit-any
type ChachedStorage = Record<string, any>;

/**
 * Interact with BrowserStorage as little as possible.
 * This method probably does NOT work well if multiple sessions open at once.
 * Basically:
 *   - Fetch current saved data from Browser on init, and save locally
 *   - `get` data from the locally cached copy
 *   - `set` onChange data to the locally cached copy without interacting with BrowserStorage
 *   - `save` that local data into browserStorage on a separate interaction
 */
export default function useBrowserStorage(keys: string[]) {
  let cache: Promise<ChachedStorage> = new Promise((resolve, reject) =>
    storage.sync.get(keys, (result: ChachedStorage) => {
      if (runtime.lastError) return reject(runtime.lastError);
      resolve(result);
    })
  );

  return {
    /**
     * Returns currently cached data from storage
     */
    get: (): Promise<ChachedStorage> => cache,

    /**
     * Updates the session cached data with new properties
     * @param nextCache
     */
    async set(nextCache: ChachedStorage): Promise<void> {
      cache = Promise.resolve({ ...(await cache), ...nextCache });
    },

    /**
     * Applies the current local cache to browser storage
     */
    async save(): Promise<void> {
      const nextStorageState = await cache;
      return new Promise((resolve, reject) =>
        storage.sync.set(nextStorageState, () => {
          runtime.lastError ? reject(runtime.lastError) : resolve();
        })
      );
    },
  };
}
