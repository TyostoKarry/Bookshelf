import { type Dispatch, type FC, type SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { deleteBookFromBookshelf } from "../../../api/bookshelves";
import { useLanguage } from "../../../hooks/useLanguage";
import { useModal } from "../../../hooks/useModal";
import type { Book } from "../../../types/book";
import type { BookPageMode } from "../../../types/book-page-mode";
import { mergeOpenLibraryBook } from "../../../utils/mergeOpenLibraryBook";
import { Button } from "../Button";

interface BookPageActionsProps {
  book: Partial<Book>;
  mode: BookPageMode;
  canEdit: boolean | null;
  bookId?: string;
  editToken: string | null;
  setDraftBook?: Dispatch<SetStateAction<Partial<Book>>>;
  onSave: () => void;
  refreshBookshelf: () => Promise<void>;
  fieldErrors: { [key in keyof Book]?: boolean };
}

export const BookPageActions: FC<BookPageActionsProps> = ({
  book,
  mode,
  canEdit,
  bookId,
  editToken,
  setDraftBook,
  onSave,
  refreshBookshelf,
  fieldErrors,
}) => {
  const { t } = useLanguage();
  const { openModal, closeModal } = useModal();
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

  const handleDelete = () => {
    openModal("CONFIRMATION", {
      title: t("modal.confirmationDeleteBookTitle"),
      message: t("modal.confirmationDeleteBookMessage"),
      confirmLabel: t("button.delete"),
      confirmColor: "danger",
      onConfirm: async () => {
        if (!book.bookshelfPublicId || !editToken || !bookId) {
          toast.error(t("toast.errorOccurredWhileDeletingBook"));
          closeModal();
          return;
        }
        try {
          await deleteBookFromBookshelf(
            book.bookshelfPublicId,
            editToken,
            Number(bookId),
          );
          toast.success(t("toast.bookDeletedSuccessfully"));
          await refreshBookshelf();
          closeModal();
          navigate("/my/bookshelf");
        } catch (error) {
          console.error(error);
          toast.error(t("toast.failedToDeleteBook"));
          closeModal();
        }
      },
    });
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
            onClick={handleDelete}
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
            <div className="flex gap-2">
              <Button
                label={t("button.searchFromOpenLibrary")}
                onClick={() => {
                  if (!setDraftBook) return;
                  openModal("SEARCH_OPEN_LIBRARY", {
                    onBookSelect: (openLibBook) => {
                      setDraftBook((prev) =>
                        mergeOpenLibraryBook(prev, openLibBook),
                      );
                    },
                  });
                }}
                color="neutral"
              />
              <Button
                label={t("button.save")}
                onClick={onSave}
                disabled={Object.values(fieldErrors).some(Boolean)}
              />
            </div>
          )}
        </div>
      )}
      {mode === "create" && (
        <div className="flex gap-2">
          <Button
            label={t("button.searchFromOpenLibrary")}
            onClick={() => {
              if (!setDraftBook) return;
              openModal("SEARCH_OPEN_LIBRARY", {
                onBookSelect: (openLibBook) => {
                  setDraftBook((prev) =>
                    mergeOpenLibraryBook(prev, openLibBook),
                  );
                },
              });
            }}
            color="neutral"
          />
          <Button
            label={t("button.create")}
            onClick={onSave}
            disabled={Object.values(fieldErrors).some(Boolean)}
          />
        </div>
      )}
    </footer>
  );
};
