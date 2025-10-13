import { type FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useLanguage } from "../../hooks/useLanguage";
import { useModal } from "../../hooks/useModal";
import { Button } from "../commons/Button";

const isValidNumericId = (value: string) => /^[1-9]\d*$/.test(value.trim());

export const EnterIdModal: FC = () => {
  const { t } = useLanguage();
  const { closeModal } = useModal();
  const [id, setId] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const trimmedId = id.trim();
    if (!isValidNumericId(trimmedId)) {
      toast.error(t("toast.invalidBookshelfId"));
      return;
    }
    if (trimmedId) {
      navigate(`/bookshelves/${trimmedId}`);
      closeModal();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md text-center">
        <h2 className="text-xl font-semibold text-text text-shadow-sm mb-4">
          {t("modal.enterIdToVisit")}
        </h2>
        <input
          type="number"
          min={1}
          placeholder={t("modal.pasteIdHere")}
          className="w-full p-2 border border-gray-300 rounded mb-4"
          value={id}
          onChange={(e) => setId(e.target.value)}
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
            disabled={!id.trim()}
          />
        </div>
      </div>
    </div>
  );
};
