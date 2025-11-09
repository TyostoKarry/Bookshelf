import { type FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { BookshelfView } from "../components/commons/BookshelfVeiw";
import { useLanguage } from "../hooks/useLanguage";
import { useMyBookshelf } from "../hooks/useMyBookshelf";

export const MyBookshelf: FC = () => {
  const { editToken, bookshelf, books, clearBookshelf } = useMyBookshelf();
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    if (!editToken) {
      toast.error(t("toast.noTokenFound"));
      navigate("/", { replace: true });
    }
  }, [editToken, navigate, t]);

  if (!bookshelf) {
    return <div>{t("common.loading")}</div>;
  }

  return (
    <BookshelfView
      bookshelf={bookshelf}
      books={books}
      editToken={editToken}
      canEdit={true}
      clearBookshelf={clearBookshelf}
    />
  );
};
