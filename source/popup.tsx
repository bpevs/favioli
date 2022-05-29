/* @jsx h */

import { h, render } from 'preact';
import { useCallback, useEffect, useState } from 'preact/hooks';
import useBrowserStorage from './hooks/use_browser_storage.ts';
import browserAPI from './utilities/browser_api.ts';
import useStatus from './hooks/use_status.ts';
import { Settings, STORAGE_KEYS, Tab } from './types.ts';

const queryOptions = { active: true };

const App = () => {
  const storage = useBrowserStorage<Settings>(STORAGE_KEYS);
  const { cache, error = '', loading, setCache, saveCacheToStorage } = storage;
  const { status, saveSettings } = useStatus(error || '', saveCacheToStorage);

  const addToOverrides = useCallback(() => {
    const siteList = cache?.siteList || [];
    browserAPI.tabs.query(queryOptions)
      .then(([{ url }]: Tab[]) => {
        if (url) {
          const origin = (new URL(url)).origin;
          const nextList = siteList
            .filter((filter) => filter !== origin)
            .concat(origin);
          setCache({ siteList: nextList });
          saveSettings();
        }
      });
  }, [storage]);

  const goToOptions = useCallback(() => {
    browserAPI.runtime.openOptionsPage();
  }, []);

  return (
    <div className='page'>
      <h1>Favioli</h1>
      <button onClick={addToOverrides}>
        Change Favicon
      </button>
      <button onClick={goToOptions}>
        Options
      </button>
      <div id='status'>{status}</div>
    </div>
  );
};

const mountPoint = document.getElementById('mount');
if (mountPoint) render(<App />, mountPoint);
