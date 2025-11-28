import { type FC } from "react";
import type { UseFormReturn } from "react-hook-form";
import { SectionTitle } from "./SectionTitle";
import { useLanguage } from "../../../hooks/useLanguage";
import type { Book } from "../../../types/book";
import type { BookPageMode } from "../../../types/book-page-mode";
import type { BookForm } from "../../../validation/bookFormSchema";
import { FieldErrorMessage } from "../FieldErrorMessage";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

interface BookPersonalNotesProps {
  book: Partial<Book>;
  mode: BookPageMode;
  form: UseFormReturn<BookForm>;
}

export const BookPersonalNotes: FC<BookPersonalNotesProps> = ({
  book,
  mode,
  form,
}) => {
  const { t } = useLanguage();
  const {
    control,
    formState: { errors },
  } = form;

  return (
    <section className="flex flex-col">
      <div>
        <SectionTitle>{t("bookPage.personalNotes")}</SectionTitle>
        {mode === "view" ? (
          book.notes ? (
            <p className="text-muted-foreground leading-relaxed min-h-[6rem] pt-3">
              {book.notes}
            </p>
          ) : (
            <p className="italic  text-muted-foreground min-h-[6rem] flex items-center">
              {t("bookPage.noNotes")}
            </p>
          )
        ) : (
          <FormField
            control={control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder={t("placeholders.enterPersonalNotes")}
                    className="mt-3 min-h-[6rem] resize-y hover:bg-accent/40"
                    {...field}
                    value={typeof field.value === "string" ? field.value : ""}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        )}
      </div>
      {mode !== "view" && (
        <FieldErrorMessage message={errors.notes?.message} align="right" />
      )}
    </section>
  );
};
