/* @jsx h */

import { h } from "preact";
import { t } from "../utilities/i18n.ts";

import Checkbox from "../components/Checkbox.tsx";

export interface SettingsProps {
  default?: boolean;
  path?: string;
}

const SettingsPage = (props: SettingsProps) => (
  <div>
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
  </div>
);

export default SettingsPage;
