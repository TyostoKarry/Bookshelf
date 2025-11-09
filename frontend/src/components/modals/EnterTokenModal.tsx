import { type FC, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getBookshelfByToken } from "../../api/bookshelves";
import { useLanguage } from "../../hooks/useLanguage";
import { useModal } from "../../hooks/useModal";
import { useMyBookshelf } from "../../hooks/useMyBookshelf";
import { Button } from "../commons/Button";

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

  const handleSubmit = async () => {
    const trimmedToken = token.trim();
    if (!trimmedToken) return;

    try {
      const bookshelf = await getBookshelfByToken(trimmedToken);
      if (bookshelf) {
        setEditToken(trimmedToken);
        toast.success(t("toast.bookshelfLoadedSuccessfully"));
        if (rememberToken) {
          localStorage.setItem("editToken", trimmedToken);
          toast.success(t("toast.tokenStored"));
        }
        closeModal();
        navigate("/my/bookshelf");
      } else {
        toast.error(t("toast.invalidTokenOrBookshelfNotFound"));
      }
    } catch (error) {
      console.error("Error fetching bookshelf by token:", error);
      toast.error(`${error}`);
      return;
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md text-center">
        <h2 className="text-xl font-semibold text-text text-shadow-sm mb-4">
          {t("modal.enterEditToken")}
        </h2>
        <input
          ref={inputRef}
          type="text"
          placeholder={t("modal.pasteTokenHere")}
          className="w-full p-2 border border-gray-300 rounded mb-4"
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />
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
            className="text-sm text-gray-800 text-shadow-sm select-none cursor-pointer"
          >
            {t("modal.rememberToken")}
          </label>
        </div>
        <div className="flex justify-end space-x-2">
          <Button
            label={t("button.cancel")}
            onClick={() => closeModal()}
            color="danger"
          />
          <Button
            label={t("button.open")}
            onClick={() => handleSubmit()}
            disabled={!token.trim()}
          />
        </div>
      </div>
    </div>
  );
};
