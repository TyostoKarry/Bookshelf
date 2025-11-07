import { useEffect, useState, type FC } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { getBookById } from "../api/books";
import {
  createBookInBookshelf,
  updateBookInBookshelf,
} from "../api/bookshelves";
import {
  BookMetadata,
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
  const [draftBook, setDraftBook] = useState<Partial<Book>>({});
  const [canEdit, setCanEdit] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof Book, boolean>>
  >({});

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
        navigate("/", { replace: true });
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

  useEffect(() => {
    if (book && (mode === "edit" || mode === "create")) {
      setDraftBook(book);
    }
  }, [book, mode]);

  const handleDraftChange = (
    key: keyof Book,
    value: string | number | boolean | null,
  ) => {
    setDraftBook((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  async function handleSave(): Promise<void> {
    if (mode === "view") return;
    if (!editToken) {
      toast.error(t("toast.notLoggedInToSaveChanges"));
      return;
    }

    try {
      const updatedOrCreated =
        mode === "edit"
          ? await updateBookInBookshelf(
              book.bookshelfPublicId!,
              editToken,
              book.id!,
              draftBook,
            )
          : await createBookInBookshelf(
              myBookshelf!.publicId,
              editToken,
              draftBook,
            );

      if (!updatedOrCreated) {
        toast.error(t("toast.failedToSaveBook"));
        return;
      }

      refreshBookshelf();
      toast.success(
        mode === "create"
          ? `${t("toast.book")} “${updatedOrCreated.title}“ ${t("toast.createdSuccessfully")}`
          : `${t("toast.book")} “${updatedOrCreated.title}“ ${t("toast.hasBeenUpdated")}`,
      );
      navigate(`/books/${updatedOrCreated.id}`);
    } catch (error) {
      const messageMode =
        mode === "create"
          ? t("toast.failedToCreateBook")
          : t("toast.failedToUpdateBook");
      console.error(error);
      const message =
        error instanceof Error
          ? `${messageMode}! ${error.message}`
          : t("toast.anErrorOccurred");

      const newFieldErrors: Partial<Record<keyof Book, boolean>> = {};
      if (error instanceof Error) {
        const msg = error.message.toLowerCase();
        if (msg.includes("title")) newFieldErrors.title = true;
        if (msg.includes("author")) newFieldErrors.author = true;
        if (msg.includes("description")) newFieldErrors.description = true;
        if (msg.includes("publisher")) newFieldErrors.publisher = true;
        if (msg.includes("pages")) newFieldErrors.pages = true;
        if (msg.includes("isbn")) newFieldErrors.isbn13 = true;
        if (msg.includes("progress")) newFieldErrors.progress = true;
        if (msg.includes("rating")) newFieldErrors.rating = true;
        if (msg.includes("read count")) newFieldErrors.readCount = true;

        setFieldErrors(newFieldErrors);
      }

      toast.error(message);
    }
  }

  if (loading) return <div>{t("common.loading")}</div>;

  return (
    <main className="max-w-5xl mx-auto pt-10 pb-6 px-6">
      <article className="bg-white rounded-2xl shadow-lg p-8">
        <BookPageHeader
          book={mode === "view" ? book : draftBook}
          mode={mode}
          onChange={handleDraftChange}
          fieldErrors={fieldErrors}
          setFieldErrors={setFieldErrors}
        />
        <BookMetadata
          book={mode === "view" ? book : draftBook}
          mode={mode}
          onChange={handleDraftChange}
          fieldErrors={fieldErrors}
          setFieldErrors={setFieldErrors}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
          <BookReadingDetails
            book={mode === "view" ? book : draftBook}
            mode={mode}
            onChange={handleDraftChange}
            fieldErrors={fieldErrors}
            setFieldErrors={setFieldErrors}
          />
          <BookPersonalStats
            book={mode === "view" ? book : draftBook}
            mode={mode}
            onChange={handleDraftChange}
            fieldErrors={fieldErrors}
            setFieldErrors={setFieldErrors}
          />
        </div>
        <BookPersonalNotes
          book={mode === "view" ? book : draftBook}
          mode={mode}
          onChange={handleDraftChange}
        />
        <BookPageActions
          book={book}
          mode={mode}
          canEdit={canEdit}
          bookId={bookId}
          onSave={handleSave}
          fieldErrors={fieldErrors}
        />
      </article>
    </main>
  );
};
