import { type ReactNode } from "react";
import { LanguageProvider } from "./LanguageProvider";
import { ModalProvider } from "./ModalProvider";

export const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <LanguageProvider>
      <ModalProvider>{children}</ModalProvider>
    </LanguageProvider>
  );
};
