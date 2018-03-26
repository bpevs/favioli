Favioli
=======
Making the world a better place or something

This is a Chrome extension implementation of [Emoji-Favicon-Toolkit](https://github.com/eligrey/emoji-favicon-toolkit) that replaces favicons with emojis.

Features
=======
- Automatically use an emoji as a favicon for websites that are lacking one.
- Option to override all favicons with emojis so you can be lost and sad.

![Overriding all the things](./screenshots/screenshot-1.png)


How it Works
============
 - contentScript handles favicon replacement
 - background script handles favicon selection, pulling settings from options page
 - https://stackoverflow.com/questions/32777310/messaging-between-content-script-and-background-page-in-a-chrome-extension-is-no