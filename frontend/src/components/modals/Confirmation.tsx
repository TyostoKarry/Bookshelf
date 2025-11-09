import { useState, type FC } from "react";
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
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md text-center">
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
      </div>
    </div>
  );
};
