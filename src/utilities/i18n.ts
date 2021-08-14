import locales, { Locale } from "../config/locales";

async function getStrings(): Locale {
  const languages = await browser.i18n.getAcceptLanguages();

  for (language in languages) {
    if (locales[languages]) return locales[languages];
  }

  return locales.en;
}

export async function getMessage(stringCode: string) {
  return getStrings()[stringCode]?.message;
}

export async function getDesc(stringCode: string) {
  return getStrings()[stringCode]?.description;
}
