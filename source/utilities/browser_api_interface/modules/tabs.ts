// deno-lint-ignore-file no-explicit-any

import type { Window } from './windows.ts';
import type { Event } from './event.ts';
import type { Port } from './runtime.ts';

export interface MutedInfo {
  muted: boolean;
  reason?: string | undefined;
  extensionId?: string | undefined;
}

export interface Tab {
  status?: string | undefined;
  index: number;
  openerTabId?: number | undefined;
  title?: string | undefined;
  url?: string | undefined;
  pendingUrl?: string | undefined;
  pinned: boolean;
  highlighted: boolean;
  windowId: number;
  active: boolean;
  favIconUrl?: string | undefined;
  id?: number | undefined;
  incognito: boolean;
  selected: boolean;
  audible?: boolean | undefined;
  discarded: boolean;
  autoDiscardable: boolean;
  mutedInfo?: MutedInfo | undefined;
  width?: number | undefined;
  height?: number | undefined;
  sessionId?: string | undefined;
  groupId: number;
}

export interface ZoomSettings {
  mode?: string | undefined;
  scope?: string | undefined;
  defaultZoomFactor?: number | undefined;
}

export interface InjectDetails {
  allFrames?: boolean | undefined;
  code?: string | undefined;
  runAt?: string | undefined;
  file?: string | undefined;
  frameId?: number | undefined;
  matchAboutBlank?: boolean | undefined;
  cssOrigin?: string | undefined;
}

export interface CreateProperties {
  index?: number | undefined;
  openerTabId?: number | undefined;
  url?: string | undefined;
  pinned?: boolean | undefined;
  windowId?: number | undefined;
  active?: boolean | undefined;
  selected?: boolean | undefined;
}

export interface MoveProperties {
  index: number;
  windowId?: number | undefined;
}

export interface UpdateProperties {
  pinned?: boolean | undefined;
  openerTabId?: number | undefined;
  url?: string | undefined;
  highlighted?: boolean | undefined;
  active?: boolean | undefined;
  selected?: boolean | undefined;
  muted?: boolean | undefined;
  autoDiscardable?: boolean | undefined;
}

export interface CaptureVisibleTabOptions {
  quality?: number | undefined;
  format?: string | undefined;
}

export interface ReloadProperties {
  bypassCache?: boolean | undefined;
}

export interface ConnectInfo {
  name?: string | undefined;
  frameId?: number | undefined;
}

export interface MessageSendOptions {
  frameId?: number | undefined;
}

export interface GroupOptions {
  createProperties?: {
    windowId?: number | undefined;
  } | undefined;
  groupId?: number | undefined;
  tabIds?: number | number[] | undefined;
}

export interface HighlightInfo {
  tabs: number | number[];
  windowId?: number | undefined;
}

export interface QueryInfo {
  status?: 'loading' | 'complete' | undefined;
  lastFocusedWindow?: boolean | undefined;
  windowId?: number | undefined;
  windowType?: 'normal' | 'popup' | 'panel' | 'app' | 'devtools' | undefined;
  active?: boolean | undefined;
  index?: number | undefined;
  title?: string | undefined;
  url?: string | string[] | undefined;
  currentWindow?: boolean | undefined;
  highlighted?: boolean | undefined;
  discarded?: boolean | undefined;
  autoDiscardable?: boolean | undefined;
  pinned?: boolean | undefined;
  audible?: boolean | undefined;
  muted?: boolean | undefined;
  groupId?: number | undefined;
}

export interface TabHighlightInfo {
  windowId: number;
  tabIds: number[];
}

export interface TabRemoveInfo {
  windowId: number;
  isWindowClosing: boolean;
}

export interface TabAttachInfo {
  newPosition: number;
  newWindowId: number;
}

export interface TabChangeInfo {
  status?: string | undefined;
  pinned?: boolean | undefined;
  url?: string | undefined;
  audible?: boolean | undefined;
  discarded?: boolean | undefined;
  autoDiscardable?: boolean | undefined;
  groupId?: number | undefined;
  mutedInfo?: MutedInfo | undefined;
  favIconUrl?: string | undefined;
  title?: string | undefined;
}

export interface TabMoveInfo {
  toIndex: number;
  windowId: number;
  fromIndex: number;
}

export interface TabDetachInfo {
  oldWindowId: number;
  oldPosition: number;
}

export interface TabActiveInfo {
  tabId: number;
  windowId: number;
}

