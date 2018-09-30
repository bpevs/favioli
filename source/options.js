import React from "react";
import ReactDOM from "react-dom";
import { App } from "./components/App";

ReactDOM.render(
  <App />,
  document.querySelector("#mount")
);



// document.addEventListener("DOMContentLoaded", async function () {
//   const options = await restoreOptions();

//   // Append override UI elements
//   options.overrides.forEach(override => appendOverride(override, options.overrides))

//   // Navlinks change routes
//   el.navLinks.forEach(navLink => {
//     const pageName = navLink.textContent.toLowerCase()
//     navLink.addEventListener("click", () => changeRoute(pageName))
//   });

//   // Save buttons save settings
//   el.saveButtons.forEach(save => save.addEventListener("click", () => {
//     const flagReplaced = el.flagSelector.checked
//     const overrides = options.overrides.slice(0, options.overrides.length - 1)
//     saveOptions({ overrides, flagReplaced })
//   }));
// });
