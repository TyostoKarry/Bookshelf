import { type FC } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
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
}) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { openModal } = useModal();

  const handleCopyPublicId = async () => {
    try {
      await navigator.clipboard.writeText(bookshelf.publicId);
      toast.success(t("toast.publicIdCopied"));
    } catch (err) {
      console.error("Failed to copy public ID to clipboard:", err);
      toast.error(t("toast.publicIdCopyFailed"));
    }
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
              className="rounded hover:bg-muted/60 hover:cursor-pointer active:bg-muted"
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
              variant="outline"
              className="text-muted-foreground hover:cursor-pointer"
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
            >
              {t("button.addFromOpenLibrary")}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
