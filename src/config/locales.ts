export interface LocalizedString {
  message: string;
  description: string;
}

export interface Locale {
  [name: string]: LocalizedString;
}

import en from "./locales/en.js";

const locales: {
  [name: string]: Locale;
} = {
  en,
};

export default locales;
