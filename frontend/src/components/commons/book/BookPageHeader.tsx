import { type FC } from "react";
import { Meta } from "./Meta";
import { useLanguage } from "../../../hooks/useLanguage";
import type { Book } from "../../../types/book";

interface BookPageHeaderProps {
  book: Partial<Book>;
}

export const BookPageHeader: FC<BookPageHeaderProps> = ({ book }) => {
  const { t } = useLanguage();

  return (
    <header className="flex flex-col md:flex-row md:items-stretch gap-8 mb-10">
      <figure className="flex-shrink-0 self-start">
        {book.coverUrl ? (
          <img
            src={book.coverUrl}
            alt={book.title}
            className="w-48 md:w-56 aspect-[2/3] rounded-lg object-fill"
          />
        ) : (
          <div className="w-48 md:w-56 aspect-[2/3] rounded-lg bg-gray-100 flex flex-col items-center justify-center text-gray-400">
            <span className="text-8xl pb-4">
              {t("common.placeholderQuestionMark")}
            </span>
            <span className="text-2xl">{t("common.placeholderNoCover")}</span>
            <span className="text-2xl">{t("common.placeholderAvailable")}</span>
          </div>
        )}
        <figcaption className="sr-only">
          {`${t("common.coverImageFor")}: title: ${book.title || t("common.coverNotAvailable")}`}
        </figcaption>
      </figure>
      <section className="flex-1 flex flex-col justify-between">
        <h1 className="text-3xl font-bold text-gray-900 leading-tight">
          {book.title}
        </h1>
        <h2 className="text-xl text-gray-700 mb-4">{book.author}</h2>
        <h3 className="text-sm font-medium text-gray-600 mb-1">
          {t("bookPage.description")}:
        </h3>
        <p
          className={`${book.description ? "text-gray-800" : "text-gray-500"} leading-relaxed flex-grow`}
        >
          {book.description || t("bookPage.noDescription")}
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-y-2 mt-6 text-sm">
          <Meta label={t("bookPage.genre")} value={book.genre} />
          <Meta label={t("bookPage.language")} value={book.language} />
          <Meta
            label={t("bookPage.pages")}
            value={`${book.pages?.toString()} ${t("bookPage.pagesLowerCase")}`}
          />
          <Meta label={t("bookPage.publisher")} value={book.publisher} />
          <Meta label={t("bookPage.published")} value={book.publishedDate} />
          <Meta label={t("bookPage.isbn13")} value={book.isbn13} />
        </div>
      </section>
    </header>
  );
};
