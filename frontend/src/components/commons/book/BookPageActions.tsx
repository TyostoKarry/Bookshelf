import { type FC } from "react";
import type { UseFormReset } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { deleteBookFromBookshelf } from "../../../api/bookshelves";
import { useLanguage } from "../../../hooks/useLanguage";
import { useModal } from "../../../hooks/useModal";
import type { Book } from "../../../types/book";
import type { BookPageMode } from "../../../types/book-page-mode";
import { mergeOpenLibraryBook } from "../../../utils/mergeOpenLibraryBook";
import type { BookForm } from "../../../validation/bookFormSchema";
import { Button } from "@/components/ui/button";

interface BookPageActionsProps {
  book: Partial<Book>;
  mode: BookPageMode;
  canEdit: boolean | null;
  bookId?: string;
  editToken: string | null;
  refreshBookshelf: () => Promise<void>;
  reset: UseFormReset<BookForm>;
  isSubmitting: boolean;
}

export const BookPageActions: FC<BookPageActionsProps> = ({
  book,
  mode,
  canEdit,
  bookId,
  editToken,
  refreshBookshelf,
  reset,
  isSubmitting,
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
          closeModal();
          navigate("/my/bookshelf");
          await refreshBookshelf();
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
          type="button"
          variant="outline"
          className="hover:cursor-pointer"
          onClick={handleNavigateBackToBookshelf}
        >
          {t("button.backToBookshelf")}
        </Button>
      ) : (
        <Button
          type="button"
          variant="outline"
          className="hover:cursor-pointer"
          onClick={
            mode === "edit"
              ? () => navigate(`/books/${bookId}`)
              : handleNavigateBackToBookshelf
          }
        >
          {t("button.cancel")}
        </Button>
      )}
      {canEdit && (
        <div className="flex gap-2">
          <Button
            type="button"
            variant="destructive"
            className="hover:cursor-pointer hover:bg-destructive/80"
            onClick={handleDelete}
          >
            {t("button.delete")}
          </Button>
          {mode === "view" && (
            <Button
              type="button"
              variant="default"
              className="hover:cursor-pointer"
              onClick={() =>
                navigate(`/books/${bookId}/edit`, {
                  state: { book, canEdit },
                })
              }
            >
              {t("button.edit")}
            </Button>
          )}
          {mode === "edit" && (
            <div className="flex gap-2">
              <Button
                type="button"
                variant="secondary"
                className="hover:cursor-pointer"
                onClick={() => {
                  openModal("SEARCH_OPEN_LIBRARY", {
                    onBookSelect: (openLibBook) => {
                      reset((prev) => mergeOpenLibraryBook(prev, openLibBook));
                    },
                  });
                }}
              >
                {t("button.searchFromOpenLibrary")}
              </Button>
              <Button
                type="submit"
                className="hover:cursor-pointer"
                disabled={isSubmitting}
              >
                {t("button.save")}
              </Button>
            </div>
          )}
        </div>
      )}
      {mode === "create" && (
        <div className="flex gap-2">
          <Button
            type="button"
            variant="secondary"
            className="hover:cursor-pointer"
            onClick={() => {
              openModal("SEARCH_OPEN_LIBRARY", {
                onBookSelect: (openLibBook) => {
                  reset((prev) => mergeOpenLibraryBook(prev, openLibBook));
                },
              });
            }}
          >
            {t("button.searchFromOpenLibrary")}
          </Button>
          <Button
            type="submit"
            className="hover:cursor-pointer"
            disabled={isSubmitting}
          >
            {t("button.create")}
          </Button>
        </div>
      )}
    </footer>
  );
};
