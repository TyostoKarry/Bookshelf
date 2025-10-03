import { type ReactNode, useState } from "react";
import {
  dictionaries,
  type Dictionary,
  type Language,
  LanguageContext,
} from "./LanguageContext";
import type { Path } from "../types/translation-keys";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  const t = (key: Path<Dictionary>): string => {
    const parts = key.split(".");
    let result: unknown = dictionaries[language];

    for (const part of parts) {
      if (typeof result === "object" && result !== null && part in result) {
        result = (result as Record<string, unknown>)[part];
      } else {
        return key;
      }
    }

    return typeof result === "string" ? result : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
