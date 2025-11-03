import { type FC } from "react";
import { toast } from "sonner";
import { updateBookInBookshelf } from "../../api/bookshelves";
import FavoriteIcon from "../../assets/icons/favorite.svg?react";
import NotFavoriteIcon from "../../assets/icons/notFavorite.svg?react";
import { useLanguage } from "../../hooks/useLanguage";
import { useMyBookshelf } from "../../hooks/useMyBookshelf";
import type { Book } from "../../types/book";

interface BookCardProps {
  book: Book;
  canEdit: boolean;
}

export const BookCard: FC<BookCardProps> = ({ book, canEdit }) => {
  const { t } = useLanguage();
  const { title, author, coverUrl, favorite, status, id } = book;
  const { editToken, bookshelf, refreshBookshelf } = useMyBookshelf();

  const statusColors = {
    WISHLIST: "bg-blue-400",
    READING: "bg-yellow-500",
    COMPLETED: "bg-green-500",
  };

  const handleToggleFavorite = async () => {
    if (!canEdit || !bookshelf || !editToken) return;

    try {
      const updated = await updateBookInBookshelf(
        bookshelf.publicId,
        editToken,
        id,
        {
          favorite: !favorite,
        },
      );
      if (updated) {
        toast.success(
          !favorite
            ? `${t("toast.markedAsFavorite")} ${title}`
            : `${t("toast.removedFromFavorites")} ${title}`,
        );
        await refreshBookshelf();
      }
    } catch (err) {
      console.error("Failed to toggle favorite status:", err);
      toast.error(t("toast.toggleFavoriteFailed"));
    }
  };

  return (
    <div className="relative bg-white rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-0.5 transform transition-all p-4">
      <div className="flex justify-between pb-2">
        <div
          className={`px-2 py-1 text-xs font-semibold text-white rounded ${statusColors[status]}`}
        >
          {status}
        </div>
        {canEdit ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleToggleFavorite();
            }}
            className="cursor-pointer"
            title={
              favorite
                ? t("button.unmarkAsFavorite")
                : t("button.markAsFavorite")
            }
          >
            {favorite ? (
              <FavoriteIcon className="w-5 h-5 text-yellow-400 transition-transform duration-150 ease-in-out hover:scale-110 active:scale-95" />
            ) : (
              <NotFavoriteIcon className="w-5 h-5 transition-transform duration-150 ease-in-out hover:scale-110 active:scale-95" />
            )}
          </button>
        ) : favorite ? (
          <FavoriteIcon className="w-5 h-5 text-yellow-400" />
        ) : (
          <NotFavoriteIcon className="w-5 h-5" />
        )}
      </div>
      <div className="flex items-center justify-center aspect-[3/4] mb-3 overflow-hidden rounded-lg bg-gray-200">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={title}
            className="object-fill w-full h-full"
          />
        ) : (
          <div className="flex flex-col items-center justify-center">
            <span className="text-gray-400 text-8xl pb-4">
              {t("bookCard.placeholderQuestionMark")}
            </span>
            <span className="text-gray-400 text-2xl">
              {t("bookCard.placeholderNoCover")}
            </span>
            <span className="text-gray-400 text-2xl">
              {t("bookCard.placeholderAvailable")}
            </span>
          </div>
        )}
      </div>
      <h3
        className="text-lg font-semibold text-gray-900 mb-1 truncate"
        title={title}
      >
        {title}
      </h3>
      <p className="text-sm text-gray-700 truncate" title={author}>
        {author}
      </p>
    </div>
  );
};
