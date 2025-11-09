import { type FC } from "react";
import { useLanguage } from "../../../hooks/useLanguage";

interface CoverImageProps {
  coverUrl: string | null | undefined;
  title: string | undefined;
  width?: keyof typeof WIDTH_MAP;
}

const WIDTH_MAP = {
  full: "w-full",
  small: "w-48 md:w-56",
} as const;

export const CoverImage: FC<CoverImageProps> = ({
  coverUrl,
  title,
  width = "full",
}) => {
  const { t } = useLanguage();

  return (
    <figure className="flex items-center justify-center mb-3">
      {coverUrl ? (
        <img
          src={coverUrl}
          alt={title}
          className={`object-contain ${WIDTH_MAP[width]} h-full rounded-lg shadow-md border border-gray-100`}
        />
      ) : (
        <div
          className={`flex flex-col aspect-[6/9] ${WIDTH_MAP[width]} h-full items-center justify-center bg-gray-200 rounded-lg shadow-sm`}
        >
          <span className="text-gray-400 text-8xl pb-4">
            {t("common.placeholderQuestionMark")}
          </span>
          <span className="text-gray-400 text-2xl">
            {t("common.placeholderNoCover")}
          </span>
          <span className="text-gray-400 text-2xl">
            {t("common.placeholderProvided")}
          </span>
        </div>
      )}
      <figcaption className="sr-only">
        {`${t("common.coverImageFor")}: ${title ?? t("common.coverNotProvided")}`}
      </figcaption>
    </figure>
  );
};
