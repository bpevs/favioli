/* @jsx h */

import { Fragment, h, render } from 'preact';
import { useCallback } from 'preact/hooks';

import {
  DEFAULT_SETTINGS,
  Settings,
  STORAGE_KEYS,
} from './utilities/settings.ts';
import Header from './components/header.tsx';
import Switch from './components/switch.tsx';

import useBrowserStorage from './hooks/use_browser_storage.ts';
import useStatus from './hooks/use_status.ts';
import useRoute from './hooks/use_route.ts';

import AboutPage from './pages/about_page.tsx';
import FaviconsPage from './pages/favicons_page.tsx';
import SettingsPage from './pages/settings_page.tsx';
import { t } from './utilities/i18n.ts';

const App = () => {
  const route = useRoute();
  const storage = useBrowserStorage<Settings>(STORAGE_KEYS, DEFAULT_SETTINGS);
  const { error = '', loading, saveCacheToStorage } = storage;
  const { status, save } = useStatus(error || '', saveCacheToStorage);

  const saveOptions = useCallback((e: Event) => {
    e.preventDefault();
    save();
  }, [save]);

  if (loading || error) return <div />;

  return (
    <Fragment>
      <Header route={route} />
      <div className='page'>
        <Switch
          value={route}
          defaultCase={<FaviconsPage save={saveOptions} storage={storage} />}
          cases={{
            '#settings': <SettingsPage save={saveOptions} storage={storage} />,
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
