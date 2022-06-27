import type { Tab } from 'browser';

import { useEffect, useState } from 'preact/hooks';
import browserAPI from 'browser';

const queryOptions = { active: true };
const { storage, tabs } = browserAPI;

export default function useActiveTab(): Tab | void {
  const [activeTab, setActiveTab] = useState<Tab | void>();

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
