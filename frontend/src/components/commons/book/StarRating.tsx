import { X } from "lucide-react";
import { useState, type FC, type MouseEvent as ReactMouseEvent } from "react";
import { Controller, type Control } from "react-hook-form";
import EmptyStarIcon from "../../../assets/icons/star-empty.svg?react";
import FullStarIcon from "../../../assets/icons/star-full.svg?react";
import HalfStarIcon from "../../../assets/icons/star-half.svg?react";
import type { BookPageMode } from "../../../types/book-page-mode";
import type { BookForm } from "../../../validation/bookFormSchema";
import { FieldErrorMessage } from "../FieldErrorMessage";

interface StarRatingProps {
  control?: Control<BookForm>;
  mode?: BookPageMode;
  value?: number | null;
  label?: string;
  error?: string;
  readOnly?: boolean;
}

export const StarRating: FC<StarRatingProps> = ({
  control,
  mode,
  value,
  label,
  error,
  readOnly = false,
}) => {
  const maxRating = 10;
  const totalStars = 5;
  const ratingPerStar = maxRating / totalStars;
  const [hoverRating, setHoverRating] = useState<number | null>(null);

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

  const renderStaticStars = (current: number) => {
    const clamped = Math.min(Math.max(current ?? 0, 0), maxRating);
    const elements = [];
    for (let i = 0; i < totalStars; i++) {
      const full = (i + 1) * ratingPerStar;
      const half = full - ratingPerStar / 2;
      let Icon = EmptyStarIcon;
      if (clamped >= full) Icon = FullStarIcon;
      else if (clamped >= half) Icon = HalfStarIcon;
      elements.push(
        <Icon
          key={i}
          className={`${readOnly ? "w-4 h-4 ml-1" : "w-8 h-8 p-1"} text-yellow-400`}
        />,
      );
    }
    return (
      <div className="flex items-center">
        {elements}
        {!readOnly && (
          <span className="ml-2 text-sm text-muted-foreground">
            {(clamped / 2).toFixed(1)} / {maxRating / 2}
          </span>
        )}
      </div>
    );
  };

  if (readOnly) {
    return (
      <div className="flex items-center">{renderStaticStars(value ?? 0)}</div>
    );
  }

  if (mode === "view") {
    return (
      <div className="flex items-center justify-between border-b border-gray-100 pb-1">
        <label className="flex-1 items-center text-muted-foreground text-sm">
          {label}
        </label>
        <div className="flex items-center justify-between border-b border-gray-100 pb-1">
          {renderStaticStars(value ?? 0)}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between border-b border-gray-100 pb-1">
        <label className="flex-1 items-center text-muted-foreground text-sm">
          {label}
        </label>
        <Controller<BookForm, "rating">
          name="rating"
          control={control}
          render={({ field }) => {
            const clampedValue = Math.min(
              Math.max(field.value ?? 0, 0),
              maxRating,
            );
            const activeRating = hoverRating ?? clampedValue;

            const handleClick = (
              event: ReactMouseEvent<HTMLButtonElement>,
              index: number,
            ) => {
              const newValue = computeRatingFromClick(event, index);
              field.onChange(newValue);
            };

            const handleHover = (
              event: ReactMouseEvent<HTMLButtonElement>,
              index: number,
            ) => {
              setHoverRating(computeRatingFromClick(event, index));
            };

            const handleLeave = () => setHoverRating(null);

            const renderStar = (index: number) => {
              const fullValue = (index + 1) * ratingPerStar;
              const halfValue = fullValue - ratingPerStar / 2;

              let Icon = EmptyStarIcon;
              if (activeRating >= fullValue) Icon = FullStarIcon;
              else if (activeRating >= halfValue) Icon = HalfStarIcon;

              return (
                <button
                  key={index}
                  type="button"
                  onClick={(event) => handleClick(event, index)}
                  onMouseMove={(event) => handleHover(event, index)}
                  onMouseLeave={handleLeave}
                  className="h-8 w-8 p-1 cursor-pointer hover:scale-110 active:scale-95 duration-150 ease-out transition-transform"
                >
                  <Icon
                    className={`w-full h-full ${
                      hoverRating !== null
                        ? "text-yellow-300"
                        : "text-yellow-400"
                    }`}
                  />
                </button>
              );
            };

            return (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => field.onChange(0)}
                    className="mr-1 hover:cursor-pointer hover:scale-110 active:scale-95 duration-150 ease-out transition-transform"
                    title="Clear rating"
                  >
                    <X className="text-destructive" />
                  </button>

                  {Array.from({ length: totalStars }, (_, index) =>
                    renderStar(index),
                  )}

                  <span className="ml-2 text-sm text-muted-foreground">
                    {(activeRating / 2).toFixed(1)} / {maxRating / 2}
                  </span>
                </div>
              </div>
            );
          }}
        />
      </div>
      <FieldErrorMessage message={error} align="right" />
    </div>
  );
};
