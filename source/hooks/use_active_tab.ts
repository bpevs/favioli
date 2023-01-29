import Chrome from 'browser/types/chrome.ts';

import { useEffect, useState } from 'preact/hooks';
import browserAPI from 'browser';

const queryOptions = { active: true };
const { storage, tabs } = browserAPI;

export default function useActiveTab(): Chrome.Tab | void {
  const [activeTab, setActiveTab] = useState<Chrome.Tab | void>();

  useEffect(function updateactiveTab() {
    async function queryAndSetActiveTab() {
      setActiveTab((await tabs.query(queryOptions))[0]);
    }
    storage.onChanged.addListener(queryAndSetActiveTab);
    tabs.onUpdated.addListener(queryAndSetActiveTab);
    queryAndSetActiveTab().catch(console.error);
    (() => {
      storage.onChanged.removeListener(queryAndSetActiveTab);
      tabs.onUpdated.removeListener(queryAndSetActiveTab);
    });
  }, []);

  return activeTab;
}
