import { assertEquals } from 'std/asserts';
import { describe, it } from 'std/bdd';

import { v0, v1, v2 } from '../__fixtures__/settings_fixtures.ts';
import { isSettingsV1, migrateStorageFromV1 } from '../storage_legacy.ts';

describe('migrateStorageFromV1', () => {
  it('should migrate from v0 to v2', () => {
    assertEquals(isSettingsV1(v0), true);
    assertEquals(migrateStorageFromV1(v0), v2);
  });

  it('should migrate from v1 to v2', () => {
    assertEquals(isSettingsV1(v1), true);
    assertEquals(migrateStorageFromV1(v1), v2);
  });
});
