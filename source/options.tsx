/* @jsx h */

import type { Settings } from './utilities/settings.ts';

import { Fragment, h, render } from 'preact';
import { useCallback } from 'preact/hooks';

import Header from './components/header.tsx';
import Switch from './components/switch.tsx';
import useBrowserStorage, {
  StorageContext,
} from './hooks/use_browser_storage.ts';
import useRoute from './hooks/use_route.ts';
import useStatus from './hooks/use_status.ts';
import AboutPage from './pages/about_page.tsx';
import FaviconsPage from './pages/favicons_page.tsx';
import SettingsPage from './pages/settings_page.tsx';
import { t } from './utilities/i18n.ts';
import { DEFAULT_SETTINGS, STORAGE_KEYS } from './utilities/settings.ts';

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
        <div className='page-content'>
          <StorageContext.Provider value={storage}>
            <Switch
              value={route}
              defaultCase={<FaviconsPage save={saveOptions} />}
              cases={{
                '#settings': <SettingsPage save={saveOptions} />,
                '#about': <AboutPage />,
              }}
            />
          </StorageContext.Provider>
        </div>
      </div>
      <div id='status'>{status}</div>
    </Fragment>
  );
};

const mountPoint = document.getElementById('mount');
if (mountPoint) render(<App />, mountPoint);
