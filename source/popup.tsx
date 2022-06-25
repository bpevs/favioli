/* @jsx h */
import type { Tab } from 'browser';
import { h, render } from 'preact';
import { useCallback, useEffect, useMemo, useState } from 'preact/hooks';
import browserAPI from 'browser';

import Autoselector from './utilities/autoselector.ts';
import {
  createFaviconDataFromEmoji,
  getEmojiFromFavicon,
} from './utilities/favicon_data.ts';
import useBrowserStorage from './hooks/use_browser_storage.ts';
import useStatus from './hooks/use_status.ts';
import {
  DEFAULT_SETTINGS,
  Settings,
  STORAGE_KEYS,
} from './utilities/settings.ts';
import { createFaviconURLFromChar } from './utilities/create_favicon_url.ts';

let autoselector: Autoselector | void;
const queryOptions = { active: true };

const App = () => {
  const storage = useBrowserStorage<Settings>(STORAGE_KEYS, DEFAULT_SETTINGS);
  const { cache, error = '', loading, setCache } = storage;
  const [currTab, setCurrTab] = useState<Tab | void>();
  const { favIconUrl = '', url = '' } = currTab || {};

  const autoselector = useMemo(() => {
    if (!cache?.autoselectorVersion) return null;
    const includeFlags = cache?.features?.enableAutoselectorIncludeCountryFlags;
    return new Autoselector(cache?.autoselectorVersion, { includeFlags });
  }, [cache?.autoselectorVersion]);

  const [autoselectedEmoji, autoselectedURL] = useMemo(() => {
    if (!autoselector) return [];
    const favicon = autoselector.selectFavicon(url);
    const emoji = getEmojiFromFavicon(favicon);
    const faviconURL = createFaviconURLFromChar(emoji?.emoji || '');
    return [emoji, faviconURL];
  }, [autoselector, url]);

  useEffect(function updateCurrTab() {
    async function setup() {
      const [activeTab] = await browserAPI.tabs.query(queryOptions);
      setCurrTab(activeTab);
    }
    browserAPI.storage.onChanged.addListener(setup);
    browserAPI.tabs.onUpdated.addListener(setup);
    setup().catch(console.error);
    (() => {
      browserAPI.storage.onChanged.removeListener(setup);
      browserAPI.tabs.onUpdated.removeListener(setup);
    });
  }, [cache]);

  const updateSiteList = useCallback((shouldOverride: boolean) => {
    if (!url) return;
    const { origin } = new URL(url);
    const siteList = (cache?.siteList || [])
      .filter(({ matcher }) => matcher !== origin); // Remove dupes

    if (shouldOverride && autoselectedEmoji) {
      siteList.push(createFaviconDataFromEmoji(origin, autoselectedEmoji));
    }

    setCache({ siteList }, true);
  }, [url, cache, setCache]);

  const { status, save } = useStatus(error || '', updateSiteList);
  const addToOverrides = useCallback(() => save(true), [save]);
  const removeFromOverrides = useCallback(() => save(false), [save]);
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
            src={autoselectedURL || ''}
            width={20}
            height={20}
          />
        </div>
      </div>
      <div style='padding-top: 10px; text-align: center;'>
        Is Autofilled?{' '}
        <span style='font-weight: bold;'>
          {autoselectedURL === favIconUrl ? 'Yes!' : 'No!'}
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
