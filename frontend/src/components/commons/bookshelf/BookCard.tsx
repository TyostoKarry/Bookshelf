import { BookOpen } from "lucide-react";
import { useState, type FC } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { updateBookInBookshelf } from "../../../api/bookshelves";
import NotFavoriteIcon from "../../../assets/icons/star-empty.svg?react";
import FavoriteIcon from "../../../assets/icons/star-full.svg?react";
import { useLanguage } from "../../../hooks/useLanguage";
import { useMyBookshelf } from "../../../hooks/useMyBookshelf";
import type { Book } from "../../../types/book";
import { CoverImage } from "../book";
import { StarRating } from "../book/StarRating";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface BookCardProps {
  book: Book;
  canEdit: boolean;
}

export const BookCard: FC<BookCardProps> = ({ book, canEdit }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { editToken, bookshelf, refreshBookshelf } = useMyBookshelf();
  const [updating, setUpdating] = useState(false);

  const statusColors = {
    WISHLIST: "bg-blue-400",
    READING: "bg-yellow-500",
    COMPLETED: "bg-green-500",
  };

  const handleCardClick = () => {
    navigate(`/books/${book.id}`, {
      state: { book, canEdit },
    });
  };

  const handleToggleFavorite = async () => {
    if (!canEdit || !bookshelf || !editToken || updating) return;

    setUpdating(true);
    try {
      const updated = await updateBookInBookshelf(
        bookshelf.publicId,
        editToken,
        book.id,
        {
          ...book,
          favorite: !book.favorite,
        },
      );
      if (updated) {
        toast.success(
          !book.favorite
            ? `${t("toast.markedAsFavorite")} ${book.title}`
            : `${t("toast.removedFromFavorites")} ${book.title}`,
        );
        await refreshBookshelf();
      }
    } catch (err) {
      console.error("Failed to toggle favorite status:", err);
      toast.error(t("toast.toggleFavoriteFailed"));
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Card
      onClick={handleCardClick}
      className="relative flex flex-col justify-between max-w-[14rem] gap-2 cursor-pointer shadow-sm hover:shadow-lg hover:scale-101 transition-all duration-200 group"
    >
      <CardHeader className="flex justify-between">
        <Badge
          className={`px-2 py-1 text-xs font-semibold text-white rounded ${statusColors[book.status]}`}
        >
          {book.status}
        </Badge>
        {canEdit ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleToggleFavorite();
            }}
            className={updating ? `cursor-progress` : `cursor-pointer`}
            title={
              book.favorite
                ? t("button.unmarkAsFavorite")
                : t("button.markAsFavorite")
            }
          >
            {book.favorite ? (
              <FavoriteIcon className="w-5 h-5 text-yellow-400 transition-transform duration-150 ease-in-out hover:scale-110 active:scale-95" />
            ) : (
              <NotFavoriteIcon className="w-5 h-5 transition-transform duration-150 ease-in-out hover:scale-110 active:scale-95" />
            )}
          </button>
        ) : book.favorite ? (
          <FavoriteIcon className="w-5 h-5 text-yellow-400" />
        ) : (
          <NotFavoriteIcon className="w-5 h-5" />
        )}
      </CardHeader>
      <CardContent>
        <CoverImage coverUrl={book.coverUrl} title={book.title} />
      </CardContent>
      <CardFooter className="flex flex-col items-start">
        <h3
          className="text-base font-semibold text-foreground truncate w-full"
          title={book.title}
        >
          {book.title}
        </h3>
        <p
          className="text-sm text-muted-foreground truncate w-full"
          title={book.author}
        >
          {book.author}
        </p>
        {book.pages && book.progress && (
          <Progress
            value={(book.progress / book.pages) * 100}
            className="mt-2"
          />
        )}
        <div className="flex w-full justify-between items-center mt-2">
          {book.pages ? (
            <div className="flex flex-row">
              <BookOpen className="w-4 h-4 text-muted-foreground mr-1" />
              <span className="text-xs text-muted-foreground mr-4">
                {book.pages}
              </span>
            </div>
          ) : (
            <span />
          )}
          {typeof book.rating === "number" && (
            <StarRating value={book.rating} readOnly />
          )}
        </div>
      </CardFooter>
    </Card>
  );
};
