/**
 * Compile and bundle all the distributables into dist.
 *
 * Note: This file does NOT use deno.json as a config file for itself.
 * That config file is specifically for use in Deno.emit.
 *
 * Probably move to esbuild:
 *   - https://deno.land/x/esbuild_deno_loader@0.5.0
 */
import * as esbuild from 'https://deno.land/x/esbuild@v0.14.39/mod.js';
import { denoPlugin } from 'https://raw.githubusercontent.com/ivebencrazy/esbuild_deno_loader/main/mod.ts';
import { copySync, ensureDir } from 'fs';
import { resolve } from 'https://deno.land/std@0.142.0/path/mod.ts';

const importMapURL = new URL('file://' + resolve('./import_map.json'));

interface BrowserManifestSettings {
  color: string;
  omits: string[];
  // deno-lint-ignore no-explicit-any
  overrides?: { [id: string]: any };
}

interface BrowserManifests {
  [id: string]: BrowserManifestSettings;
}

const browsers: BrowserManifests = {
  chrome: {
    color: '\x1b[32m',
    omits: ['applications', 'options_ui', 'browser_action'],
  },
  firefox: {
    color: '\x1b[91m',
    overrides: {
      manifest_version: 2,
      background: {
        scripts: ['background.js'],
      },
    },
    omits: ['options_page', 'host_permissions', 'action'],
  },
};

if (Deno.args[0] === 'chrome') delete browsers.firefox;
if (Deno.args[0] === 'firefox') delete browsers.chrome;

console.log('\x1b[37mPackager\n========\x1b[0m');

Object.keys(browsers).forEach(async (browserId) => {
  const distDir = `dist/${browserId}`;

  // Copy JS/HTML/CSS/ICONS
  ensureDir(`${distDir}/static`);

  const options = { overwrite: true };
  copySync('source/static', distDir, options);

  const browserManifestSettings = browsers[browserId];

  // Transform Manifest
  const manifest = {
    ...JSON.parse(Deno.readTextFileSync('source/manifest.json')),
    ...browserManifestSettings.overrides,
  };
  browserManifestSettings.omits.forEach((omit) => delete manifest[omit]);

  Deno.writeTextFileSync(
    distDir + '/manifest.json',
    JSON.stringify(manifest, null, 2),
  );

  const color = browserManifestSettings.color || '';
  const browserName = browserId.toUpperCase();
  const colorizedBrowserName = `\x1b[1m${color}${browserName}\x1b[0m`;

  console.log(`Initializing ${colorizedBrowserName} build...`);

  await esbuild.build({
    plugins: [denoPlugin({ importMapURL })],
    entryPoints: [
      'source/options.tsx',
      'source/content_script.ts',
      'source/background.ts',
      'source/popup.tsx',
    ],
    outdir: `dist/${browserId}/`,
    bundle: true,
    watch: {
      onRebuild(error) {
        if (error) {
          console.error(`Rebuild for ${colorizedBrowserName} failed:`, error);
        } else console.log(`Rebuilt for ${colorizedBrowserName}`);
      },
    },
    format: 'esm',
    logLevel: 'verbose',
  });

  console.log(`Build complete for ${colorizedBrowserName}`);
});
