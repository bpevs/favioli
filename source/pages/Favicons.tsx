/* @jsx h */
import type { BrowserStorage } from "../hooks/useBrowserStorage.ts";

import { Fragment, h } from "preact";
import { useEffect } from "preact/hooks";

import { defaultSettings, Settings } from "../types.ts";
import useListState from "../hooks/useListState.ts";
import List from "../components/List.tsx";
import Only from "../components/Only.tsx";

export interface FaviconsPageProps {
  default?: boolean;
  path?: string;
  storage?: BrowserStorage<Settings>;
}

export default function FaviconsPage({ storage }: FaviconsPageProps) {
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
        siteList: siteListState.listItems,
        ignoreList: ignoreListState.listItems,
      });
    }
  }, [siteListState.listItems, ignoreListState.listItems]);

  if (!storage) return null;

  return (
    <Fragment>
      <h1>Modify Favicons for These Sites:</h1>
      <List type="EMOJI" state={siteListState} onChange={storage.setCache} />

      <Only if={Boolean(enableSiteIgnore)}>
        <Fragment>
          <h1>Ignore These Sites:</h1>
          <List
            type="TEXT"
            state={ignoreListState}
            onChange={storage.setCache}
          />
        </Fragment>
      </Only>
    </Fragment>
  );
}
