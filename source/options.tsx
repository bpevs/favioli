/* @jsx h */

import { h, render } from 'preact';
import { useCallback, useEffect, useState } from 'preact/hooks';

import { Settings } from './types.ts';
import Header from './components/Header.tsx';
import useBrowserStorage, {
  BrowserStorage,
} from './hooks/useBrowserStorage.ts';
import useStatus from './hooks/useStatus.ts';
import FaviconsPage from './pages/Favicons.tsx';
import SettingsPage from './pages/Settings.tsx';
import { t } from './utilities/i18n.ts';

const App = () => {
  const [route, setRoute] = useState(location.hash);
  const storage = useBrowserStorage<Settings>(['siteList', 'ignoreList']);
  const { error = '', saveCacheToStorage } = storage;
  const { status, saveSettings } = useStatus(error || '', saveCacheToStorage);

  useEffect(() => {
    const updateRoute = () => setRoute(location.hash);
    globalThis.addEventListener('hashchange', updateRoute, false);
    return () => {
      globalThis.removeEventListener('hashchange', updateRoute);
    };
  }, []);

  return (
    <div className='page'>
      <Header />
      {route === '#settings'
        ? <SettingsPage storage={storage} />
        : <FaviconsPage storage={storage} />}
      <button
        children={t('saveLabel')}
        className='save'
        onClick={saveSettings}
      />
      <div id='status'>{status}</div>
    </div>
  );
};

const mountPoint = document.getElementById('mount');
if (mountPoint) render(<App />, mountPoint);
