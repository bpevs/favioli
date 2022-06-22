/* @jsx h */
import type { BrowserStorage } from '../hooks/use_browser_storage.ts';

import { Fragment, h } from 'preact';
import { useEffect } from 'preact/hooks';

import { DEFAULT_SETTINGS, Settings } from '../settings.ts';
import List from '../components/list.tsx';
import Only from '../components/only.tsx';
import useListState from '../hooks/use_list_state.ts';
import { t } from '../utilities/i18n.ts';

export interface FaviconsPageProps {
  default?: boolean;
  path?: string;
  storage?: BrowserStorage<Settings>;
  save?: (e: Event) => void;
}

export default function FaviconsPage({ save, storage }: FaviconsPageProps) {
  const {
    siteList = [],
    ignoreList = [],
    features = {},
  } = storage?.cache || DEFAULT_SETTINGS;
  const { enableSiteIgnore } = features;
  const siteListState = useListState(siteList);
  const ignoreListState = useListState(ignoreList);

  useEffect(() => {
    if (storage) {
      storage.setCache({
        siteList: siteListState.contents,
        ignoreList: ignoreListState.contents,
      });
    }
  }, [siteListState.contents, ignoreListState.contents]);
  if (!storage) return null;

  const hasIgnores = ignoreListState.contents?.length;

  return (
    <form onSubmit={save}>
      <h1>{t('faviconListTitle')}</h1>
      <List type='FAVICON' state={siteListState} />

      <Only if={Boolean(enableSiteIgnore || hasIgnores)}>
        <Fragment>
          <h1>
            {t('ignoreListTitle')}
            <Only if={!enableSiteIgnore}>
              <span style={{ opacity: 0.5 }}>(Disabled)</span>
            </Only>
          </h1>

          <List type='IGNORE' state={ignoreListState} />
        </Fragment>
      </Only>

      <button type='submit' children={t('saveLabel')} className='save' />
    </form>
  );
}
