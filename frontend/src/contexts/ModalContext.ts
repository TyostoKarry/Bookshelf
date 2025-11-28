import { createContext } from "react";
import type { EmptyObject } from "../types/emptyObject";
import type { OpenLibraryImportBookDetails } from "../types/openlibrary";

export type ModalType =
  | "CREATE_BOOKSHELF"
  | "TOKEN"
  | "ENTER_TOKEN"
  | "ENTER_ID"
  | null;

export type ModalState =
  | { modalType: "CREATE_BOOKSHELF"; props: EmptyObject }
  | { modalType: "TOKEN"; props: { token: string } }
  | { modalType: "ENTER_TOKEN"; props: EmptyObject }
  | { modalType: "ENTER_ID"; props: EmptyObject }
  | {
      modalType: "CONFIRMATION";
      props: {
        title: string;
        message: string;
        confirmLabel: string;
        confirmColor?: "success" | "danger";
        onConfirm: () => void;
      };
    }
  | {
      modalType: "SEARCH_OPEN_LIBRARY";
      props: { onBookSelect: (book: OpenLibraryImportBookDetails) => void };
    }
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
