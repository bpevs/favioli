const { readFileSync, writeFileSync } = require("fs");
const { execSync } = require("child_process");

const browsers = {
  chrome: "chrome",
  firefox: "firefox"
};

const baseManifest = JSON.parse(readFileSync("manifest.json", "utf8"));
console.log(baseManifest);

Object.keys(browsers).forEach(id => {
  const dist = `./dist/${browsers[id]}`;

  // Copy JS/HTML/CSS/ICONS
  execSync(`mkdir -p ${dist}/icons`);
  execSync(`cp -r ./icons/* ${dist}/icons`);
  execSync(`cp -r ./dist/base/* ${dist}`);

  // Transform Manifest
  writeFileSync(dist + "/manifest.json", JSON.stringify(baseManifest, null, 2));
});
