/* @jsx h */

import { h, render } from 'preact';
import { useCallback, useEffect, useState } from 'preact/hooks';
import browserAPI from './utilities/browser_api.ts';

interface Tab {
  favIconUrl?: string;
  url?: string;
}

const App = () => {
  const [url, setUrl] = useState<string | void>();

  useEffect(() => {
    browserAPI.tabs.query({ active: true })
      .then(([currTab]: Tab[]) => {
        setUrl(currTab.favIconUrl);
      });
  }, []);

  const goToOptions = useCallback(() => {
    browserAPI.runtime.openOptionsPage();
  }, []);

  const addToOverrides = useCallback(() => {
    browserAPI.tabs.query({ active: true })
      .then(([currTab]: Tab[]) => {
        setUrl(currTab.url);
      });
  }, []);

  return (
    <div className='page'>
      <h1>Favioli</h1>
      <button onClick={goToOptions}>
        Options
      </button>

      <button onClick={addToOverrides}>
        Change Favicon
      </button>
      <div>{url || ''}</div>
    </div>
  );
};

const mountPoint = document.getElementById('mount');
if (mountPoint) render(<App />, mountPoint);
