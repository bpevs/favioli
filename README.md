> This README is for Favioli 2.00, which is not currently released.
> Use [`main`](https://github.com/ivebencrazy/favioli) to see the code of the currently deployed Favioli.

# Favioli 🤯

<p>
<a href="https://chrome.google.com/webstore/detail/favioli/pnoookpoipfmadlpkijnboajfklplgbe">
  <img alt="Download for Chrome" src="https://img.shields.io/badge/download_for-chrome-blue.svg" />
</a>
<a href="https://addons.mozilla.org/en-US/firefox/addon/favioli/">
  <img alt="Download for Firefox" src="https://img.shields.io/badge/download_for-firefox-orange.svg" />
</a>
</p>

Favioli is a tool for overriding Favicons for websites.

## Development

You need to download [Deno](https://deno.land/) in order to build this app.

After, we want to install [bext](https://github.com/bpevs/bext):

```sh
deno install --name=bext --allow-read --allow-write --allow-run --allow-env -f https://deno.land/x/bext/main.ts
```

| Commands         | What they Do                        |
| ---------------- | ----------------------------------- |
| `bext`           | bundles extension and watch code    |
| `bext chrome`    | bundles extension only for chrome   |
| `bext firefox`   | bundles extension only for firefox  |
| `deno task test` | run code formatter, then unit tests |

If you have bundled using make commands, you should be able to load your
unpacked extension using a browser.

This will build our distribution code into `/dist`, each browser with its own
directory. To load Favioli, point to each browser's respective directory.
[Google](https://developer.chrome.com/extensions) and
[Mozilla](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons) each have
resources about developing for their respective platforms.

## Inspiration

- [Emoji-Favicon-Toolkit](https://github.com/eligrey/emoji-favicon-toolkit) by
  [OFTN Inc.](https://oftn.org) and [Eli Grey](https://eligrey.com)
- [eft-input-modified-indicator.js](https://gist.github.com/eligrey/4df9453c3bc20acd38728ccba7bb7160)
  by [Eli Grey](https://eligrey.com)
- [Emoji-Selector](https://github.com/Kiricon/emoji-selector) by
  [Dominic Valenicana](https://dominic.codes/)
