import { type FC } from "react";
import FavoriteIcon from "../../assets/icons/favorite.svg?react";
import NotFavoriteIcon from "../../assets/icons/notFavorite.svg?react";
import type { Book } from "../../types/book";

export const BookCard: FC<{ book: Book }> = ({ book }) => {
  const { title, author, coverUrl, favorite, status } = book;

  const statusColors = {
    WISHLIST: "bg-blue-400",
    READING: "bg-yellow-500",
    COMPLETED: "bg-green-500",
  };

  return (
    <div className="relative bg-white rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-0.5 transform transition-all p-4">
      <div className="flex justify-between pb-2">
        <div
          className={`px-2 py-1 text-xs font-semibold text-white rounded ${statusColors[status]}`}
        >
          {status}
        </div>
        {favorite ? (
          <FavoriteIcon className="w-5 h-5 text-yellow-400 transition-transform duration-150 ease-in-out hover:scale-110 active:scale-95" />
        ) : (
          <NotFavoriteIcon className="w-5 h-5 transition-transform duration-150 ease-in-out hover:scale-110 active:scale-95" />
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
            <span className="text-gray-400 text-8xl pb-4">?</span>
            <span className="text-gray-400 text-2xl">No Cover</span>
            <span className="text-gray-400 text-2xl">Available</span>
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
