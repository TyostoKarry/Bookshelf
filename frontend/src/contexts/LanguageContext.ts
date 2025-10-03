import { createContext } from "react";
import en from "../locales/en.json";
import type { Path } from "../types/translation-keys";

type Language = "en";
type Dictionary = typeof en;

const dictionaries: Record<Language, Dictionary> = { en };

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: Path<Dictionary>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export { dictionaries, type Dictionary, type Language, LanguageContext };
