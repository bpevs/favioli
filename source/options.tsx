/* @jsx h */

import { Fragment, h, render } from 'preact';
import { useCallback } from 'preact/hooks';

import { Settings, STORAGE_KEYS } from './types.ts';
import Header from './components/header.tsx';
import Switch from './components/switch.tsx';

import useBrowserStorage, {
  BrowserStorage,
} from './hooks/use_browser_storage.ts';
import useStatus from './hooks/use_status.ts';
import useRoute from './hooks/use_route.ts';

import AboutPage from './pages/about_page.tsx';
import FaviconsPage from './pages/favicons_page.tsx';
import SettingsPage from './pages/settings_page.tsx';
import { t } from './utilities/i18n.ts';

const App = () => {
  const route = useRoute();
  const storage = useBrowserStorage<Settings>(STORAGE_KEYS);
  const { error = '', loading, saveCacheToStorage } = storage;
  const { status, saveSettings } = useStatus(error || '', saveCacheToStorage);

  const save = useCallback((e: Event) => {
    e.preventDefault();
    saveSettings();
  }, [saveSettings]);

  if (loading || !storage) return <div />;

  return (
    <Fragment>
      <Header route={route} />
      <div className='page'>
        <Switch
          value={route}
          defaultCase={<FaviconsPage save={save} storage={storage} />}
          cases={{
            '#settings': <SettingsPage save={save} storage={storage} />,
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
