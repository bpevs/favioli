/** https://developer.chrome.com/docs/extensions/reference/runtime/#type-PlatformOs */
export type PlatformOs =
  | 'mac'
  | 'win'
  | 'android'
  | 'cros'
  | 'linux'
  | 'openbsd';

/** https://developer.chrome.com/docs/extensions/reference/runtime/#type-PlatformArch */
export type PlatformArch =
  | 'arm'
  | 'arm64'
  | 'x86-32'
  | 'x86-64'
  | 'mips'
  | 'mips64';

/** https://developer.chrome.com/docs/extensions/reference/runtime/#type-PlatformNaclArch */
export type PlatformNaclArch = 'arm' | 'x86-32' | 'x86-64' | 'mips' | 'mips64';

export interface PlatformInfo {
  /**
   * The operating system chrome is running on.
   */
  os: PlatformOs;
  /**
   * The machine's processor architecture.
   */
  arch: PlatformArch;
  /**
   * The native client architecture. This may be different from arch on some platforms.
   */
  nacl_arch: PlatformNaclArch;
}
