# Note: deno.json config and import_map.json are used by Deno.emit.
# They are intentionally NOT used by this file

build:
	deno run --allow-env --allow-net --allow-read --allow-write --allow-run bundler.ts

chrome:
	deno run --allow-env --allow-net --allow-read --allow-write --allow-run bundler.ts chrome

firefox:
	deno run --allow-env --allow-net --allow-read --allow-write --allow-run bundler.ts firefox

test:
	deno fmt
	deno lint
	deno test
	deno check source/background.ts source/content_script.ts source/options.tsx source/popup.tsx
