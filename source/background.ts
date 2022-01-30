import browserAPI from "./utilities/browserAPI.ts";

browserAPI.tabs.onUpdated.addListener(() => {
  console.log("tab-updated");
});
