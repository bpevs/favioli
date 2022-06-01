/* @jsx h */
import type { Tab } from './utilities/browser_api_interface/mod.ts';

import { h, render } from 'preact';
import { useCallback, useEffect, useMemo, useState } from 'preact/hooks';
import useBrowserStorage from './hooks/use_browser_storage.ts';
import browserAPI from './utilities/browser_api.ts';
import useStatus from './hooks/use_status.ts';
import { Settings, STORAGE_KEYS } from './types.ts';

const queryOptions = { active: true };

const App = () => {
  const storage = useBrowserStorage<Settings>(STORAGE_KEYS);
  const { cache, error = '', loading, setCache } = storage;
  const [currTab, setCurrTab] = useState<Tab | void>();
  const { favIconUrl = '', url = '' } = currTab || {};

  useEffect(() => {
    async function setup() {
      const [ activeTab ] = await browserAPI.tabs.query(queryOptions);
      setCurrTab(activeTab);
    }
    browserAPI.storage.onChanged.addListener(setup);
    browserAPI.tabs.onUpdated.addListener(setup);

    setup().catch(console.error);
  }, [cache]);

  const { status, save } = useStatus(
    error || '',
    useCallback(async (add: boolean) => {
      if (!url) return;
      const origin = (new URL(url)).origin;
      const siteList = cache?.siteList || [];
      const nextList = siteList.filter((filter) => filter !== origin);
      if (add) nextList.push(origin);
      setCache({ siteList: nextList }, true);
    }, [url, cache, setCache]),
  );

  const addToOverrides = useCallback(() => {
    save(true);
  }, [cache, url, setCache]);

  const removeFromOverrides = useCallback(() => {
    save(false);
  }, [cache, url, setCache]);

  const goToOptions = useCallback(() => {
    browserAPI.runtime.openOptionsPage();
  }, []);

  if (loading) return <div>loading...</div>

  return (
    <div className='popup-wrapper'>
      <p>
        Current Favicon:
        <img
          className="favicon-icon"
          src={favIconUrl}
          width={20}
          height={20}
        />
      </p>
      <button onClick={addToOverrides}>
        Override Favicon
      </button>
      <button onClick={removeFromOverrides}>Remove Override</button>
      <button onClick={goToOptions}>Options</button>
      <div id='status'>{status}</div>
    </div>
  );
};

const mountPoint = document.getElementById('mount');
if (mountPoint) render(<App />, mountPoint);
