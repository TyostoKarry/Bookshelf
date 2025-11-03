import { type FC } from "react";
import { toast } from "sonner";
import { BookCard } from "./BookCard";
import { Button } from "./Button";
import CopyIcon from "../../assets/icons/copy.svg?react";
import { useLanguage } from "../../hooks/useLanguage";
import type { Book } from "../../types/book";
import type { Bookshelf } from "../../types/bookshelf";

interface BookshelfViewProps {
  bookshelf: Bookshelf;
  books: Book[];
  canEdit: boolean;
}

export const BookshelfView: FC<BookshelfViewProps> = ({
  canEdit,
  bookshelf,
  books,
}) => {
  const { t } = useLanguage();

  const handleCopyToken = async () => {
    try {
      await navigator.clipboard.writeText(bookshelf.publicId);
      toast.success(t("toast.publicIdCopied"));
    } catch (err) {
      console.error("Failed to copy token to clipboard:", err);
      toast.error(t("toast.publicIdCopyFailed"));
    }
  };

  return (
    <div className="w-full px-10">
      <div className="max-w-3xl mx-auto py-10 px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="text-center sm:text-left max-w-[70%]">
            <h1 className="text-3xl font-bold text-gray-900">
              {bookshelf.name}
            </h1>
            <div className="flex flex-row">
              <p className="text-sm text-gray-700 mt-1">
                Public ID:{" "}
                <span className="font-mono">{bookshelf.publicId}</span>
              </p>
              <button
                onClick={handleCopyToken}
                className="ml-2 p-1 rounded hover:bg-gray-200 hover:cursor-pointer active:bg-gray-300"
                title={t("button.copyTokenToClipboard")}
              >
                <CopyIcon className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-700 mt-1">{bookshelf.description}</p>
          </div>
          {canEdit && (
            <div className="flex flex-col gap-3">
              <Button
                label={t("button.addBook")}
                onClick={() => {
                  /* Handle add book action */
                }}
              />
              <Button
                label={t("button.deleteBookshelf")}
                onClick={() => {
                  /* Handle delete bookshelf action */
                }}
                color="danger"
              />
            </div>
          )}
        </div>
        <hr className="border-gray-300 mb-4" />
      </div>
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          {t("bookshelfView.books")}
        </h2>
        {books.length === 0 ? (
          <p>{t("bookshelfView.noBooks")}</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 xl:gap-8">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
