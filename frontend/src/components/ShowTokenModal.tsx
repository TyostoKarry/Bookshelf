import { type FC } from "react";
import { toast } from "sonner";
import { Button } from "./Button";
import CopyIcon from "../assets/icons/copy.svg?react";
import { useLanguage } from "../hooks/useLanguage";

interface ShowTokenModalProps {
  token: string;
  onClose: () => void;
}

export const ShowTokenModal: FC<ShowTokenModalProps> = ({ token, onClose }) => {
  const { t } = useLanguage();

  const handleCopyToken = async () => {
    try {
      await navigator.clipboard.writeText(token);
      toast.success(t("toast.tokenCopied"));
    } catch (err) {
      console.error("Failed to copy token to clipboard:", err);
      toast.error(t("toast.tokenCopyFailed"));
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md text-center">
        <h2 className="text-lg text-text text-shadow-md mb-4">
          {t("modal.newBookshelfCreated")}
        </h2>
        <p className="text-gray-800 text-shadow-sm mb-4">
          {t("modal.saveThisToken")}
        </p>
        <div className="flex flex-row justify-between bg-gray-100 p-4 rounded mb-4 break-all">
          <span>{token}</span>
          <button
            onClick={handleCopyToken}
            className="ml-2 p-1 rounded hover:bg-gray-200 active:bg-gray-300"
            title={t("button.copyTokenToClipboard")}
          >
            <CopyIcon className="w-5 h-5" />
          </button>
        </div>
        <Button label={t("button.gotIt")} onClick={() => onClose()} />
      </div>
    </div>
  );
};
