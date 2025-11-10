import { useState, type FC, type MouseEvent as ReactMouseEvent } from "react";
import CrossIcon from "../../../assets/icons/cross.svg?react";
import EmptyStarIcon from "../../../assets/icons/star-empty.svg?react";
import FullStarIcon from "../../../assets/icons/star-full.svg?react";
import HalfStarIcon from "../../../assets/icons/star-half.svg?react";

interface StarRatingProps {
  rating: number | null | undefined;
  mode: "view" | "edit" | "create";
  onChange?: (rating: number) => void;
}

export const StarRating: FC<StarRatingProps> = ({ rating, mode, onChange }) => {
  const maxRating = 10;
  const totalStars = 5;
  const ratingPerStar = maxRating / totalStars;
  const clampedRating = Math.min(Math.max(rating || 0, 0), 10);

  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const activeRating = hoverRating ?? clampedRating;

  const computeRatingFromClick = (
    event: ReactMouseEvent<HTMLButtonElement>,
    index: number,
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickedLeftHalf = clickX < rect.width / 2;
    return (
      index * ratingPerStar +
      (clickedLeftHalf ? ratingPerStar / 2 : ratingPerStar)
    );
  };

  const handleStarClick = (
    event: ReactMouseEvent<HTMLButtonElement>,
    index: number,
  ) => {
    if (mode === "view" || !onChange) return;
    const newRating = computeRatingFromClick(event, index);
    onChange(newRating);
  };

  const handleStarHover = (
    event: ReactMouseEvent<HTMLButtonElement>,
    index: number,
  ) => {
    if (mode === "view" || !onChange) return;
    setHoverRating(computeRatingFromClick(event, index));
  };

  const handleStarHoverLeave = () => {
    if (mode === "view" || !onChange) return;
    setHoverRating(null);
  };

  const renderStar = (index: number) => {
    const fullStarValue = (index + 1) * ratingPerStar;
    const halfStarValue = fullStarValue - ratingPerStar / 2;

    let Icon = EmptyStarIcon;
    if (activeRating >= fullStarValue) Icon = FullStarIcon;
    else if (activeRating >= halfStarValue) Icon = HalfStarIcon;

    return (
      <button
        key={index}
        type="button"
        disabled={mode === "view"}
        onClick={(event) => handleStarClick(event, index)}
        onMouseMove={(event) => handleStarHover(event, index)}
        onMouseLeave={handleStarHoverLeave}
        className={`h-8 w-8 p-1 ${mode !== "view" ? "cursor-pointer hover:scale-110 active:scale-95 duration-150 ease-out" : ""}`}
      >
        <Icon
          className={`w-full h-full ${hoverRating !== null ? "text-yellow-300" : "text-yellow-400"}`}
        />
      </button>
    );
  };

  return (
    <div className="flex items-center">
      {mode !== "view" && (
        <button
          type="button"
          onClick={() => onChange?.(0)}
          className="mr-3 hover:cursor-pointer hover:scale-105 active:scale-95 duration-150 ease-out"
          title="Clear rating"
        >
          <CrossIcon className="w-4 h-4 text-red-600" />
        </button>
      )}
      {Array.from({ length: totalStars }, (_, index) => renderStar(index))}
      <span className="ml-2 text-sm text-gray-600">
        {(activeRating / 2).toFixed(1)} / {maxRating / 2}
      </span>
    </div>
  );
};
