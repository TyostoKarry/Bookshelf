import { useState, type FC } from "react";
import { ModalBase } from "./ModalBase";
import { useLanguage } from "../../hooks/useLanguage";
import { useModal } from "../../hooks/useModal";
import { Button } from "../commons/Button";

interface ConfirmationModalProps {
  title: string;
  message: string;
  confirmLabel: string;
  confirmColor?: "success" | "danger" | "neutral";
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
      <h2 className="text-xl font-semibold text-text text-shadow-sm mb-4">
        {title}
      </h2>
      <p className="text-gray-800 text-sm leading-relaxed mb-5 px-3">
        {message}
      </p>
      <div className="flex justify-around space-x-4">
        <Button
          label={t("button.cancel")}
          onClick={closeModal}
          color="neutral"
        />
        <Button
          label={confirmLabel}
          onClick={handleConfirmClick}
          disabled={isProcessing}
          color={confirmColor}
        />
      </div>
    </ModalBase>
  );
};
