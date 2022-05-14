/* @jsx h */
import type { BrowserStorage } from '../hooks/useBrowserStorage.ts';

import { Fragment, h } from 'preact';
import { useEffect } from 'preact/hooks';

import { defaultSettings, Settings } from '../types.ts';
import List from '../components/List.tsx';
import Only from '../components/Only.tsx';
import useListState from '../hooks/use_list_state.ts';
import { t } from '../utilities/i18n.ts';

export interface FaviconsPageProps {
  default?: boolean;
  path?: string;
  storage?: BrowserStorage<Settings>;
  save?: (...args: any[]) => void;
}

export default function FaviconsPage({ save, storage }: FaviconsPageProps) {
  const {
    siteList = [],
    ignoreList = [],
    enableSiteIgnore,
  } = storage?.cache || defaultSettings;
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
      <h1>Override Favicons on these Sites</h1>
      <List type='EMOJI' state={siteListState} />

      <Only if={Boolean(enableSiteIgnore || hasIgnores)}>
        <Fragment>
          <h1>
            Ignore These Sites
            <Only if={!enableSiteIgnore}>
              <span style={{ opacity: 0.5 }}> (Disabled)</span>
            </Only>
          </h1>

          <List type='TEXT' state={ignoreListState} />
        </Fragment>
      </Only>

      <button type="submit" children={t('saveLabel')} className='save' />
    </form>
  );
}
