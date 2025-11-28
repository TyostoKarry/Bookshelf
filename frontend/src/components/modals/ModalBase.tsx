import { type FC, type ReactNode } from "react";
import { useModal } from "../../hooks/useModal";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface ModalBaseProps {
  children: ReactNode;
}

export const ModalBase: FC<ModalBaseProps> = ({ children }) => {
  const { modalState, closeModal } = useModal();

  return (
    <Dialog
      open={modalState.modalType !== null}
      onOpenChange={() => closeModal()}
    >
      <DialogContent className="rounded-xl bg-card text-foreground shadow-2xl w-full max-w-lg">
        {children}
      </DialogContent>
    </Dialog>
  );
};
