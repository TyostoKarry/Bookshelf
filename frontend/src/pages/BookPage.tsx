import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, type FC } from "react";
import { useForm } from "react-hook-form";
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
import { bookFormSchema, type BookForm } from "../validation/bookFormSchema";
import { Form } from "@/components/ui/form";

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

  const form = useForm<BookForm>({
    resolver: zodResolver(bookFormSchema),
    defaultValues: {
      readCount: 0,
      favorite: false,
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = form;

  useEffect(() => {
    if (!isInitialized) return;

    if (mode === "create" || !bookId) {
      if (!myBookshelf || !editToken) {
        toast.error(t("toast.notLoggedInToCreateBook"));
        navigate(`/`, { replace: true });
        return;
      }
      setBook({ favorite: false });
      if (passedBook) setBook((prev) => ({ ...prev, ...passedBook }));
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
    if (book && (mode === "edit" || mode === "create") && isInitialized) {
      reset(book);
    }
  }, [book, mode, isInitialized, reset]);

  const onSubmit = async (data: BookForm) => {
    try {
      const parsedData = bookFormSchema.parse(data);

      const resultBook =
        mode === "create"
          ? await createBookInBookshelf(
              myBookshelf!.publicId,
              editToken!,
              parsedData,
            )
          : await updateBookInBookshelf(
              book.bookshelfPublicId!,
              editToken!,
              book.id!,
              parsedData,
            );
      if (!resultBook) {
        toast.error(t("toast.failedToSaveBook"));
        return;
      }
      await refreshBookshelf();
      toast.success(
        mode === "create"
          ? t("toast.bookCreatedSuccessfully")
          : t("toast.bookHasBeenUpdated"),
      );
      reset();
      navigate(`/books/${resultBook.id}`);
    } catch (error) {
      console.error("Error updating book:", error);
      toast.error(t("toast.failedToSaveBook"));
    }
  };

  if (loading) return <div>{t("common.loading")}</div>;

  return (
    <main className="max-w-5xl mx-auto pt-10 pb-6 px-6">
      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-card rounded-2xl shadow-xl p-8"
        >
          <BookPageHeader book={book} mode={mode} form={form} />
          <BookMetadata book={book} mode={mode} form={form} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
            <BookReadingDetails book={book} mode={mode} form={form} />
            <BookPersonalStats book={book} mode={mode} form={form} />
          </div>
          <BookPersonalNotes book={book} mode={mode} form={form} />
          <BookPageActions
            book={book}
            mode={mode}
            canEdit={canEdit}
            bookId={bookId}
            editToken={editToken}
            refreshBookshelf={refreshBookshelf}
            reset={reset}
            isSubmitting={isSubmitting}
          />
        </form>
      </Form>
    </main>
  );
};
