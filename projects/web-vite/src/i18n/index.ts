import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import { de } from "./lang/de.ts";
import { en } from "./lang/en.ts";
import { es } from "./lang/es.ts";
import { fil } from "./lang/fil.ts";
import { fr } from "./lang/fr.ts";
import { ja } from "./lang/ja.ts";
import { nl } from "./lang/nl.ts";
import { ur } from "./lang/ur.ts";
import { yue } from "./lang/yue.ts";
import { zh_Hans } from "./lang/zh-hans.ts";
import { zh_Hant } from "./lang/zh-hant.ts";

export const defaultNS = "app";

export const supportedLocales = [ "en", "es", "de", "fr", "fil", "ja", "nl", "ur", "yue", "zh-Hans", "zh-Hant" ];

export const languageNames = {
  system: "system",
  // Get local display names
  ...supportedLocales.reduce(
    (acc, locale) => ({ ...acc, [locale]: new Intl.DisplayNames(locale, { type: "language" }).of(locale) }),
    {},
  ),
};

export const languages = {
  en: en.translations,
  es: es.translations,
  de: de.translations,
  fr: fr.translations,
  fil: fil.translations,
  ja: ja.translations,
  nl: nl.translations,
  ur: ur.translations,
  yue: yue.translations,
  "zh-Hans": zh_Hans.translations,
  "zh-Hant": zh_Hant.translations,
};

await i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources: languages,
    fallbackLng: "en",
    supportedLngs: Object.keys(languages),
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
