import type { PermissionsModule } from './modules/permissions.ts';
import type { RuntimeModule } from './modules/runtime.ts';
import type { StorageModule } from './modules/storage.ts';
import type { TabsModule } from './modules/tabs.ts';

export * from './modules/tabs.ts';

export interface BrowserAPI {
  permissions: PermissionsModule;
  runtime: RuntimeModule;
  storage: StorageModule;
  tabs: TabsModule;
}
