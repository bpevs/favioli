/* @jsx h */

import { h, render } from "preact";
import Router from "preact-router";

import { Settings } from "./types.ts";
import Header from "./components/Header.tsx";
import useBrowserStorage, {
  BrowserStorage,
} from "./hooks/useBrowserStorage.ts";
import useStatus from "./hooks/useStatus.ts";
import FaviconsPage from "./pages/Favicons.tsx";
import SettingsPage from "./pages/Settings.tsx";
import { t } from "./utilities/i18n.ts";

const App = () => {
  const storage = useBrowserStorage<Settings>(["siteList", "ignoreList"]);
  const { error = "", saveCacheToStorage } = storage;
  const { status, saveSettings } = useStatus(error || "", saveCacheToStorage);

  return (
    <div className="page">
      <Header />
      <Router>
        <FaviconsPage
          default
          path="/favicons"
          storage={storage as BrowserStorage<Settings>}
        />
        <SettingsPage
          path="/settings"
          storage={storage as BrowserStorage<Settings>}
        />
      </Router>

      <button
        children={t("saveLabel")}
        className="save"
        onClick={saveSettings}
      />

      <div id="status">{status}</div>
    </div>
  );
};

const mountPoint = document.getElementById("mount");

if (mountPoint) {
  render(<App />, mountPoint);
}
