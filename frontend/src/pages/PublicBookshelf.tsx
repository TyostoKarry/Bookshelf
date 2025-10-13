import { type FC, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { BookshelfView } from "../components/commons/BookshelfVeiw";
import { useLanguage } from "../hooks/useLanguage";
import { usePublicBookshelf } from "../hooks/usePublicBookshelf";

export const PublicBookshelf: FC = () => {
  const { id } = useParams<{ id: string }>();
  const { bookshelf, books, loading, error } = usePublicBookshelf(id!);
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      toast.error(error);
      navigate("/", { replace: true });
    }
  }, [error, navigate]);

  if (!id) return <div>{t("common.invalidBookshelfId")}</div>;
  if (loading) return <div>{t("common.loading")}</div>;
  if (!bookshelf) return <div>{t("common.bookshelfNotFound")}</div>;

  return <BookshelfView bookshelf={bookshelf} books={books} canEdit={false} />;
};
