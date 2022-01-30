/* @jsx h */

import { Fragment, h } from "preact";
import { StateUpdater } from "preact/hooks";

import Checkbox from "../components/Checkbox.tsx";
import { t } from "../utilities/i18n.ts";

export interface SettingsProps {
  default?: boolean;
  path?: string;
  onChange?: StateUpdater<Record<string, void>>;
}

const SettingsPage = (props: SettingsProps) => (
  <Fragment>
    <h1>Settings</h1>
    <Checkbox
      name="flagReplaced"
      label={t("flagReplacedLabel")}
    />
    <Checkbox
      name="enableSiteIgnore"
      label={t("enableSiteIgnoreLabel")}
    />
    <Checkbox
      name="enableAutofillFavicon"
      label={t("enableAutofillFaviconLabel")}
    />
  </Fragment>
);

export default SettingsPage;
