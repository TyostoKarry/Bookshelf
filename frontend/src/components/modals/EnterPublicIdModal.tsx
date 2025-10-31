import { type FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useLanguage } from "../../hooks/useLanguage";
import { useModal } from "../../hooks/useModal";
import { Button } from "../commons/Button";

const isValidPublicId = (value: string) =>
  /^[A-Za-z0-9_-]{10,30}$/.test(value.trim());

export const EnterPublicIdModal: FC = () => {
  const { t } = useLanguage();
  const { closeModal } = useModal();
  const [publicId, setPublicId] = useState("");
  const navigate = useNavigate();

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
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md text-center">
        <h2 className="text-xl font-semibold text-text text-shadow-sm mb-4">
          {t("modal.enterPublicIdToVisit")}
        </h2>
        <input
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
      </div>
    </div>
  );
};
