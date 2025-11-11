import { type FC } from "react";
import { ConfirmationModal } from "./Confirmation";
import { CreateBookshelfModal } from "./CreateBookshelfModal";
import { EnterPublicIdModal } from "./EnterPublicIdModal";
import { EnterTokenModal } from "./EnterTokenModal";
import { ShowTokenModal } from "./ShowTokenModal";
import { type ModalState } from "../../contexts/ModalContext";

interface ModalRootProps {
  modalState: ModalState;
}

export const ModalRoot: FC<ModalRootProps> = ({ modalState }) => {
  switch (modalState.modalType) {
    case "CREATE_BOOKSHELF":
      return <CreateBookshelfModal />;
    case "TOKEN":
      return <ShowTokenModal token={modalState.props.token} />;
    case "ENTER_TOKEN":
      return <EnterTokenModal />;
    case "ENTER_ID":
      return <EnterPublicIdModal />;
    case "CONFIRMATION":
      return (
        <ConfirmationModal
          title={modalState.props.title}
          message={modalState.props.message}
          confirmLabel={modalState.props.confirmLabel}
          confirmColor={modalState.props.confirmColor}
          onConfirm={modalState.props.onConfirm}
        />
      );
    case null:
      return null;
    default:
      return null;
  }
};
