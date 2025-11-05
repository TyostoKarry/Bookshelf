import { useEffect, useState, type FC, type ReactNode } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { getBookById } from "../api/books";
import FavoriteIcon from "../assets/icons/favorite.svg?react";
import NotFavoriteIcon from "../assets/icons/notFavorite.svg?react";
import { Button } from "../components/commons/Button";
import { useLanguage } from "../hooks/useLanguage";
import { useMyBookshelf } from "../hooks/useMyBookshelf";
import type { Book } from "../types/book";
import type { BookPageMode } from "../types/book-page-mode";

interface BookPageProps {
  mode: BookPageMode;
}

export const BookPage: FC<BookPageProps> = ({ mode }) => {
  const { t } = useLanguage();
  const location = useLocation();
  const passedBook = (location.state as { book?: Book })?.book;
  const passedCanEdit = (location.state as { canEdit?: boolean })?.canEdit;
  const {
    bookshelf: myBookshelf,
    books: myBooks,
    editToken,
    isInitialized,
    refreshBookshelf,
  } = useMyBookshelf();
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();

  const [book, setBook] = useState<Partial<Book>>({});
  const [canEdit, setCanEdit] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  const isViewMode = mode === "view" && !!bookId;
  const isEditMode = mode === "edit" && !!bookId;
  const isCreateMode = mode === "create" && !bookId;

  useEffect(() => {
    if (!isInitialized) return;

    if (isCreateMode || !bookId) {
      if (!myBookshelf || !editToken) {
        toast.error(t("toast.notLoggedInToCreateBook"));
        navigate(`/`, { replace: true });
        return;
      }
      setBook({});
      setCanEdit(Boolean(editToken));
      return;
    }

    if (passedBook) {
      setBook(passedBook);
      setCanEdit(Boolean(passedCanEdit));
      return;
    }

    const localBook = myBooks?.find((book) => book.id === Number(bookId));
    if (localBook) {
      setBook(localBook);
      setCanEdit(Boolean(editToken));
      return;
    }

    const fetchBook = async () => {
      setLoading(true);
      try {
        const data = await getBookById(bookId);
        setBook(data || {});
        setCanEdit(false);
      } catch (error) {
        console.error("Error fetching book:", error);
        toast.error(t("toast.failedToFetchBook"));
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [
    isCreateMode,
    myBookshelf,
    bookId,
    t,
    myBooks,
    passedBook,
    passedCanEdit,
    editToken,
    isInitialized,
    navigate,
  ]);

  useEffect(() => {
    if (!isInitialized || loading || canEdit === null) return;
    if (isEditMode && !canEdit) {
      console.error("User does not have permission to edit this book.");
      toast.error(t("toast.noPermissionToEditBook"));
      navigate("/", { replace: true });
    }
  }, [isInitialized, isEditMode, canEdit, navigate, t, loading]);

  const handleNavigateBackToBookshelf = () => {
    if (canEdit) {
      navigate("/my/bookshelf");
      return;
    }
    navigate(`/bookshelves/${book.bookshelfPublicId}`);
  };

  if (loading) return <div>{t("common.loading")}</div>;

  const SectionTitle = ({ children }: { children: ReactNode }) => (
    <div className="flex items-center justify-center w-full">
      <div className="flex-grow h-px bg-gray-200"></div>
      <h3 className="px-4 text-md uppercase tracking-wide text-gray-900 whitespace-nowrap">
        {children}
      </h3>
      <div className="flex-grow h-px bg-gray-200"></div>
    </div>
  );

  const Meta = ({ label, value }: { label: string; value?: string | null }) => (
    <div>
      <span className="text-gray-500 text-sm">{label}:</span>{" "}
      <span className="font-medium text-gray-800">
        {value || t("common.unknown")}
      </span>
    </div>
  );

  const Detail = ({
    label,
    value,
  }: {
    label: string;
    value?: ReactNode | null;
  }) => (
    <div className="flex items-baseline justify-between border-b border-gray-100 pb-1">
      <span className="text-gray-600 text-sm">{label}</span>
      <span className="text-gray-900 text-sm font-medium">
        {value || "———"}
      </span>
    </div>
  );

  return (
    <main className="max-w-5xl mx-auto mt-10 px-6">
      <article className="bg-white rounded-2xl shadow-lg p-8">
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
                <span className="text-2xl">
                  {t("common.placeholderNoCover")}
                </span>
                <span className="text-2xl">
                  {t("common.placeholderAvailable")}
                </span>
              </div>
            )}
            <figcaption className="sr-only">
              {`${t("common.coverImageFor")}: title: ${book.title || t("common.coverNotAvailable")}`}
            </figcaption>
          </figure>
          <div className="flex-1 flex flex-col justify-between">
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
              <Meta
                label={t("bookPage.published")}
                value={book.publishedDate}
              />
              <Meta label={t("bookPage.isbn13")} value={book.isbn13} />
            </div>
          </div>
        </header>
        <div className="grid grid-cols-2 gap-10 mb-8">
          <section className="space-y-3">
            <SectionTitle>{t("bookPage.readingDetails")}</SectionTitle>
            <Detail label={t("bookPage.status")} value={book.status} />
            <Detail
              label={t("bookPage.progress")}
              value={book.progress?.toString()}
            />
            <Detail label={t("bookPage.startedAt")} value={book.startedAt} />
            <Detail label={t("bookPage.finishedAt")} value={book.finishedAt} />
          </section>
          <section className="space-y-3">
            <SectionTitle>{t("bookPage.personalStats")}</SectionTitle>
            <Detail
              label={t("bookPage.rating")}
              value={book.rating != null ? `${book.rating}/10` : "—"}
            />
            <Detail
              label={t("bookPage.readCount")}
              value={book.readCount?.toString()}
            />
            <Detail
              label={t("bookPage.favorite")}
              value={
                book.favorite ? (
                  <div className="flex items-center gap-1">
                    <FavoriteIcon className="w-4 h-4 text-yellow-400" />
                    <span className="text-gray-800">{t("common.yes")}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <NotFavoriteIcon className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">{t("common.no")}</span>
                  </div>
                )
              }
            />
          </section>
        </div>
        <section>
          <SectionTitle>{t("bookPage.personalNotes")}</SectionTitle>
          {book.notes ? (
            <p className="text-gray-800 leading-relaxed min-h-[6rem] pt-3">
              {book.notes}
            </p>
          ) : (
            <p className="italic text-gray-400 min-h-[6rem] flex items-center">
              {t("bookPage.noNotes")}
            </p>
          )}
        </section>
        <footer
          className={`flex ${isViewMode ? "justify-between" : "justify-end"} gap-2 mt-8`}
        >
          {isViewMode && (
            <Button
              label={t("button.backToBookshelf")}
              onClick={handleNavigateBackToBookshelf}
            />
          )}
          {canEdit && (
            <div className="flex gap-2">
              <Button
                label={t("button.delete")}
                color="danger"
                onClick={() => {}}
              />
              {isViewMode && (
                <Button
                  label={t("button.edit")}
                  onClick={() =>
                    navigate(`/books/${bookId}/edit`, {
                      state: { book, canEdit },
                    })
                  }
                />
              )}
              {isEditMode && (
                <Button
                  label={t("button.save")}
                  onClick={() =>
                    navigate(`/books/${bookId}`, {
                      state: { book, canEdit },
                    })
                  }
                />
              )}
            </div>
          )}
        </footer>
      </article>
    </main>
  );
};
