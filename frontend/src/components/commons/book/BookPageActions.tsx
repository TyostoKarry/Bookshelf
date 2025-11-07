import { type FC } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../../hooks/useLanguage";
import type { Book } from "../../../types/book";
import type { BookPageMode } from "../../../types/book-page-mode";
import { Button } from "../Button";

interface BookPageActionsProps {
  book: Partial<Book>;
  mode: BookPageMode;
  canEdit: boolean | null;
  bookId?: string;
  onSave: () => void;
  fieldErrors: { [key in keyof Book]?: boolean };
}

export const BookPageActions: FC<BookPageActionsProps> = ({
  book,
  mode,
  canEdit,
  bookId,
  onSave,
  fieldErrors,
}) => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleNavigateBackToBookshelf = () => {
    if (canEdit || mode === "create") {
      navigate("/my/bookshelf");
      return;
    }
    if (book.bookshelfPublicId) {
      navigate(`/bookshelves/${book.bookshelfPublicId}`);
    } else {
      navigate("/");
    }
  };

  return (
    <footer className="flex justify-between gap-2 mt-8 mb-4">
      {mode === "view" ? (
        <Button
          label={t("button.backToBookshelf")}
          onClick={handleNavigateBackToBookshelf}
        />
      ) : (
        <Button
          label={t("button.cancel")}
          color="neutral"
          onClick={
            mode === "edit"
              ? () => navigate(`/books/${bookId}`)
              : handleNavigateBackToBookshelf
          }
        />
      )}
      {canEdit && (
        <div className="flex gap-2">
          <Button
            label={t("button.delete")}
            color="danger"
            onClick={() => {}}
          />
          {mode === "view" && (
            <Button
              label={t("button.edit")}
              onClick={() =>
                navigate(`/books/${bookId}/edit`, {
                  state: { book, canEdit },
                })
              }
            />
          )}
          {mode === "edit" && (
            <Button
              label={t("button.save")}
              onClick={onSave}
              disabled={Object.values(fieldErrors).some(Boolean)}
            />
          )}
        </div>
      )}
      {mode === "create" && (
        <Button
          label={t("button.create")}
          onClick={onSave}
          disabled={Object.values(fieldErrors).some(Boolean)}
        />
      )}
    </footer>
  );
};
