/* @jsx h */

import { h, Fragment, render } from 'preact';
import { useCallback } from 'preact/hooks';

import { Settings } from './types.ts';
import Header from './components/Header.tsx';
import Switch from './components/switch.tsx';

import useBrowserStorage, {
  BrowserStorage,
} from './hooks/useBrowserStorage.ts';
import useStatus from './hooks/useStatus.ts';
import useRoute from './hooks/useRoute.ts';

import AboutPage from './pages/about_page.tsx';
import FaviconsPage from './pages/favicons_page.tsx';
import SettingsPage from './pages/settings_page.tsx';
import { t } from './utilities/i18n.ts';

const App = () => {
  const route = useRoute();
  const storage = useBrowserStorage<Settings>(['siteList', 'ignoreList']);
  const { error = '', loading, saveCacheToStorage } = storage;
  const { status, saveSettings } = useStatus(error || '', saveCacheToStorage);

  if (loading) return <div />;

  return (
    <Fragment>
      <Header path={route} />
      <div className='page'>
        <Switch
          value={route}
          defaultCase={<SettingsPage storage={storage} />}
          cases={{
            '#favicons': <FaviconsPage save={saveSettings} storage={storage} />,
            '#about': <AboutPage />,
          }}
        />
      </div>
      <div id='status'>{status}</div>
    </Fragment>
  );
};

const mountPoint = document.getElementById('mount');
if (mountPoint) render(<App />, mountPoint);
