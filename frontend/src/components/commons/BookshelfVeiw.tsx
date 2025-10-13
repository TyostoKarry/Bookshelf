import { type FC } from "react";
import { Button } from "./Button";
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
  return (
    <div className="w-full px-10">
      <div className="max-w-3xl mx-auto py-10 px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="text-center sm:text-left max-w-[70%]">
            <h1 className="text-3xl font-bold text-gray-900">
              {bookshelf.name}
            </h1>
            <p className="text-sm text-gray-700 mt-1">
              ID: <span className="font-mono">{bookshelf.id}</span>
            </p>
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
          <ul className="space-y-2">
            {books.map((book) => (
              <li key={book.id} className="border-b py-2">
                <h3 className="font-semibold">{book.title}</h3>
                <p className="text-sm text-gray-600">{book.author}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
