/* @jsx h */
import type { Settings } from './models/settings.ts';

import { h, render } from 'preact';
import { useCallback } from 'preact/hooks';
import browserAPI from 'browser';

import useActiveTab from './hooks/use_active_tab.ts';
import useBrowserStorage from './hooks/use_browser_storage.ts';
import useSelectedFavicon from './hooks/use_selected_favicon.ts';
import useStatus from './hooks/use_status.ts';
import { DEFAULT_SETTINGS, SETTINGS_KEY } from './models/settings.ts';

const App = () => {
  const settings = useBrowserStorage<Settings>(SETTINGS_KEY, DEFAULT_SETTINGS);
  const { favIconUrl = '', url = '' } = useActiveTab() || {};
  const { selectedFavicon, selectedFaviconURL } = useSelectedFavicon(
    url,
    settings.cache,
  );

  const { status, save } = useStatus(
    settings.error || '',
    useCallback(function updateSiteList(shouldAddToSiteList: boolean) {
      if (!url) return;
      const { origin } = new URL(url);
      const siteList = (settings.cache?.siteList || [])
        .filter(({ matcher }) => matcher !== origin);

      if (shouldAddToSiteList && selectedFavicon) {
        siteList.push({ ...selectedFavicon, matcher: origin });
      }

      settings.setCache({ siteList }, true);
    }, [url, settings]),
  );

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
          Favioli Favicon:
          <img
            className='favicon-icon'
            src={selectedFaviconURL || ''}
            width={20}
            height={20}
          />
        </div>
      </div>
      <div style='padding-top: 10px; text-align: center;'>
        Is a Favioli Favicon?{' '}
        <span style='font-weight: bold;'>
          {selectedFaviconURL === favIconUrl ? 'Yes!' : 'No!'}
        </span>
      </div>
      <button onClick={useCallback(() => save(true), [save])}>
        Override Favicon
      </button>
      <button onClick={useCallback(() => save(false), [save])}>
        Remove Override
      </button>
      <button
        onClick={useCallback(() => browserAPI.runtime.openOptionsPage(), [])}
      >
        Options
      </button>
      <div id='status' style='text-align: center;'>{status}</div>
    </div>
  );
};

const mountPoint = document.getElementById('mount');
if (mountPoint) render(<App />, mountPoint);
