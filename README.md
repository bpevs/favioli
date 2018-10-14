**This is alpha version for Firefox. Base functionality works. Options page settings/overrides does not work correctly at the moment.**

Favioli
=======
Making the world a better place or something. Favioli automatically uses an emoji as a favicon for every website that lacks one.

Features
========
- Automatically use an emoji as a favicon for every website that lacks one.
- We always use the same emoji, so you always know which site it is.
![Using Favioli](./resources/screenshots/default.png)

- Override custom website hosts by regex or by matching part of the url's host
![Using Overrides](./resources/screenshots/overrides.png)

Build Steps
=========
Should work with any recent node; I'm using `v10.5.0` on Mac OS High Sierra for development.

```
npm install
npm run build
```
This will build our distribution code into /dist, each browser with its own directory.

Inspiration
==========
- [Emoji-Favicon-Toolkit](https://github.com/eligrey/emoji-favicon-toolkit) by [OFTN Inc.](https://oftn.org) and [Eli Grey](https://eligrey.com)
- [eft-input-modified-indicator.js](https://gist.github.com/eligrey/4df9453c3bc20acd38728ccba7bb7160) by [Eli Grey](https://eligrey.com)
- [Emoji-Selector](https://github.com/Kiricon/emoji-selector) by [Dominic Valenicana](https://dominic.codes/)