export interface TabWindowInfo {
  windowId: number;
}

export interface ZoomChangeInfo {
  tabId: number;
  oldZoomFactor: number;
  newZoomFactor: number;
  zoomSettings: ZoomSettings;
}

export type TabHighlightedEvent = Event<
  (highlightInfo: TabHighlightInfo) => void
>;
export type TabRemovedEvent = Event<
  (tabId: number, removeInfo: TabRemoveInfo) => void
>;
export type TabUpdatedEvent = Event<
  (tabId: number, changeInfo: TabChangeInfo, tab: Tab) => void
>;
export type TabAttachedEvent = Event<
  (tabId: number, attachInfo: TabAttachInfo) => void
>;
export type TabMovedEvent = Event<
  (tabId: number, moveInfo: TabMoveInfo) => void
>;
export type TabDetachedEvent = Event<
  (tabId: number, detachInfo: TabDetachInfo) => void
>;
export type TabCreatedEvent = Event<(tab: Tab) => void>;
export type TabActivatedEvent = Event<(activeInfo: TabActiveInfo) => void>;
export type TabReplacedEvent = Event<
  (addedTabId: number, removedTabId: number) => void
>;
export type TabSelectedEvent = Event<
  (tabId: number, selectInfo: TabWindowInfo) => void
>;
export type TabZoomChangeEvent = Event<
  (ZoomChangeInfo: ZoomChangeInfo) => void
>;

export interface TabsModule {
  onHighlighted: TabHighlightedEvent;
  onRemoved: TabRemovedEvent;
  onUpdated: TabUpdatedEvent;
  onAttached: TabAttachedEvent;
  onMoved: TabMovedEvent;
  onDetached: TabDetachedEvent;
  onCreated: TabCreatedEvent;
  onActivated: TabActivatedEvent;
  onReplaced: TabReplacedEvent;
  onSelectionChanged: TabSelectedEvent;
  onActiveChanged: TabSelectedEvent;
  onHighlightChanged: TabHighlightedEvent;
  onZoomChange: TabZoomChangeEvent;
  TAB_ID_NONE: -1;

  executeScript: (
    tabId: number,
    details: InjectDetails,
  ) => Promise<any[]>;
  get: (tabId: number) => Promise<Tab>;
  getAllInWindow: (windowId: number) => Promise<Tab>;
  getCurrent: () => Promise<Tab>;
  getSelected: (windowId: number) => Promise<Tab>;
  create: (createProperties: CreateProperties) => Promise<Tab>;
  move: (
    tabIds: number[],
    moveProperties: MoveProperties,
  ) => Promise<Tab[]>;
  update: (
    tabId: number,
    updateProperties: UpdateProperties,
  ) => Promise<Tab>;
  remove: (tabIds: number[]) => Promise<void>;
  captureVisibleTab: (
    windowId: number,
    options: CaptureVisibleTabOptions,
  ) => Promise<string>;
  reload: (
    tabId: number,
    reloadProperties?: ReloadProperties,
  ) => Promise<void>;
  duplicate: (tabId: number, callback?: (tab?: Tab) => void) => void;
  connect: (tabId: number, connectInfo?: ConnectInfo) => Port;
  insertCSS: (tabId: number, details: InjectDetails) => Promise<void>;
  highlight: (
    highlightInfo: HighlightInfo,
  ) => Promise<Window>;
  query: (queryInfo: QueryInfo) => Promise<Tab[]>;
  detectLanguage: (tabId: number) => Promise<string>;
  getZoom: (tabId: number) => Promise<number>;
  setZoomSettings: (
    tabId: number,
    zoomSettings: ZoomSettings,
  ) => Promise<void>;
  getZoomSettings: (tabId: number) => Promise<ZoomSettings>;
  discard: (tabId?: number) => Promise<Tab>;
  goForward: (tabId: number) => Promise<void>;
  goBack: (tabId: number) => Promise<void>;
  group: (options: GroupOptions) => Promise<number>;
  ungroup: (tabIds: number | number[]) => Promise<void>;
  sendMessage: <M = any, R = any>(
    tabId: number,
    message: M,
    options?: MessageSendOptions,
    responseCallback?: (response: R) => void,
  ) => void;
  sendRequest: <Request = any, Response = any>(
    tabId: number,
    request: Request,
    responseCallback?: (response: Response) => void,
  ) => void;
}
