import React from "../deps.ts";

import { getDesc, getMessage } from "../utilities/i18n";
import Checkbox from "../components/Checkbox";

export default function SettingsPage() {
  <React.Fragment>
    <Checkbox
      name="flagReplaced"
      label={getMessage("flagReplaced")}
      desc={getDesc("flagReplaced")}
    />
    <Checkbox
      name="enableSiteBypass"
      label={getMessage("enableSiteBypass")}
      desc={getDesc("enableSiteBypass")}
    />
    <Checkbox
      name="enableAutofillFavicon"
      label={getMessage("enableAutofillFavicon")}
      desc={getDesc("enableAutofillFavicon")}
    />
  </React.Fragment>;
}
