// deno-lint-ignore-file no-explicit-any

import type { Manifest } from './manifest.ts';
import type { PlatformInfo } from './platform.ts';
import type { Tab } from './tabs.ts';
import type { Event } from './event.ts';

interface Object {
  [name: string]: any;
}

/** https://developer.chrome.com/docs/extensions/reference/runtime/#type-OnInstalledReason */
export enum OnInstalledReason {
  INSTALL = 'install',
  UPDATE = 'update',
  CHROME_UPDATE = 'chrome_update',
  SHARED_MODULE_UPDATE = 'shared_module_update',
}

export interface LastError {
  message?: string | undefined;
}

export interface ConnectInfo {
  name?: string | undefined;
  includeTlsChannelId?: boolean | undefined;
}

export interface InstalledDetails {
  reason: OnInstalledReason;
  previousVersion?: string | undefined;
  id?: string | undefined;
}

export interface MessageOptions {
  /** Whether the TLS channel ID will be passed into onMessageExternal for processes that are listening for the connection event. */
  includeTlsChannelId?: boolean | undefined;
}

export interface MessageSender {
  id?: string | undefined;
  tab?: Tab | undefined;
  nativeApplication?: string | undefined;
  frameId?: number | undefined;
  url?: string | undefined;
  tlsChannelId?: string | undefined;
  origin?: string | undefined;
}

export interface Port {
  postMessage: (message: any) => void;
  disconnect: () => void;
  sender?: MessageSender | undefined;
  onDisconnect: PortDisconnectEvent;
  onMessage: PortMessageEvent;
  name: string;
}

export interface UpdateAvailableDetails {
  version: string;
}

export interface UpdateCheckDetails {
  version: string;
}

export type RequestUpdateCheckStatus =
  | 'throttled'
  | 'no_update'
  | 'update_available';

export type PortDisconnectEvent = Event<(port: Port) => void>;

export type PortMessageEvent = Event<
  (message: any, port: Port) => void
>;

export type ExtensionMessageEvent = Event<
  (
    message: any,
    sender: MessageSender,
    sendResponse: (response?: any) => void,
  ) => void
>;

export type ExtensionConnectEvent = Event<(port: Port) => void>;
export type RuntimeEvent = Event<() => void>;
export type RuntimeRestartRequiredEvent = Event<
  (reason: string) => void
>;
export type RuntimeUpdateAvailableEvent = Event<
  (details: UpdateAvailableDetails) => void
>;

export interface RuntimeModule {
  lastError: LastError | undefined;
  id: string;

  onConnect: ExtensionConnectEvent;
  onConnectExternal: ExtensionConnectEvent;
  onSuspend: RuntimeEvent;
  onStartup: RuntimeEvent;
  onInstalled: RuntimeEvent;
  onSuspendCanceled: RuntimeEvent;
  onMessage: ExtensionMessageEvent;
  onMessageExternal: ExtensionMessageEvent;
  onRestartRequired: RuntimeRestartRequiredEvent;
  onUpdateAvailable: RuntimeUpdateAvailableEvent;
  onBrowserUpdateAvailable: RuntimeEvent;

  connect: (connectInfo?: ConnectInfo) => Port;
  connectNative: (application: string) => Port;
  getBackgroundPage: (callback: (backgroundPage?: Window) => void) => void;
  getManifest: () => Manifest;
  getPackageDirectoryEntry: (
    callback: (directoryEntry: any) => void,
  ) => void;
  getPlatformInfo: () => Promise<PlatformInfo>;
  getURL: (path: string) => string;
  reload: () => void;
  requestUpdateCheck: (
    callback: (
      status: RequestUpdateCheckStatus,
      details?: UpdateCheckDetails,
    ) => void,
  ) => void;
  restart: () => void;
  restartAfterDelay: (seconds: number, callback?: () => void) => void;
  sendMessage: <M, R>(
    message: M,
    options: MessageOptions,
    responseCallback: (response: R) => void,
  ) => void;
  sendNativeMessage: (
    application: string,
    message: Object,
    responseCallback: (response: any) => void,
  ) => void;
  setUninstallURL: (url: string, callback?: () => void) => void;
  openOptionsPage: (callback?: () => void) => void;
}
