Favioli
=======
Making the world a better place or something.

Heavily inspired by [Emoji-Favicon-Toolkit](https://github.com/eligrey/emoji-favicon-toolkit)


Features
=======
- Automatically use an emoji as a favicon for every website that lacks one.
- Option to override all favicons with emojis so you can be lost and sad.

![Overriding all the things](./screenshots/screenshot-1.png)


How it Works (in progress)
============
 - Content Scripts handle favicon replacement
 - Background script handles favicon selection, pulling settings from options page
 - Options page handles settings and emoji selection, pulling settings from options page for plugins
 - Popup page handles quick-select overrides of custom page favicon (by host or by url)
