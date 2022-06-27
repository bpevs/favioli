/* @jsx h */
import type { BrowserStorage } from '../hooks/use_browser_storage.ts';
import type { Settings } from '../models/settings.ts';

import { Fragment, h } from 'preact';
import { useContext } from 'preact/hooks';

import Only from '../components/only.tsx';
import { SettingsContext } from '../models/settings.ts';

export default function () {
  const storage = useContext<BrowserStorage<Settings>>(SettingsContext);
  const { cache = { version: 0 } } = storage || {};

  return (
    <Fragment>
      <h1>About Favioli</h1>
      <Only if={Boolean(cache?.version)}>
        <p>Version {cache?.version}</p>
      </Only>

      <h2>What is Favioli?</h2>
      <p>
        Favioli is a tool for modifying website favicons (icons that represent
        websites in tabs, your browsing history, and your bookmarks).
      </p>

      <h2>Privacy Policy</h2>
      <p>
        Favioli does not track you, does not transmit any data outside of your
        computer, and does not modify anything on websites outside of favicons.
      </p>
      <p>
        The only links to external sites/etc are informational links on this
        about page.
      </p>
      <p>
        I am actively trying to respect your privacy. The source code is freely
        available for inspection and/or to build from source:
      </p>
      <a href='https://github.com/ivebencrazy/favioli'>
        https://github.com/ivebencrazy/favioli
      </a>

      <h2>Permissions</h2>
      <p>
        To replace favicons, Favioli runs code on websites that you are
        browsing. If you are very nervous about that, some browsers now allow
        you to restrict extensions to only run on specific websites. As features
        are added, I will try to keep permissions as granular as possible.
      </p>

      <h2>Something is broken!</h2>
      <p>
        Please report any bugs you find on{' '}
        <a href='https://github.com/ivebencrazy/favioli/issues'>
          Github Issues
        </a>! Since Favioli does not collect any automated feedback, any kind of
        feedback is very useful!
      </p>
      <p>
        In the future, I will add a form to{' '}
        <a href='https://favioli.com/contact'>favioli.com/contact</a>{' '}
        so that sending feedback will be easier.
      </p>

      <p>Thanks for using Favioli!</p>
      <p>
        – <a href='https://bpev.me'>Ben</a>
      </p>
      <p></p>
    </Fragment>
  );
}
