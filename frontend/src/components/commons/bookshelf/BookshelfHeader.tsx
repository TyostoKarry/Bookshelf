import { CopyIcon } from "lucide-react";
import { type FC } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
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
          <div className="flex gap-1 items-center text-sm text-muted-foreground">
            <p>
              Public ID:{" "}
              <span className="font-mono bg-muted px-2 py-1 rounded select-all">
                {bookshelf.publicId}
              </span>
            </p>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={handleCopyPublicId}
              className="hover:cursor-pointer rounded hover:bg-foreground/20 active:bg-foreground/10"
              title={t("button.copyPublicIdToClipboard")}
            >
              <CopyIcon className="w-4 h-4 text-muted-foreground" />
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap justify-between gap-2">
          {canEdit ? (
            <div className="flex gap-3">
              <Button
                type="button"
                variant="default"
                className="bg-primary text-primary-foreground hover:bg-primary/90 hover:cursor-pointer"
                onClick={() => {
                  navigate("/books/new");
                }}
              >
                {t("button.addBook")}
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="hover:cursor-pointer"
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
          ) : (
            <span />
          )}
          <Button
            type="button"
            variant="outline"
            className="hover:cursor-pointer"
            onClick={() =>
              openModal("EXPORT_BOOKS", {
                bookshelfPublicId: bookshelf.publicId,
              })
            }
          >
            {t("button.exportBooks")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
