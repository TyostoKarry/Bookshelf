import { type FC, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ModalBase } from "./ModalBase";
import { useLanguage } from "../../hooks/useLanguage";
import { useModal } from "../../hooks/useModal";
import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const isValidPublicId = (value: string) =>
  /^[A-Za-z0-9_-]{21}$/.test(value.trim());

export const EnterPublicIdModal: FC = () => {
  const { t } = useLanguage();
  const { closeModal } = useModal();
  const [publicId, setPublicId] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const trimmedPublicId = publicId.trim();
    if (!isValidPublicId(trimmedPublicId)) {
      toast.error(t("toast.invalidBookshelfPublicId"));
      return;
    }
    if (trimmedPublicId) {
      navigate(`/bookshelves/${trimmedPublicId}`);
      closeModal();
    }
  }

  return (
    <ModalBase>
      <DialogHeader>
        <DialogTitle className="text-center text-lg text-foreground">
          {t("modal.enterPublicIdToVisit")}
        </DialogTitle>
        <DialogDescription className="text-center text-muted-foreground">
          {t("modal.enterPublicIdToVisitDescriptionStart")} <br />
          {t("modal.enterPublicIdToVisitDescriptionEnd")}
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit}>
        <Input
          ref={inputRef}
          type="text"
          placeholder={t("modal.pastePublicIdHere")}
          className="w-full mb-4"
          value={publicId}
          onChange={(event) => setPublicId(event.target.value)}
        />
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
            disabled={!publicId.trim()}
          >
            {t("button.open")}
          </Button>
        </div>
      </form>
    </ModalBase>
  );
};
