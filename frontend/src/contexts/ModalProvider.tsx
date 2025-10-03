import { type ReactNode, useState } from "react";
import {
  ModalContext,
  type ModalContextValue,
  type ModalState,
} from "./ModalContext";

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [modalState, setModalState] = useState<ModalState>({
    modalType: null,
    props: {},
  });

  const openModal: ModalContextValue["openModal"] = (type, props) => {
    setModalState({ modalType: type, props } as ModalState);
  };

  const closeModal = () => {
    setModalState({ modalType: null, props: {} });
  };

  return (
    <ModalContext.Provider value={{ modalState, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};
