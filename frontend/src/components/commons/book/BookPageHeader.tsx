import { type FC } from "react";
import type { UseFormReturn } from "react-hook-form";
import { CoverImage } from "./CoverImage";
import { useLanguage } from "../../../hooks/useLanguage";
import type { Book } from "../../../types/book";
import type { BookPageMode } from "../../../types/book-page-mode";
import type { BookForm } from "../../../validation/bookFormSchema";
import { FieldErrorMessage } from "../FieldErrorMessage";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface BookPageHeaderProps {
  book: Partial<Book>;
  mode: BookPageMode;
  form: UseFormReturn<BookForm>;
}

export const BookPageHeader: FC<BookPageHeaderProps> = ({
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
    <header className="flex flex-row items-stretch gap-8 mb-10">
      <div className="flex flex-col">
        <CoverImage coverUrl={book.coverUrl} title={book.title} width="small" />
        {mode !== "view" && (
          <>
            <FormField
              control={control}
              name="coverUrl"
              render={({ field }) => (
                <FormItem className="mt-2">
                  <FormControl>
                    <Input
                      className="hover:bg-accent/40"
                      placeholder={t("placeholders.enterCoverImageUrl")}
                      {...field}
                      value={typeof field.value === "string" ? field.value : ""}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FieldErrorMessage
              message={errors.coverUrl?.message}
              align="left"
            />
          </>
        )}
      </div>
      <section className="flex-1 flex flex-col">
        <div className={`flex flex-col ${mode === "view" ? "mb-4" : "mb-2"}`}>
          {mode === "view" ? (
            <h1 className="text-3xl font-bold text-foreground leading-tight">
              {book.title}
            </h1>
          ) : (
            <>
              <FormField
                control={control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className="hover:bg-accent/40"
                        placeholder={t("placeholders.enterTitle")}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FieldErrorMessage message={errors.title?.message} />
            </>
          )}
        </div>
        <div className={`flex flex-col ${mode === "view" ? "mb-8" : "mb-4"}`}>
          {mode === "view" ? (
            <h2 className="text-xl text-foreground">{book.author}</h2>
          ) : (
            <>
              <FormField
                control={control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className="hover:bg-accent/40"
                        placeholder={t("placeholders.enterAuthorName")}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FieldErrorMessage message={errors.author?.message} />
            </>
          )}
        </div>
        <div className="flex flex-col flex-grow">
          <h3 className="text-sm font-medium text-foreground mb-1">
            {t("bookPage.description")}:
          </h3>
          {mode === "view" ? (
            <p
              className={`${book.description ? "text-foreground" : "text-muted-foreground"} min-h-[6rem] max-h-[12rem] leading-relaxed flex-grow overflow-y-auto resize-none`}
            >
              {book.description || t("bookPage.noDescription")}
            </p>
          ) : (
            <>
              <FormField
                control={control}
                name="description"
                render={({ field }) => (
                  <FormItem className="flex flex-col flex-1 ">
                    <FormControl>
                      <Textarea
                        placeholder={t("placeholders.enterDescription")}
                        className="h-full max-h-[14rem] overflow-y-auto resize-none hover:bg-accent/40"
                        {...field}
                        value={
                          typeof field.value === "string" ? field.value : ""
                        }
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FieldErrorMessage message={errors.description?.message} />
            </>
          )}
        </div>
      </section>
    </header>
  );
};
