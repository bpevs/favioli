# Note: deno.json config and import_map.json are used by Deno.emit.
# They are intentionally NOT used by this file

build:
	deno run --unstable --allow-net --allow-read --allow-write bundler.ts

chrome:
	deno run --unstable --allow-net --allow-read --allow-write bundler.ts chrome

firefox:
	deno run --unstable --allow-net --allow-read --allow-write bundler.ts firefox

watch:
	deno run --unstable --watch --allow-net --allow-read --allow-write bundler.ts

watch-chrome:
	deno run --unstable --watch --allow-net --allow-read --allow-write bundler.ts chrome

watch-firefox:
	deno run --unstable --watch --allow-net --allow-read --allow-write bundler.ts firefox

test:
	deno fmt
	deno test
