import { type FC, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ModalBase } from "./ModalBase";
import { getBookshelfByToken } from "../../api/bookshelves";
import { useLanguage } from "../../hooks/useLanguage";
import { useModal } from "../../hooks/useModal";
import { useMyBookshelf } from "../../hooks/useMyBookshelf";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const EnterTokenModal: FC = () => {
  const { t } = useLanguage();
  const { closeModal } = useModal();
  const { setEditToken } = useMyBookshelf();
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [rememberToken, setRememberToken] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const trimmedToken = token.trim();
    if (!trimmedToken) return;

    try {
      const bookshelf = await getBookshelfByToken(trimmedToken);
      if (!bookshelf) {
        toast.error(t("toast.invalidTokenOrBookshelfNotFound"));
        return;
      }
      setEditToken(trimmedToken);
      toast.success(t("toast.bookshelfLoadedSuccessfully"));
      if (rememberToken) {
        localStorage.setItem("editToken", trimmedToken);
        toast.success(t("toast.tokenStored"));
      }
      closeModal();
      navigate("/my/bookshelf");
    } catch (error) {
      console.error("Error fetching bookshelf by token:", error);
      toast.error(`${error}`);
    }
  }

  return (
    <ModalBase>
      <DialogHeader>
        <DialogTitle className="text-center text-lg text-foreground">
          {t("modal.enterEditToken")}
        </DialogTitle>
        <DialogDescription className="text-center text-muted-foreground">
          {t("modal.enterEditTokenDescription")}
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit}>
        <Input
          ref={inputRef}
          type="text"
          placeholder={t("modal.pasteTokenHere")}
          className="w-full mb-4"
          value={token}
          onChange={(event) => setToken(event.target.value)}
        />
        <div className="flex items-center justify-center mb-4">
          <Checkbox
            id="rememberToken"
            checked={rememberToken}
            onCheckedChange={(value) => setRememberToken(Boolean(value))}
            className="cursor-pointer"
          />
          <Label
            htmlFor="rememberToken"
            className="pl-2 text-sm text-muted-foreground select-none cursor-pointer"
          >
            {t("modal.rememberToken")}
          </Label>
        </div>
        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            className="hover:cursor-pointer"
            onClick={() => closeModal()}
          >
            {t("button.cancel")}
          </Button>
          <Button
            type="submit"
            variant="default"
            className="hover:cursor-pointer"
            disabled={!token.trim()}
          >
            {t("button.open")}
          </Button>
        </div>
      </form>
    </ModalBase>
  );
};
