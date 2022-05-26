type Favicon = string;
type IgnoreItem = string;
type UrlFaviconPair = [string, Favicon];

export interface Settings {
  siteList: IgnoreItem[];
  ignoreList: IgnoreItem[];

  features: {
    enableFaviconAutofill?: boolean;
    enableSiteIgnore?: boolean;
  };
}

export const defaultSettings: Settings = {
  siteList: [],
  ignoreList: [],

  features: {
    enableFaviconAutofill: false,
    enableSiteIgnore: false,
  },
};

export const STORAGE_KEYS = Object.freeze([
  'siteList',
  'ignoreList',
  'features',
]);
