import { type ReactNode } from "react";
import { LanguageProvider } from "./LanguageProvider";
import { ModalProvider } from "./ModalProvider";
import { MyBookshelfProvider } from "./MyBookshelfProvider";

export const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <LanguageProvider>
      <ModalProvider>
        <MyBookshelfProvider>{children}</MyBookshelfProvider>
      </ModalProvider>
    </LanguageProvider>
  );
};
