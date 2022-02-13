/* @jsx h */
import type { BrowserStorage } from "../hooks/useBrowserStorage.ts";

import { Fragment, h } from "preact";

import { defaultSettings, Settings } from "../types.ts";
import Checkbox from "../components/Checkbox.tsx";
import { t } from "../utilities/i18n.ts";

export interface SettingsProps {
  default?: boolean;
  path?: string;
  storage?: BrowserStorage<Settings>;
}

const SettingsPage = ({ storage }: SettingsProps) => {
  const { cache = defaultSettings, setCache } = storage || {};
  const {
    enableFaviconActiveFlag,
    enableFaviconAutofill,
    enableSiteIgnore,
  } = cache;

  return (
    <Fragment>
      <h1>Settings</h1>
      <Checkbox
        name="enableFaviconActiveFlag"
        label={t("enableFaviconActiveFlagLabel")}
        checked={enableFaviconActiveFlag}
        onChange={setCache}
      />
      <Checkbox
        name="enableSiteIgnore"
        label={t("enableSiteIgnoreLabel")}
        checked={enableSiteIgnore}
        onChange={setCache}
      />
      <Checkbox
        name="enableAutofillFavicon"
        label={t("enableAutofillFaviconLabel")}
        checked={enableFaviconAutofill}
        onChange={setCache}
      />
    </Fragment>
  );
};

export default SettingsPage;
