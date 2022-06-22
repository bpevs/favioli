/* @jsx h */
import type { BrowserStorage } from '../hooks/use_browser_storage.ts';

import { Fragment, h } from 'preact';
import { useCallback } from 'preact/hooks';

import { DEFAULT_SETTINGS, Settings } from '../settings.ts';
import Checkbox, { Target } from '../components/checkbox.tsx';
import Only from '../components/only.tsx';
import { t } from '../utilities/i18n.ts';

export interface SettingsProps {
  default?: boolean;
  path?: string;
  save?: (e: Event) => void;
  storage?: BrowserStorage<Settings>;
}

const SettingsPage = ({ save, storage }: SettingsProps) => {
  const { cache = DEFAULT_SETTINGS, setCache } = storage || {};
  const { enableFaviconAutofill, enableSiteIgnore, enableOverrideAll } =
    cache.features || {};

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
        name='enableSiteIgnore'
        label={t('enableSiteIgnoreLabel')}
        checked={enableSiteIgnore}
        onChange={setFeature}
      />
      <Checkbox
        name='enableFaviconAutofill'
        label={t('enableFaviconAutofillLabel')}
        checked={enableFaviconAutofill}
        onChange={setFeature}
      />
      <Only if={Boolean(enableFaviconAutofill)}>
        <div style='padding-left: 2em'>
          <Checkbox
            name='enableOverrideAll'
            label={t('enableOverrideAllLabel')}
            checked={enableOverrideAll}
            onChange={setFeature}
          />
        </div>
      </Only>
      <button type='submit' children={t('saveLabel')} className='save' />
    </form>
  );
};

export default SettingsPage;
