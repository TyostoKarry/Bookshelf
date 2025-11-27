import { type FC, useState } from "react";
import { toast } from "sonner";
import { ModalBase } from "./ModalBase";
import CopyIcon from "../../assets/icons/copy.svg?react";
import { useLanguage } from "../../hooks/useLanguage";
import { useModal } from "../../hooks/useModal";
import { Button } from "../commons/Button";

interface ShowTokenModalProps {
  token: string;
}

export const ShowTokenModal: FC<ShowTokenModalProps> = ({ token }) => {
  const { t } = useLanguage();
  const { closeModal } = useModal();
  const [rememberToken, setRememberToken] = useState(true);

  const handleCopyToken = async () => {
    try {
      await navigator.clipboard.writeText(token);
      toast.success(t("toast.tokenCopied"));
    } catch (err) {
      console.error("Failed to copy token to clipboard:", err);
      toast.error(t("toast.tokenCopyFailed"));
    }
  };

  const handleGotIt = () => {
    if (rememberToken) {
      localStorage.setItem("editToken", token);
      toast.success(t("toast.tokenStored"));
    }
    closeModal();
  };

  return (
    <ModalBase closeOnOutsideClick={false}>
      <h2 className="text-xl font-semibold text-text text-shadow-sm mb-4">
        {t("modal.newBookshelfCreated")}
      </h2>
      <div className="text-foreground text-sm leading-relaxed mb-5 px-3">
        <p className="font-medium">{t("modal.saveTokenTitle")}</p>
        <p>{t("modal.saveTokenPurpose")}</p>
        <p className="mt-1">{t("modal.saveTokenInstruction")}</p>
      </div>
      <div className="flex flex-row justify-between bg-gray-100 p-4 rounded mb-4 break-all">
        <span>{token}</span>
        <button
          onClick={handleCopyToken}
          className="ml-2 p-1 rounded hover:bg-gray-200 hover:cursor-pointer active:bg-gray-300"
          title={t("button.copyTokenToClipboard")}
        >
          <CopyIcon className="w-5 h-5" />
        </button>
      </div>
      <div className="flex items-center justify-center mb-4 space-x-2">
        <input
          id="rememberToken"
          type="checkbox"
          checked={rememberToken}
          onChange={() => setRememberToken(!rememberToken)}
          className="cursor-pointer"
        />
        <label
          htmlFor="rememberToken"
          className="text-sm text-foreground text-shadow-sm select-none cursor-pointer"
        >
          {t("modal.rememberToken")}
        </label>
      </div>
      <Button label={t("button.gotIt")} onClick={handleGotIt} />
    </ModalBase>
  );
};
