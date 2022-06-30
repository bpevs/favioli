/* @jsx h */
import type { BrowserStorage } from '../hooks/use_browser_storage.ts';
import type { Settings } from '../models/settings.ts';

import { Fragment, h } from 'preact';
import { useCallback, useContext } from 'preact/hooks';

import Checkbox, { Target } from '../components/checkbox.tsx';
import Only from '../components/only.tsx';
import { DEFAULT_SETTINGS, SettingsContext } from '../models/settings.ts';
import { AUTOSELECTOR_VERSION } from '../utilities/favicon_autoselector.ts';
import { t } from '../utilities/i18n.ts';

export interface SettingsProps {
  default?: boolean;
  path?: string;
  save?: (e: Event) => void;
}

const SettingsPage = ({ save }: SettingsProps) => {
  const storage = useContext<BrowserStorage<Settings>>(SettingsContext);
  const { cache, setCache } = storage;
  const { autoselectorVersion, features } = cache;
  const {
    enableAutoselectorIncludeCountryFlags,
    enableFaviconAutofill,
    enableSiteIgnore,
    enableOverrideAll,
    enableOverrideIndicator,
  } = features;

  const setFeature = useCallback((nextFeature: Target) => {
    if (storage) setCache({ features: { ...features, ...nextFeature } });
  }, [features]);

  const setAutoselectorVersion = useCallback((e: Event) => {
    const autoselectorVersion = (e.target as HTMLInputElement).value;
    if (storage) setCache({ autoselectorVersion });
  }, [storage]);

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
          <Checkbox
            name='enableAutoselectorIncludeCountryFlags'
            label={'Include Country Flags in autofill'}
            checked={enableAutoselectorIncludeCountryFlags}
            onChange={setFeature}
          />
          <div className='version-selector'>
            <label className='select-label'>Autoselector Version</label>
            <select
              name='autoselectorVersion'
              id='autoselectorVersion'
              onChange={setAutoselectorVersion}
              value={autoselectorVersion}
            >
              {Object.keys(AUTOSELECTOR_VERSION)
                .map((version) => <option value={version}>{version}</option>)}
            </select>
          </div>
        </div>
      </Only>
      <Checkbox
        name='enableOverrideIndicator'
        label={t('enableOverrideIndicatorLabel')}
        checked={enableOverrideIndicator}
        onChange={setFeature}
      />
      <button type='submit' children={t('saveLabel')} className='save' />
    </form>
  );
};

export default SettingsPage;
