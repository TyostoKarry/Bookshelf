import { type FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { BookshelfView } from "../components/commons/BookshelfVeiw";
import { useLanguage } from "../hooks/useLanguage";
import { useMyBookshelf } from "../hooks/useMyBookshelf";
import { Spinner } from "@/components/ui/spinner";

export const MyBookshelf: FC = () => {
  const { editToken, bookshelf, books, isLoading, clearBookshelf } =
    useMyBookshelf();
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    if (!editToken) {
      toast.error(t("toast.noTokenFound"));
      navigate("/", { replace: true });
    }
  }, [editToken, navigate, t]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)]">
        <Spinner className="size-24" />
        <p className="text-2xl text-muted-foreground">{t("common.loading")}</p>
      </div>
    );
  }

  if (!bookshelf) {
    toast.error(t("toast.noBookshelfFound"));
    navigate("/", { replace: true });
    return null;
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
