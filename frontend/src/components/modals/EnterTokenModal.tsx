import { type FC, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ModalBase } from "./ModalBase";
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
      <h2 className="text-xl font-semibold text-foreground text-shadow-sm mb-4">
        {t("modal.enterEditToken")}
      </h2>
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          placeholder={t("modal.pasteTokenHere")}
          className="w-full p-2 border border-gray-300 rounded mb-4"
          value={token}
          onChange={(event) => setToken(event.target.value)}
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
            className="text-sm text-foreground text-shadow-sm select-none cursor-pointer"
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
            type="submit"
            disabled={!token.trim()}
          />
        </div>
      </form>
    </ModalBase>
  );
};
