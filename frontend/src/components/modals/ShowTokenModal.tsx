import { CopyIcon } from "lucide-react";
import { type FC, useState } from "react";
import { toast } from "sonner";
import { ModalBase } from "./ModalBase";
import { useLanguage } from "../../hooks/useLanguage";
import { useModal } from "../../hooks/useModal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

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
    <ModalBase>
      <DialogHeader>
        <DialogTitle className="text-center text-lg text-foreground text-shadow-md">
          {t("modal.newBookshelfCreated")}
        </DialogTitle>
        <DialogDescription className="text-center text-muted-foreground">
          {t("modal.saveTokenTitle")} <br /> {t("modal.saveTokenPurpose")}{" "}
          <br /> {t("modal.saveTokenInstruction")}
        </DialogDescription>
      </DialogHeader>
      <Card className="flex flex-row justify-between bg-gray-100 p-4 rounded mb-4 break-all">
        <span className="font-mono cursor-text select-all text-sm text-foreground">
          {token}
        </span>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={handleCopyToken}
          className="hover:cursor-pointer rounded hover:bg-foreground/20 active:bg-foreground/10"
          title={t("button.copyTokenToClipboard")}
        >
          <CopyIcon className="w-4 h-4 text-muted-foreground" />
        </Button>
      </Card>
      <div className="flex items-center justify-center mb-4">
        <Checkbox
          id="rememberToken"
          checked={rememberToken}
          onCheckedChange={(checked) => setRememberToken(!!checked)}
          className="cursor-pointer"
        />
        <Label
          htmlFor="rememberToken"
          className="pl-2 text-sm text-foreground text-shadow-sm select-none cursor-pointer"
        >
          {t("modal.rememberToken")}
        </Label>
      </div>
      <Button
        type="button"
        variant="default"
        className="hover:cursor-pointer"
        onClick={handleGotIt}
      >
        {t("button.gotIt")}
      </Button>
    </ModalBase>
  );
};
