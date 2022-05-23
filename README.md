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

> 1. Need to use Deno version PRE v1.22.0
>
> - Deno.emit is not supported in v1.22.0
> - We will transition to v1.22.0 when we can make a stable configuration for the userland [deno_emit](https://github.com/denoland/deno_emit) module
> - To use unstable Deno v1.21.3: `deno upgrade --version 1.21.3`
>
> 2. This application uses the unstable Deno api [`Deno.emit`](https://doc.deno.land/deno/unstable@v1.21.3/~/Deno.emit)
> 3. `chrome` and `browser` globals are currently `any` type

| Commands             | What they Do                               |
| -------------------- | ------------------------------------------ |
| `make`               | bundles extension                          |
| `make chrome`        | bundles extension only for chrome          |
| `make firefox`       | bundles extension only for firefox         |
| `make watch`         | watch for js changes, and bundle on change |
| `make watch-chrome`  | watch only for chrome                      |
| `make watch-firefox` | watch only for firefox                     |
| `make test`          | run code formatter, then unit tests        |

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
