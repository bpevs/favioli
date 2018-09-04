import { appendOverride, changeRoute, restoreOptions, saveOptions } from "./utilities/optionsHelpers";

const INITIAL_ROUTE = "overrides"
const CURRENT_ROUTE = window.location.hash.substr(1);

const el = {
  flagSelector: document.getElementById("flag"),
  navLinks: Array.from(document.getElementsByClassName("navlink")),
  saveButtons: Array.from(document.getElementsByClassName("save")),
}

changeRoute(CURRENT_ROUTE || INITIAL_ROUTE);

document.addEventListener("DOMContentLoaded", async function () {
  const options = await restoreOptions();

  // Append override UI elements
  options.overrides.forEach(override => appendOverride(override, options.overrides));

  // Navlinks change routes
  el.navLinks.forEach(navLink => {
    const pageName = navLink.textContent.toLowerCase();
    navLink.addEventListener("click", () => changeRoute(pageName));
  });

  // Save buttons save settings
  el.saveButtons.forEach(save => save.addEventListener("click", () => {
    const flagReplaced = el.flagSelector.checked;
    const overrides = options.overrides.slice(0, options.overrides.length - 1);
    saveOptions({ overrides, flagReplaced });
  }));
});
