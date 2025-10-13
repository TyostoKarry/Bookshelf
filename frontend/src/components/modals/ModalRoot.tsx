import { type FC } from "react";
import { CreateBookshelfModal } from "./CreateBookshelfModal";
import { EnterIdModal } from "./EnterIdModal";
import { EnterTokenModal } from "./EnterTokenModal";
import { ShowTokenModal } from "./ShowTokenModal";
import { type ModalState } from "../../contexts/ModalContext";
import { useModal } from "../../hooks/useModal";

interface ModalRootProps {
  modalState: ModalState;
}

export const ModalRoot: FC<ModalRootProps> = ({ modalState }) => {
  const { closeModal } = useModal();

  switch (modalState.modalType) {
    case "CREATE_BOOKSHELF":
      return <CreateBookshelfModal />;
    case "TOKEN":
      return (
        <ShowTokenModal token={modalState.props.token} onClose={closeModal} />
      );
    case "ENTER_TOKEN":
      return <EnterTokenModal />;
    case "ENTER_ID":
      return <EnterIdModal />;
    case null:
      return null;
    default:
      return null;
  }
};
