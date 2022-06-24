/* @jsx h */
import type { Tab } from 'browser';
import { h, render } from 'preact';
import { useCallback, useEffect, useMemo, useState } from 'preact/hooks';
import browserAPI from 'browser';

import Autoselector from './utilities/autoselector.ts';
import FaviconData from './utilities/favicon_data.ts';
import useBrowserStorage from './hooks/use_browser_storage.ts';
import useStatus from './hooks/use_status.ts';
import { Settings, STORAGE_KEYS } from './utilities/settings.ts';
import { createFaviconURLFromChar } from './utilities/create_favicon_url.ts';

let autoselector: Autoselector | void;
const queryOptions = { active: true };

const App = () => {
  const storage = useBrowserStorage<Settings>(STORAGE_KEYS);
  const { cache, error = '', loading, setCache } = storage;
  const [currTab, setCurrTab] = useState<Tab | void>();
  const { favIconUrl = '', url = '' } = currTab || {};

  const autoselectedEmoji = useMemo(() => {
    if (!autoselector && cache?.autoselectorVersion) {
      autoselector = new Autoselector(cache.autoselectorVersion);
    }
    if (!autoselector) return null;
    return autoselector.selectFavicon(url);
  }, [cache, url]);

  const autoselectedFaviconURL = useMemo(() => {
    if (!autoselectedEmoji?.emoji?.emoji) return null;
    return createFaviconURLFromChar(autoselectedEmoji.emoji.emoji);
  }, [autoselectedEmoji]);

  useEffect(() => {
    async function setup() {
      const [activeTab] = await browserAPI.tabs.query(queryOptions);
      setCurrTab(activeTab);
    }
    browserAPI.storage.onChanged.addListener(setup);
    browserAPI.tabs.onUpdated.addListener(setup);

    setup().catch(console.error);
  }, [cache]);

  const updateSite = useCallback((shouldAdd: boolean) => {
    if (!url) return;
    const origin = (new URL(url)).origin;
    const siteList = cache?.siteList || [];
    const nextList = siteList.filter((filter) => filter.matcher !== origin);
    if (shouldAdd && autoselectedEmoji) {
      nextList.push(new FaviconData(autoselectedEmoji.emoji, origin));
    }
    setCache({ siteList: nextList }, true);
  }, [url, cache, setCache]);

  const { status, save } = useStatus(error || '', updateSite);

  const addToOverrides = useCallback(() => {
    save(true);
  }, [save]);

  const removeFromOverrides = useCallback(() => {
    save(false);
  }, [save]);

  const goToOptions = useCallback(() => {
    browserAPI.runtime.openOptionsPage();
  }, []);

  if (loading) return <div>loading...</div>;

  return (
    <div className='popup-wrapper'>
      <div style='padding-top: 10px; display: flex; justify-content: space-evenly;'>
        <div>
          Current Favicon:
          <img
            className='favicon-icon'
            src={favIconUrl || ''}
            width={20}
            height={20}
          />
        </div>
        <div>
          Autofill Favicon:
          <img
            className='favicon-icon'
            src={autoselectedFaviconURL || ''}
            width={20}
            height={20}
          />
        </div>
      </div>
      <div style='padding-top: 10px; text-align: center;'>
        Is Autofilled?{' '}
        <span style='font-weight: bold;'>
          {autoselectedFaviconURL === favIconUrl ? 'Yes!' : 'No!'}
        </span>
      </div>
      <button onClick={addToOverrides}>Override Favicon</button>
      <button onClick={removeFromOverrides}>Remove Override</button>
      <button onClick={goToOptions}>Options</button>
      <div id='status' style='text-align: center;'>{status}</div>
    </div>
  );
};

const mountPoint = document.getElementById('mount');
if (mountPoint) render(<App />, mountPoint);
