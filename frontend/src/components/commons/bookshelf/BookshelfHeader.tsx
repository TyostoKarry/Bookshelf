import { type FC } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { deleteBookshelf } from "../../../api/bookshelves";
import CopyIcon from "../../../assets/icons/copy.svg?react";
import { useLanguage } from "../../../hooks/useLanguage";
import { useModal } from "../../../hooks/useModal";
import type { Bookshelf } from "../../../types/bookshelf";
import { mergeOpenLibraryBook } from "../../../utils/mergeOpenLibraryBook";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BookshelfHeaderProps {
  bookshelf: Bookshelf;
  canEdit: boolean;
  editToken?: string | null;
  clearBookshelf?: () => void;
}

export const BookshelfHeader: FC<BookshelfHeaderProps> = ({
  bookshelf,
  canEdit,
  editToken,
  clearBookshelf,
}) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { openModal, closeModal } = useModal();

  const handleCopyPublicId = async () => {
    try {
      await navigator.clipboard.writeText(bookshelf.publicId);
      toast.success(t("toast.publicIdCopied"));
    } catch (err) {
      console.error("Failed to copy public ID to clipboard:", err);
      toast.error(t("toast.publicIdCopyFailed"));
    }
  };

  const handleDeleteBookshelf = () => {
    openModal("CONFIRMATION", {
      title: t("modal.confirmationDeleteBookshelfTitle"),
      message: t("modal.confirmationDeleteBookshelfMessage"),
      confirmLabel: t("button.delete"),
      confirmColor: "danger",
      onConfirm: async () => {
        if (!editToken || !clearBookshelf) {
          toast.error(t("toast.errorOccurredWhileDeletingBookshelf"));
          closeModal();
          return;
        }
        try {
          await deleteBookshelf(bookshelf.publicId, editToken);
          toast.success(t("toast.bookshelfDeletedSuccessfully"));
          clearBookshelf();
          closeModal();
          navigate("/");
        } catch (error) {
          console.error(error);
          toast.error(t("toast.failedToDeleteBookshelf"));
          closeModal();
        }
      },
    });
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="text-center sm:text-left max-w-[70%]">
        <CardTitle className="text-2xl font-bold text-foreground">
          {bookshelf.name}
        </CardTitle>
        {bookshelf.description && (
          <p className="text-sm text-muted-foreground mt-1">
            {bookshelf.description}
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2 items-center text-sm text-muted-foreground">
            <p>
              Public ID:{" "}
              <span className="font-mono bg-muted px-2 py-1 rounded select-all">
                {bookshelf.publicId}
              </span>
            </p>
            <button
              onClick={handleCopyPublicId}
              className="rounded hover:bg-gray-200 hover:cursor-pointer active:bg-gray-300"
              title={t("button.copyPublicIdToClipboard")}
            >
              <CopyIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
        {canEdit && (
          <div className="flex flex-wrap gap-3">
            <Button
              variant="default"
              className="bg-primary text-primary-foreground hover:bg-primary/90 hover:cursor-pointer"
              onClick={() => {
                navigate("/books/new");
              }}
            >
              {t("button.addBook")}
            </Button>
            <Button
              variant="secondary"
              className="bg-muted text-foreground hover:bg-muted/70 hover:cursor-pointer"
              onClick={() =>
                openModal("SEARCH_OPEN_LIBRARY", {
                  onBookSelect: (openLibBook) => {
                    const newBook = mergeOpenLibraryBook({}, openLibBook);
                    navigate(`/books/new`, {
                      state: { book: newBook },
                    });
                  },
                })
              }
              color="neutral"
            >
              {t("button.addFromOpenLibrary")}
            </Button>
            <Button
              variant="destructive"
              className="bg-rose-500 hover:bg-rose-600 text-white hover:cursor-pointer"
              onClick={handleDeleteBookshelf}
            >
              {t("button.deleteBookshelf")}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
