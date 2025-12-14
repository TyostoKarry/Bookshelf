import { type FC } from "react";
import demoBooks from "./demo-books.json";
import { Marquee } from "./Marquee";
import { BookCard } from "../../components/commons/bookshelf/BookCard";
import { useLanguage } from "../../hooks/useLanguage";
import { type Book } from "../../types/book";

export const BookCardShowcase: FC = () => {
  const { t } = useLanguage();
  const showcaseBooks: Book[] = (demoBooks as { books: Book[] }).books;

  return (
    <section className="px-6 py-12">
      <div className="max-w-6xl mx-auto flex flex-row items-center justify-between gap-6">
        <Marquee
          speed={30}
          pauseOnHover={false}
          className="marquee-will-change"
        >
          <ul className="flex gap-4 pr-4">
            {showcaseBooks.map((book) => (
              <li key={book.id} className="min-w-[220px]">
                <BookCard book={book} canEdit={false} interactive={false} />
              </li>
            ))}
          </ul>
        </Marquee>
        <div className="flex flex-col items-end min-w-[50%] space-y-4">
          <div className="text-end">
            <h2 className="text-2xl font-semibold text-foreground">
              {t("home.bookCardShowcaseTitle")}
            </h2>
            <p className="text-muted-foreground mt-1">
              {t("home.bookCardShowcaseSubtitle")}
            </p>
          </div>
          <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-primary" />
              <span>{t("home.bookCardShowcaseFilter")}</span>
            </li>
            <li className="flex gap-2">
              <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-primary" />
              <span>{t("home.bookCardShowcaseFullDetails")}</span>
            </li>
            <li className="flex gap-2">
              <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-primary" />
              <span>{t("home.bookCardShowcaseImport")}</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};
