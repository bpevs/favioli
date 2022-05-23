# Favioli 🤯

<a href="https://chrome.google.com/webstore/detail/favioli/pnoookpoipfmadlpkijnboajfklplgbe">
  <img alt="Download for Chrome" src="https://img.shields.io/badge/download_for-chrome-blue.svg" />
</a>
<a href="https://addons.mozilla.org/en-US/firefox/addon/favioli/">
  <img alt="Download for Firefox" src="https://img.shields.io/badge/download_for-firefox-orange.svg" />
</a>

Favioli adds emoji FavIcons for websites that lack one. This README is for Favioli contribution information. Read the <a href="https://bpev.me/favioli">Favioli introduction blog post</a> for more information about why Favioli exists, or click the badges for your Chrome and Firefox downloads.

# Development

Favioli should work with any recent [Node.js](https://nodejs.org/en/) version;
I'm currently using `v10.5.0` on Mac OS High Sierra for development.

```sh
# NOTE:
# Deno.emit is not supported in v1.22.0
# We will move to v1.22.0 when we can make a stable configuration for
# https://github.com/denoland/deno_emit

# To use unstable Deno v1.21.3:
# deno upgrade --version 1.21.3

# Run tests
make test

# Start running for development
make watch

# Create a build
make package
```

This will build our distribution code into `/dist`, each browser with its own
directory. To load Favioli, point to each browser's respective directory.
[Google](https://developer.chrome.com/extensions) and
[Mozilla](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons) each have
resources about developing for their respective platforms.

# Inspiration

- [Emoji-Favicon-Toolkit](https://github.com/eligrey/emoji-favicon-toolkit) by
  [OFTN Inc.](https://oftn.org) and [Eli Grey](https://eligrey.com)
- [eft-input-modified-indicator.js](https://gist.github.com/eligrey/4df9453c3bc20acd38728ccba7bb7160)
  by [Eli Grey](https://eligrey.com)
- [Emoji-Selector](https://github.com/Kiricon/emoji-selector) by
  [Dominic Valenicana](https://dominic.codes/)
