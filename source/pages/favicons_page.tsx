/* @jsx h */
import type { BrowserStorage } from '../hooks/use_browser_storage.ts';
import type { Favicon } from '../models/favicon.ts';
import type { Settings } from '../models/settings.ts';

import { h } from 'preact';
import { useContext, useEffect } from 'preact/hooks';

import List, { LIST_TYPE } from '../components/list.tsx';
import Only from '../components/only.tsx';
import useListState from '../hooks/use_list_state.ts';
import { SettingsContext } from '../models/settings.ts';
import { t } from '../utilities/i18n.ts';

export default function FaviconsPage({ save }: { save?: (e: Event) => void }) {
  const storage = useContext<BrowserStorage<Settings>>(SettingsContext);
  const { siteList, ignoreList, features } = storage.cache;
  const { enableSiteIgnore } = features;
  const siteListState = useListState<Favicon>(siteList);
  const ignoreListState = useListState<Favicon>(ignoreList);

  useEffect(() => {
    if (storage) {
      storage.setCache({
        siteList: siteListState.contents,
        ignoreList: ignoreListState.contents,
      });
    }
  }, [siteListState.contents, ignoreListState.contents]);

  return (
    <form onSubmit={save}>
      <h1>{t('faviconListTitle')}</h1>
      <List type={LIST_TYPE.FAVICON} state={siteListState} />

      <Only if={Boolean(enableSiteIgnore || ignoreListState.contents?.length)}>
        <h1>
          {t('ignoreListTitle')}
          <Only if={!enableSiteIgnore}>
            <span style={{ opacity: 0.5 }}>(Disabled)</span>
          </Only>
        </h1>

        <List type={LIST_TYPE.IGNORE} state={ignoreListState} />
      </Only>

      <button type='submit' children={t('saveLabel')} className='save' />
    </form>
  );
}
