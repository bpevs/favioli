start:
	deno run --unstable --allow-read --allow-write packager.ts

watch:
	deno run --watch --unstable --allow-read --allow-write packager.ts

test:
	deno fmt
	deno test
