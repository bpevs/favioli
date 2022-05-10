/* @jsx h */

import { h, render } from 'preact';

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
  const { error = '', saveCacheToStorage } = storage;
  const { status, saveSettings } = useStatus(error || '', saveCacheToStorage);

  return (
    <div className='page'>
      <Header path={route} />
      <Switch
        value={route}
        defaultCase={<SettingsPage storage={storage} />}
        cases={{
          '#settings': <SettingsPage storage={storage} />,
          '#favicons': <FaviconsPage storage={storage} />,
        }}
      />
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
