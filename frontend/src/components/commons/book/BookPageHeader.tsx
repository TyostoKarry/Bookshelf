import { type Dispatch, type FC, type SetStateAction } from "react";
import { useLanguage } from "../../../hooks/useLanguage";
import type { Book } from "../../../types/book";
import type { BookPageMode } from "../../../types/book-page-mode";

interface BookPageHeaderProps {
  book: Partial<Book>;
  mode: BookPageMode;
  onChange: (key: keyof Book, value: string | null) => void;
  fieldErrors: { [key in keyof Book]?: boolean };
  setFieldErrors: Dispatch<SetStateAction<{ [key in keyof Book]?: boolean }>>;
}

export const BookPageHeader: FC<BookPageHeaderProps> = ({
  book,
  mode,
  onChange,
  fieldErrors,
  setFieldErrors,
}) => {
  const { t } = useLanguage();

  return (
    <header className="flex flex-row items-stretch gap-8 mb-10">
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
      <section className="flex-1 flex flex-col">
        {mode === "view" ? (
          <h1 className="text-3xl font-bold text-gray-900 leading-tight">
            {book.title}
          </h1>
        ) : (
          <input
            type="text"
            className={`text-3xl font-bold text-gray-900 leading-tight border ${fieldErrors.title ? "border-red-500" : "border-gray-300"} rounded-md p-2 mb-2`}
            value={book.title || ""}
            placeholder={t("placeholders.enterTitle")}
            onChange={(value) => onChange("title", value.target.value)}
            onFocus={() => {
              setFieldErrors((prev) => ({ ...prev, title: false }));
            }}
          />
        )}
        {mode === "view" ? (
          <h2 className="text-xl text-gray-700 mb-4">{book.author}</h2>
        ) : (
          <input
            type="text"
            className={`text-xl text-gray-700 mb-4 border ${fieldErrors.author ? "border-red-500" : "border-gray-300"} rounded-md p-2`}
            value={book.author || ""}
            placeholder={t("placeholders.enterAuthorName")}
            onChange={(value) => onChange("author", value.target.value)}
            onFocus={() =>
              setFieldErrors((prev) => ({ ...prev, author: false }))
            }
          />
        )}
        <h3 className="text-sm font-medium text-gray-600 mb-1">
          {t("bookPage.description")}:
        </h3>
        {mode === "view" ? (
          <p
            className={`${book.description ? "text-gray-800" : "text-gray-500"} leading-relaxed flex-grow`}
          >
            {book.description || t("bookPage.noDescription")}
          </p>
        ) : (
          <textarea
            className={`w-full h-32 border ${fieldErrors.description ? "border-red-500" : "border-gray-300"} rounded-md p-2 text-sm text-gray-800 resize-none`}
            value={book.description || ""}
            placeholder={t("placeholders.enterDescription")}
            onChange={(value) => onChange("description", value.target.value)}
            onFocus={() =>
              setFieldErrors((prev) => ({ ...prev, description: false }))
            }
          />
        )}
      </section>
    </header>
  );
};
