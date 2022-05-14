/* @jsx h */
import { Fragment, h } from 'preact';

export default function() {
  return (
    <Fragment>
      <h1>About Favioli</h1>
      <h2>What is Favioli?</h2>
      <p>
      Favioli is a tool for modifying website favicons (icons that represent
      websites in tabs, your browsing history, and your bookmarks).
      </p>

      <h2>Privacy Policy</h2>
      <p>
        Favioli does not track you, does not transmit any data outside of
        your computer, and does not modify anything outside of favicons.
      </p>
      <p>
        We are actively trying to respect your privacy. The source code is
        freely available for inspection and/or to build from source:
      </p>
      <a href="https://github.com/ivebencrazy/favioli">
        https://github.com/ivebencrazy/favioli
      </a>

      <h2>Permissions</h2>
      <p>
        Favioli tries to make permissions granular for whatever you are trying
        to use it for. To replace a favicon, we do run our own code on websites
        you are browsing. So if you are very nervous about that, you can enable
        Favioli to only run on specific websites.
      </p>

      <h2>Something is broken!</h2>
      <p>
        Please report any bugs you find on <a href="https://github.com/ivebencrazy/favioli/issues">Github</a>!
        In the future, we will try to add a button you can use to send this
        kind of thing. Since we do not collect any automated feedback, though,
        your feedback is very useful!
      </p>
    </Fragment>
  )
}
