import { type FC, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { BookshelfView } from "../components/commons/BookshelfVeiw";
import { useLanguage } from "../hooks/useLanguage";
import { usePublicBookshelf } from "../hooks/usePublicBookshelf";
import { Spinner } from "@/components/ui/spinner";

export const PublicBookshelf: FC = () => {
  const { publicId } = useParams<{ publicId: string }>();
  const { bookshelf, books, loading, error } = usePublicBookshelf(publicId!);
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      toast.error(error);
      navigate("/", { replace: true });
    }
  }, [error, navigate]);

  if (!publicId) return <div>{t("common.invalidBookshelfPublicId")}</div>;
  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)] ">
        <Spinner className="size-24" />
        <p className="text-2xl text-muted-foreground">{t("common.loading")}</p>
      </div>
    );
  if (!bookshelf) return <div>{t("common.bookshelfNotFound")}</div>;

  return <BookshelfView bookshelf={bookshelf} books={books} canEdit={false} />;
};
