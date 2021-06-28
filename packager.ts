/**
 * Compile and bundle all the distributables into dist
 */
import { copySync, ensureDir } from "https://deno.land/std@0.97.0/fs/mod.ts";
import { basename, extname } from "https://deno.land/std@0.97.0/path/mod.ts";

interface BrowserManifestSettings {
  color: string;
  omits: string[];
}

interface BrowserManifests {
  [id: string]: BrowserManifestSettings;
}

const browsers: BrowserManifests = {
  chrome: {
    color: "\x1b[32m",
    omits: ["applications", "options_ui"],
  },
  firefox: {
    color: "\x1b[91m",
    omits: ["options_page"],
  },
};

console.log("\x1b[37mPackager\n========\x1b[0m");

Object.keys(browsers).forEach(async (browserId) => {
  const distDir = `./dist/${browserId}`;

  // Copy JS/HTML/CSS/ICONS
  ensureDir(`${distDir}/static`);

  const options = { overwrite: true };
  copySync("./src/static", `${distDir}/static`, options);

  // Transform Manifest
  const manifest = JSON.parse(Deno.readTextFileSync("src/manifest.json"));
  const browserManifest = browsers[browserId];
  browserManifest.omits.forEach((omit) => delete manifest[omit]);

  Deno.writeTextFileSync(
    distDir + "/manifest.json",
    JSON.stringify(manifest, null, 2),
  );

  // Compile JS Files
  const jsFileNames = [
    "background",
    "contentScript",
    "options",
    "popup",
  ];

  const jsFiles = await Promise.all(jsFileNames.map((fileName) => {
    return Deno.emit(`./src/${fileName}.ts`);
  }));

  jsFiles.forEach(({ diagnostics, files }) => {
    for (const [sourcePath, text] of Object.entries(files)) {
      const sourceFileName = basename(sourcePath).replace(".ts", "");
      if (diagnostics.length) console.log(diagnostics);
      if (sourceFileName.indexOf(".map") === -1) {
        console.log(`building ${sourceFileName}...`);
      }
      Deno.writeTextFile(`./dist/${browserId}/${sourceFileName}`, text);
    }
  });

  const color = browserManifest.color || "";
  console.log(`Built for \x1b[1m${color}${browserId.toUpperCase()}\x1b[0m`);
});
