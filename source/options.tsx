/* @jsx h */

import { h, render } from "preact";
import Router from "preact-router";

import Header from "./components/Header.tsx";

import Favicons from "./pages/Favicons.tsx";
import Settings from "./pages/Settings.tsx";

const mountPoint = document.getElementById("mount");

if (mountPoint) {
  render(
    <div>
      <Header />
      <Router>
        <Favicons default path="/favicons" />
        <Settings path="/settings" />
      </Router>
    </div>,
    mountPoint,
  );
}
