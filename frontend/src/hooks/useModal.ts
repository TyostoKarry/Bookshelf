import { useContext } from "react";
import { ModalContext, type ModalContextValue } from "../contexts/ModalContext";

export const useModal = (): ModalContextValue => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
