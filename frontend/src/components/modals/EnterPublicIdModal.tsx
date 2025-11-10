import { type FC, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ModalBase } from "./ModalBase";
import { useLanguage } from "../../hooks/useLanguage";
import { useModal } from "../../hooks/useModal";
import { Button } from "../commons/Button";

const isValidPublicId = (value: string) =>
  /^[A-Za-z0-9_-]{10,30}$/.test(value.trim());

export const EnterPublicIdModal: FC = () => {
  const { t } = useLanguage();
  const { closeModal } = useModal();
  const [publicId, setPublicId] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async () => {
    const trimmedPublicId = publicId.trim();
    if (!isValidPublicId(trimmedPublicId)) {
      toast.error(t("toast.invalidBookshelfPublicId"));
      return;
    }
    if (trimmedPublicId) {
      navigate(`/bookshelves/${trimmedPublicId}`);
      closeModal();
    }
  };

  return (
    <ModalBase>
      <h2 className="text-xl font-semibold text-text text-shadow-sm mb-4">
        {t("modal.enterPublicIdToVisit")}
      </h2>
      <input
        ref={inputRef}
        placeholder={t("modal.pastePublicIdHere")}
        className="w-full p-2 border border-gray-300 rounded mb-4"
        value={publicId}
        onChange={(e) => setPublicId(e.target.value)}
      />
      <div className="flex justify-end space-x-2">
        <Button
          label={t("button.cancel")}
          onClick={() => closeModal()}
          color="danger"
        />
        <Button
          label={t("button.open")}
          onClick={() => handleSubmit()}
          disabled={!publicId.trim()}
        />
      </div>
    </ModalBase>
  );
};
