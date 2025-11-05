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
}

export const BookPageActions: FC<BookPageActionsProps> = ({
  book,
  mode,
  canEdit,
  bookId,
}) => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleNavigateBackToBookshelf = () => {
    if (canEdit) {
      navigate("/my/bookshelf");
      return;
    }
    navigate(`/bookshelves/${book.bookshelfPublicId}`);
  };

  return (
    <footer
      className={`flex ${mode === "view" ? "justify-between" : "justify-end"} gap-2 mt-8 mb-4`}
    >
      {mode === "view" && (
        <Button
          label={t("button.backToBookshelf")}
          onClick={handleNavigateBackToBookshelf}
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
              onClick={() =>
                navigate(`/books/${bookId}`, {
                  state: { book, canEdit },
                })
              }
            />
          )}
        </div>
      )}
    </footer>
  );
};
