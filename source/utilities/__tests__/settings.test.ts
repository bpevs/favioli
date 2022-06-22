import { assertEquals } from 'asserts';
import { describe, it } from 'bdd';

import { isV1Settings, migrateFromV1, parseVersion } from '../settings.ts';
import { v0, v1, v2 } from './fixtures/settings_data.ts';

describe('parseVersion', () => {
  it('should parse version with descriptor', () => {
    assertEquals(parseVersion('2.0.0-beta-1'), {
      major: 2,
      minor: 0,
      patch: 0,
      descriptor: 'beta-1',
    });
  });

  it('should parse version without descriptor', () => {
    assertEquals(parseVersion('1.0.3'), {
      major: 1,
      minor: 0,
      patch: 3,
      descriptor: '',
    });
  });

  it('should error if no version', () => {
    try {
      parseVersion('');
    } catch (e) {
      assertEquals(e.message, 'No Version Detected');
    }
  });

  it('should error if invalid version', () => {
    try {
      parseVersion('51234');
    } catch (e) {
      assertEquals(e.message, 'Error Parsing Version 51234');
    }
  });
});

describe('migrateFromV1', () => {
  it('should migrate from v0 to v2', () => {
    assertEquals(isV1Settings(v0), true);
    assertEquals(migrateFromV1(v0), v2);
  });

  it('should migrate from v1 to v2', () => {
    assertEquals(isV1Settings(v1), true);
    assertEquals(migrateFromV1(v1), v2);
  });
});
