import { useEffect, useState, type FC } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { getBookById } from "../api/books";
import {
  BookPageActions,
  BookPageHeader,
  BookPersonalNotes,
  BookPersonalStats,
  BookReadingDetails,
} from "../components/commons/book";
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

  useEffect(() => {
    if (!isInitialized) return;

    if (mode === "create" || !bookId) {
      if (!myBookshelf || !editToken) {
        toast.error(t("toast.notLoggedInToCreateBook"));
        navigate(`/`, { replace: true });
        return;
      }
      setBook({});
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
    mode,
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
    if (mode === "edit" && !canEdit) {
      console.error("User does not have permission to edit this book.");
      toast.error(t("toast.noPermissionToEditBook"));
      navigate("/", { replace: true });
    }
  }, [isInitialized, mode, canEdit, navigate, t, loading]);

  if (loading) return <div>{t("common.loading")}</div>;

  return (
    <main className="max-w-5xl mx-auto pt-10 pb-6 px-6">
      <article className="bg-white rounded-2xl shadow-lg p-8">
        <BookPageHeader book={book} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
          <BookReadingDetails book={book} />
          <BookPersonalStats book={book} />
        </div>
        <BookPersonalNotes book={book} />
        <BookPageActions
          book={book}
          mode={mode}
          canEdit={canEdit}
          bookId={bookId}
        />
      </article>
    </main>
  );
};
