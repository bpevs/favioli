/* @jsx h */
import type { Settings } from './models/settings.ts';

import { h, render } from 'preact';
import { useCallback, useMemo } from 'preact/hooks';
import browserAPI from 'browser';

import Only from './components/only.tsx';
import useActiveTab from './hooks/use_active_tab.ts';
import useBrowserStorage from './hooks/use_browser_storage.ts';
import useFavioliIcon from './hooks/use_selected_favicon.ts';
import useStatus from './hooks/use_status.ts';
import { DEFAULT_SETTINGS, SETTINGS_KEY } from './models/settings.ts';

const App = () => {
  const settings = useBrowserStorage<Settings>(SETTINGS_KEY, DEFAULT_SETTINGS);
  const { setCache, cache, error, loading } = settings;
  const { favIconUrl = '', url = '' } = useActiveTab() || {};
  const { selectedFavicon, selectedFaviconURL } = useFavioliIcon(url, cache);
  const origin = url ? (new URL(url)).origin : '';

  const hasQuickOverride = useMemo(() => {
    if (!origin) return false;
    return (cache.siteList || []).some(({ matcher }) => matcher === origin);
  }, [url, cache]);

  const { status, save } = useStatus(
    error || '',
    useCallback(function updateSiteList() {
      if (!origin) return;

      const siteList = (cache.siteList || [])
        .filter(({ matcher }) => matcher !== origin);

      if (selectedFavicon && !hasQuickOverride) {
        siteList.push({ ...selectedFavicon, matcher: origin });
      }

      setCache({ siteList }, true);
    }, [selectedFavicon, hasQuickOverride, origin, cache]),
  );

  const overridable = !hasQuickOverride && selectedFaviconURL !== favIconUrl;
  const overridden = !hasQuickOverride && selectedFaviconURL === favIconUrl;

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
      <button
        onClick={save}
        disabled={!hasQuickOverride && selectedFaviconURL === favIconUrl}
      >
        <Only if={hasQuickOverride}>Remove Quick Override</Only>
        <Only if={overridable}>Quick Override Favicon</Only>
        <Only if={overridden}>Autofilled or Overridden in Options</Only>
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
