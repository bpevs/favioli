type Favicon = string;
type IgnoreItem = string;
type UrlFaviconPair = [string, Favicon];

export interface Settings {
  siteList: UrlFaviconPair[];
  ignoreList: IgnoreItem[];

  enableFaviconActiveFlag: boolean;
  enableFaviconAutofill: boolean;
  enableSiteIgnore: boolean;
}

export const defaultSettings: Settings = {
  siteList: [],
  ignoreList: [],

  enableFaviconActiveFlag: false,
  enableFaviconAutofill: false,
  enableSiteIgnore: false,
};