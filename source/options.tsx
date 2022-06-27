/* @jsx h */
import type { Settings } from './models/settings.ts';

import { Fragment, h, render } from 'preact';
import { useCallback } from 'preact/hooks';

import Header from './components/header.tsx';
import Switch from './components/switch.tsx';
import useBrowserStorage from './hooks/use_browser_storage.ts';
import useRoute from './hooks/use_route.ts';
import useStatus from './hooks/use_status.ts';
import { SettingsContext } from './models/settings.ts';
import AboutPage from './pages/about_page.tsx';
import FaviconsPage from './pages/favicons_page.tsx';
import SettingsPage from './pages/settings_page.tsx';
import { t } from './utilities/i18n.ts';
import { DEFAULT_SETTINGS, SETTINGS_KEY } from './models/settings.ts';

const App = () => {
  const route = useRoute();
  const settings = useBrowserStorage<Settings>(SETTINGS_KEY, DEFAULT_SETTINGS);
  const { error = '', loading, saveCacheToStorage } = settings;
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
          <SettingsContext.Provider value={settings}>
            <Switch
              value={route}
              defaultCase={<FaviconsPage save={saveOptions} />}
              cases={{
                '#settings': <SettingsPage save={saveOptions} />,
                '#about': <AboutPage />,
              }}
            />
          </SettingsContext.Provider>
        </div>
      </div>
      <div id='status'>{status}</div>
    </Fragment>
  );
};

const mountPoint = document.getElementById('mount');
if (mountPoint) render(<App />, mountPoint);
