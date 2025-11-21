import { type FC } from "react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { CoverImage } from "./CoverImage";
import { useLanguage } from "../../../hooks/useLanguage";
import type { Book } from "../../../types/book";
import type { BookPageMode } from "../../../types/book-page-mode";
import type { BookForm } from "../../../validation/bookFormSchema";
import { FieldErrorMessage } from "../FieldErrorMessage";

interface BookPageHeaderProps {
  book: Partial<Book>;
  mode: BookPageMode;
  register: UseFormRegister<BookForm>;
  errors: FieldErrors<BookForm>;
}

export const BookPageHeader: FC<BookPageHeaderProps> = ({
  book,
  mode,
  register,
  errors,
}) => {
  const { t } = useLanguage();

  return (
    <header className="flex flex-row items-stretch gap-8 mb-10">
      <div className="flex flex-col">
        <CoverImage coverUrl={book.coverUrl} title={book.title} width="small" />
        {mode !== "view" && (
          <div className="flex flex-col">
            <input
              type="text"
              className={`mt-2 text-sm text-gray-700 border ${errors.coverUrl ? "border-red-500" : "border-gray-300"} rounded-md p-2`}
              placeholder={t("placeholders.enterCoverImageUrl")}
              {...register("coverUrl")}
            />
            <FieldErrorMessage
              message={errors.coverUrl?.message}
              align="left"
            />
          </div>
        )}
      </div>
      <section className="flex-1 flex flex-col">
        <div className="flex flex-col mb-2">
          {mode === "view" ? (
            <h1 className="text-3xl font-bold text-gray-900 leading-tight">
              {book.title}
            </h1>
          ) : (
            <input
              type="text"
              className={`text-3xl font-bold text-gray-900 leading-tight border ${errors.title ? "border-red-500" : "border-gray-300"} rounded-md p-2`}
              placeholder={t("placeholders.enterTitle")}
              {...register("title")}
            />
          )}
          {mode !== "view" && (
            <FieldErrorMessage message={errors.title?.message} />
          )}
        </div>
        <div className="flex flex-col mb-4">
          {mode === "view" ? (
            <h2 className="text-xl text-gray-700">{book.author}</h2>
          ) : (
            <input
              type="text"
              className={`text-xl text-gray-700 border ${errors.author ? "border-red-500" : "border-gray-300"} rounded-md p-2`}
              placeholder={t("placeholders.enterAuthorName")}
              {...register("author")}
            />
          )}
          {mode !== "view" && (
            <FieldErrorMessage message={errors.author?.message} />
          )}
        </div>
        <div className="flex flex-col flex-grow">
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
              className={`w-full h-full border ${errors.description ? "border-red-500" : "border-gray-300"} rounded-md p-2 text-sm text-gray-800 resize-none`}
              placeholder={t("placeholders.enterDescription")}
              {...register("description")}
            />
          )}
          {mode !== "view" && (
            <FieldErrorMessage message={errors.description?.message} />
          )}
        </div>
      </section>
    </header>
  );
};
