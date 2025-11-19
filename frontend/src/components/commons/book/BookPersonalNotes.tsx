import { type FC } from "react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { SectionTitle } from "./SectionTitle";
import { useLanguage } from "../../../hooks/useLanguage";
import type { Book } from "../../../types/book";
import type { BookPageMode } from "../../../types/book-page-mode";
import type { BookForm } from "../../../validation/bookFormSchema";
import { FieldErrorMessage } from "../FieldErrorMessage";

interface BookPersonalNotesProps {
  book: Partial<Book>;
  mode: BookPageMode;
  register: UseFormRegister<BookForm>;
  errors: FieldErrors<BookForm>;
}

export const BookPersonalNotes: FC<BookPersonalNotesProps> = ({
  book,
  mode,
  register,
  errors,
}) => {
  const { t } = useLanguage();

  return (
    <section className="flex flex-col">
      <div>
        <SectionTitle>{t("bookPage.personalNotes")}</SectionTitle>
        {mode === "view" ? (
          book.notes ? (
            <p className="text-gray-800 leading-relaxed min-h-[6rem] pt-3">
              {book.notes}
            </p>
          ) : (
            <p className="italic text-gray-400 min-h-[6rem] flex items-center">
              {t("bookPage.noNotes")}
            </p>
          )
        ) : (
          <textarea
            className={`w-full min-h-[12rem] border ${errors.notes ? "border-red-500" : "border-gray-300"} rounded-md p-2 mt-3 resize-y`}
            placeholder={t("placeholders.enterPersonalNotes")}
            {...register("notes")}
          />
        )}
      </div>
      {mode !== "view" && (
        <FieldErrorMessage message={errors.notes?.message} align="right" />
      )}
    </section>
  );
};
