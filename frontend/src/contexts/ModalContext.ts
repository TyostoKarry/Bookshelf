import { createContext } from "react";
import type { EmptyObject } from "../types/emptyObject";

export type ModalType = "CREATE_BOOKSHELF" | "TOKEN" | "ENTER_TOKEN" | null;

export type ModalState =
  | { modalType: "CREATE_BOOKSHELF"; props: EmptyObject }
  | { modalType: "TOKEN"; props: { token: string } }
  | { modalType: "ENTER_TOKEN"; props: EmptyObject }
  | { modalType: null; props: EmptyObject };

export interface ModalContextValue {
  modalState: ModalState;
  openModal: <T extends ModalState["modalType"]>(
    type: T,
    props: Extract<ModalState, { modalType: T }>["props"],
  ) => void;
  closeModal: () => void;
}

export const ModalContext = createContext<ModalContextValue>({
  modalState: { modalType: null, props: {} },
  openModal: () => {},
  closeModal: () => {},
});
