// deno-lint-ignore-file no-explicit-any no-empty-interface
import { Event } from './event.ts';

export interface StorageArea {
  getBytesInUse(keys?: string | string[] | null): Promise<number>;
  clear(): Promise<void>;
  set(items: { [key: string]: any }): Promise<void>;
  remove(keys: string | string[]): Promise<void>;
  get(
    keys?: string | string[] | { [key: string]: any } | null,
  ): Promise<{ [key: string]: any }>;
}

export interface StorageChange {
  newValue?: any;
  oldValue?: any;
}

export interface LocalStorageArea extends StorageArea {
  QUOTA_BYTES: number;
}

export interface SyncStorageArea extends StorageArea {
  MAX_SUSTAINED_WRITE_OPERATIONS_PER_MINUTE: number;
  QUOTA_BYTES: number;
  QUOTA_BYTES_PER_ITEM: number;
  MAX_ITEMS: number;
  MAX_WRITE_OPERATIONS_PER_HOUR: number;
  MAX_WRITE_OPERATIONS_PER_MINUTE: number;
}

type AreaName = 'sync' | 'local' | 'managed';
export interface StorageChangedEvent extends
  Event<
    (changes: { [key: string]: StorageChange }, areaName: AreaName) => void
  > {}

export interface StorageModule {
  local: LocalStorageArea;
  sync: SyncStorageArea;
  managed: StorageArea;
  onChanged: StorageChangedEvent;
}
