import { useState, type FC } from "react";
import { ModalBase } from "./ModalBase";
import { useLanguage } from "../../hooks/useLanguage";
import { useModal } from "../../hooks/useModal";
import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ConfirmationModalProps {
  title: string;
  message: string;
  confirmLabel: string;
  confirmColor?: "success" | "danger";
  onConfirm: () => Promise<void> | void;
}

export const ConfirmationModal: FC<ConfirmationModalProps> = ({
  title,
  message,
  onConfirm,
  confirmLabel,
  confirmColor = "success",
}) => {
  const { t } = useLanguage();
  const { closeModal } = useModal();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirmClick = async () => {
    try {
      setIsProcessing(true);
      await onConfirm();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ModalBase>
      <DialogHeader>
        <DialogTitle className="text-center text-lg text-foreground text-shadow-md">
          {title}
        </DialogTitle>
        <DialogDescription className="text-center text-muted-foreground">
          {message}
        </DialogDescription>
      </DialogHeader>
      <div className="flex justify-around space-x-4">
        <Button
          type="button"
          variant="outline"
          className="hover:cursor-pointer"
          onClick={closeModal}
        >
          {t("button.cancel")}
        </Button>
        <Button
          type="button"
          variant={confirmColor === "danger" ? "destructive" : "default"}
          className="hover:cursor-pointer"
          onClick={handleConfirmClick}
          disabled={isProcessing}
        >
          {confirmLabel}
        </Button>
      </div>
    </ModalBase>
  );
};
