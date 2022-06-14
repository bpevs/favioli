import type { Tab } from './tabs.ts';
import type { Event } from './event.ts';

export interface Window {
  tabs?: Tab[] | undefined;
  top?: number | undefined;
  height?: number | undefined;
  width?: number | undefined;
  state?: windowStateEnum | undefined;
  focused: boolean;
  alwaysOnTop: boolean;
  incognito: boolean;
  type?: windowTypeEnum | undefined;
  id?: number | undefined;
  left?: number | undefined;
  sessionId?: string | undefined;
}

export interface QueryOptions {
  populate?: boolean | undefined;
  windowTypes?: windowTypeEnum[] | undefined;
}

export interface CreateData {
  tabId?: number | undefined;
  url?: string | string[] | undefined;
  top?: number | undefined;
  height?: number | undefined;
  width?: number | undefined;
  focused?: boolean | undefined;
  incognito?: boolean | undefined;
  type?: createTypeEnum | undefined;
  left?: number | undefined;
  state?: windowStateEnum | undefined;
  setSelfAsOpener?: boolean | undefined;
}

export interface UpdateInfo {
  top?: number | undefined;
  drawAttention?: boolean | undefined;
  height?: number | undefined;
  width?: number | undefined;
  state?: windowStateEnum | undefined;
  focused?: boolean | undefined;
  left?: number | undefined;
}

export interface WindowEventFilter {
  windowTypes: windowTypeEnum[];
}

export interface WindowIdEvent extends Event<(windowId: number) => void> {
  addListener(
    callback: (windowId: number) => void,
    filters?: WindowEventFilter,
  ): void;
}

export interface WindowReferenceEvent extends Event<(window: Window) => void> {
  addListener(
    callback: (window: Window) => void,
    filters?: WindowEventFilter,
  ): void;
}
export type createTypeEnum = 'normal' | 'popup' | 'panel';
export type windowStateEnum =
  | 'normal'
  | 'minimized'
  | 'maximized'
  | 'fullscreen'
  | 'locked-fullscreen';
export type windowTypeEnum = 'normal' | 'popup' | 'panel' | 'app' | 'devtools';

export interface WindowsModule {
  WINDOW_ID_CURRENT: -2;
  WINDOW_ID_NONE: -1;
  onRemoved: WindowIdEvent;
  onCreated: WindowReferenceEvent;
  onFocusChanged: WindowIdEvent;
  onBoundsChanged: WindowReferenceEvent;
  get: (
    windowId: number,
    queryOptions?: QueryOptions,
  ) => Promise<Window>;
  getCurrent: (
    queryOptions?: QueryOptions,
  ) => Promise<Window>;
  create: (createData?: CreateData) => Promise<Window>;
  getAll: (
    queryOptions?: QueryOptions,
  ) => Promise<Window[]>;
  update: (
    windowId: number,
    updateInfo: UpdateInfo,
  ) => Promise<Window>;
  remove: (windowId: number) => Promise<void>;
  getLastFocused: (
    queryOptions: QueryOptions,
  ) => Promise<Window>;
}
