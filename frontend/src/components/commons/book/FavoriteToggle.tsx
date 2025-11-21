import { type FC } from "react";
import { Controller, type Control } from "react-hook-form";
import NotFavoriteIcon from "../../../assets/icons/star-empty.svg?react";
import FavoriteIcon from "../../../assets/icons/star-full.svg?react";
import { useLanguage } from "../../../hooks/useLanguage";
import type { BookPageMode } from "../../../types/book-page-mode";
import type { BookForm } from "../../../validation/bookFormSchema";
import { FieldErrorMessage } from "../FieldErrorMessage";

interface FavoriteToggleProps {
  control: Control<BookForm>;
  error?: string;
  mode: BookPageMode;
  label: string;
  value?: boolean;
}

export const FavoriteToggle: FC<FavoriteToggleProps> = ({
  control,
  error,
  mode,
  label,
  value = false,
}) => {
  const { t } = useLanguage();
  if (mode === "view") {
    return (
      <div className="flex items-baseline justify-between border-b border-gray-100 pb-1">
        <label className="flex-1 text-gray-600 text-sm">{label}</label>
        <div className="flex items-center gap-1">
          {value ? (
            <FavoriteIcon className="w-5 h-5 text-yellow-400" />
          ) : (
            <NotFavoriteIcon className="w-5 h-5 text-gray-400" />
          )}
          <span className="text-gray-900 text-sm">
            {value ? t("common.yes") : t("common.no")}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <Controller<BookForm, "favorite">
        name="favorite"
        control={control}
        render={({ field }) => (
          <div className="flex items-baseline justify-between border-b border-gray-100 pb-1">
            <label
              className="flex-1 text-gray-600 text-sm"
              htmlFor="favorite-toggle"
            >
              {label}
            </label>
            <button
              id="favorite-toggle"
              type="button"
              onClick={() => field.onChange(!field.value)}
              className="flex items-center gap-1 cursor-pointer hover:opacity-80 transition"
              title={
                field.value
                  ? t("button.unmarkAsFavorite")
                  : t("button.markAsFavorite")
              }
            >
              {field.value ? (
                <>
                  <FavoriteIcon className="w-5 h-5 text-yellow-400" />
                  <span className="text-gray-900 text-sm">
                    {t("common.yes")}
                  </span>
                </>
              ) : (
                <>
                  <NotFavoriteIcon className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-900 text-sm">
                    {t("common.no")}
                  </span>
                </>
              )}
            </button>
          </div>
        )}
      />
      <FieldErrorMessage message={error} align="right" />
    </div>
  );
};
