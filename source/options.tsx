/* @jsx h */

import { h, render } from "preact";
import { useCallback, useState } from "preact/hooks";
import Router from "preact-router";

import Header from "./components/Header.tsx";
import Favicons from "./pages/Favicons.tsx";
import Settings from "./pages/Settings.tsx";
import browserAPI from "./utilities/browserAPI.ts";
import { t } from "./utilities/i18n.ts";

const App = () => {
  const [status, setStatus] = useState("");
  const [settings, updateSettings] = useState({});

  const saveSettings = useCallback(async () => {
    await browserAPI.saveSettings(settings);
    setStatus("Successfully Saved");
    setTimeout(() => setStatus(""), 1000);
  }, [settings]);

  return (
    <div className="page">
      <Header />
      <Router>
        <Favicons default path="/favicons" onChange={updateSettings} />
        <Settings path="/settings" onChange={updateSettings} />
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
