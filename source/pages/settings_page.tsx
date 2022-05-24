/* @jsx h */
import type { BrowserStorage } from '../hooks/use_browser_storage.ts';

import { Fragment, h } from 'preact';
import { useCallback } from 'preact/hooks';

import { defaultSettings, Settings } from '../types.ts';
import Checkbox, { Target } from '../components/checkbox.tsx';
import { t } from '../utilities/i18n.ts';

export interface SettingsProps {
  default?: boolean;
  path?: string;
  save?: (e: Event) => void;
  storage?: BrowserStorage<Settings>;
}

const SettingsPage = ({ save, storage }: SettingsProps) => {
  const { cache = defaultSettings, setCache } = storage || {};
  const {
    enableFaviconActiveFlag,
    enableFaviconAutofill,
    enableSiteIgnore,
  } = cache.features || {};

  const setFeature = useCallback((feature: Target) => {
    if (storage) {
      storage.setCache({
        features: {
          ...cache.features,
          ...feature,
        },
      });
    }
  }, [cache.features]);

  return (
    <form onSubmit={save}>
      <h1>Settings</h1>
      <Checkbox
        name='enableFaviconActiveFlag'
        label={t('enableFaviconActiveFlagLabel')}
        checked={enableFaviconActiveFlag}
        onChange={setFeature}
      />
      <Checkbox
        name='enableSiteIgnore'
        label={t('enableSiteIgnoreLabel')}
        checked={enableSiteIgnore}
        onChange={setFeature}
      />
      <Checkbox
        name='enableAutofillFavicon'
        label={t('enableAutofillFaviconLabel')}
        checked={enableFaviconAutofill}
        onChange={setFeature}
      />
      <button type='submit' children={t('saveLabel')} className='save' />
    </form>
  );
};

export default SettingsPage;
