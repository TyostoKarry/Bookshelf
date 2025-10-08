import { type FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { createBookshelf } from "../../api/bookshelves";
import { useLanguage } from "../../hooks/useLanguage";
import { useModal } from "../../hooks/useModal";
import { useMyBookshelf } from "../../hooks/useMyBookshelf";
import { Button } from "../commons/Button";

export const CreateBookshelfModal: FC = () => {
  const { t } = useLanguage();
  const { closeModal, openModal } = useModal();
  const { setEditToken } = useMyBookshelf();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [nameTouched, setNameTouched] = useState(false);
  const [nameError, setNameError] = useState(false);

  const handleCreate = async () => {
    try {
      const newBookshelf = await createBookshelf({ name, description });
      if (newBookshelf) {
        setEditToken(newBookshelf.editToken);
        closeModal();
        navigate("/my/bookshelf");
        openModal("TOKEN", { token: newBookshelf.editToken });
      }
    } catch (error) {
      setNameError(true);
      toast.error(
        error instanceof Error ? error.message : t("toast.anErrorOccurred"),
      );
      console.error("Error creating bookshelf:", error);
    }
  };

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };
    document.addEventListener("keydown", handleEscapeKey);
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [closeModal]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md text-center">
        <h2 className="text-center text-lg text-text text-shadow-md mb-4">
          {t("modal.createBookshelf")}
        </h2>
        <div className="mb-4">
          <label className="block text-sm text-gray-800 text-shadow-sm mb-1">
            {t("modal.nameOfBookshelf")}
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => {
              setNameError(false);
              setNameTouched(true);
            }}
            className={`w-full rounded-md  border ${(nameTouched && !name) || nameError ? "border-red-500" : "border-gray-300"} shadow-sm px-3 py-2 text-sm`}
            placeholder={t("modal.namePlaceholder")}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm text-gray-800 text-shadow-sm mb-1">
            {t("modal.descriptionOfBookshelf")}
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-md  border border-gray-300 shadow-sm px-3 py-2 text-sm resize-none"
            placeholder={t("modal.descriptionPlaceholder")}
            rows={3}
          />
        </div>
        <div className="flex justify-end space-x-3">
          <Button
            label={t("button.cancel")}
            onClick={() => closeModal()}
            color="danger"
          />
          <Button
            label={t("button.create")}
            onClick={() => handleCreate()}
            disabled={!name || nameError}
          />
        </div>
      </div>
    </div>
  );
};
