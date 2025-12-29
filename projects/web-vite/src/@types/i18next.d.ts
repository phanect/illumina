import type { defaultNS, languages } from "@/i18n";

declare module "i18next" {
  type CustomTypeOptions = {
    defaultNS: typeof defaultNS;
    resources: (typeof languages)["en"];
  };
}
