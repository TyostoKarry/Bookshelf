import { type FC } from "react";
import { useLanguage } from "../../../hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ALL_VALUES = "ALL";

const GENRE_TRANSLATION_KEYS = {
  BIOGRAPHY: "bookshelfToolbar.genreBiography",
  FANTASY: "bookshelfToolbar.genreFantasy",
  FICTION: "bookshelfToolbar.genreFiction",
  HISTORY: "bookshelfToolbar.genreHistory",
  MYSTERY: "bookshelfToolbar.genreMystery",
  NONFICTION: "bookshelfToolbar.genreNonFiction",
  OTHER: "bookshelfToolbar.genreOther",
  ROMANCE: "bookshelfToolbar.genreRomance",
  SCIENCE: "bookshelfToolbar.genreScience",
  SCIFI: "bookshelfToolbar.genreSciFi",
  TECHNOLOGY: "bookshelfToolbar.genreTechnology",
  THRILLER: "bookshelfToolbar.genreThriller",
  UNKNOWN: "bookshelfToolbar.genreUnknown",
} as const;

const LANGUAGE_TRANSLATION_KEYS = {
  ARABIC: "bookshelfToolbar.languageArabic",
  CHINESE: "bookshelfToolbar.languageChinese",
  ENGLISH: "bookshelfToolbar.languageEnglish",
  FINNISH: "bookshelfToolbar.languageFinnish",
  FRENCH: "bookshelfToolbar.languageFrench",
  GERMAN: "bookshelfToolbar.languageGerman",
  HINDI: "bookshelfToolbar.languageHindi",
  ITALIAN: "bookshelfToolbar.languageItalian",
  JAPANESE: "bookshelfToolbar.languageJapanese",
  OTHER: "bookshelfToolbar.languageOther",
  PORTUGUESE: "bookshelfToolbar.languagePortuguese",
  RUSSIAN: "bookshelfToolbar.languageRussian",
  SPANISH: "bookshelfToolbar.languageSpanish",
  SWEDISH: "bookshelfToolbar.languageSwedish",
  UNKNOWN: "bookshelfToolbar.languageUnknown",
} as const;

interface BookshelfToolbarProps {
  filters: {
    year?: string;
    genre?: string;
    language?: string;
    status?: string;
    searchQuery?: string;
    sort?: string;
  };
  availableYears: string[];
  availableGenres?: string[];
  availableLanguages?: string[];
  onFilterChange: (field: string, value: string | boolean) => void;
  onSearchChange: (query: string) => void;
  onSortChange: (field: string) => void;
  clearFilters: () => void;
}

export const BookshelfToolbar: FC<BookshelfToolbarProps> = ({
  filters,
  availableYears,
  availableGenres = [],
  availableLanguages = [],
  onFilterChange,
  onSearchChange,
  onSortChange,
  clearFilters,
}) => {
  const { t } = useLanguage();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("bookshelfToolbar.filtersAndSorting")}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <Input
          type="text"
          value={filters.searchQuery || ""}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={t("bookshelfToolbar.searchPlaceholder")}
          className="flex-1 min-w-[260px]"
        />
        <div className="flex flex-wrap gap-2">
          <Select
            value={filters.year || ""}
            onValueChange={(value) =>
              onFilterChange("year", value === ALL_VALUES ? "" : value)
            }
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder={t("bookshelfToolbar.yearFinished")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_VALUES}>
                {t("bookshelfToolbar.allYears")}
              </SelectItem>
              {availableYears.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={filters.genre || ""}
            onValueChange={(value) =>
              onFilterChange("genre", value === ALL_VALUES ? "" : value)
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t("bookshelfToolbar.allGenres")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_VALUES}>
                {t("bookshelfToolbar.allGenres")}
              </SelectItem>
              {availableGenres.map((genre) => (
                <SelectItem key={genre} value={genre}>
                  {t(
                    GENRE_TRANSLATION_KEYS[
                      genre as keyof typeof GENRE_TRANSLATION_KEYS
                    ],
                  )}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={filters.language || ""}
            onValueChange={(value) =>
              onFilterChange("language", value === ALL_VALUES ? "" : value)
            }
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder={t("bookshelfToolbar.allLanguages")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_VALUES}>
                {t("bookshelfToolbar.allLanguages")}
              </SelectItem>
              {availableLanguages.map((language) => (
                <SelectItem key={language} value={language}>
                  {t(
                    LANGUAGE_TRANSLATION_KEYS[
                      language as keyof typeof LANGUAGE_TRANSLATION_KEYS
                    ],
                  )}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={filters.status || ""}
            onValueChange={(value) =>
              onFilterChange("status", value === ALL_VALUES ? "" : value)
            }
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder={t("bookshelfToolbar.allStatuses")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_VALUES}>
                {t("bookshelfToolbar.allStatuses")}
              </SelectItem>
              <SelectItem value="WISHLIST">
                {t("bookshelfToolbar.statusWishlist")}
              </SelectItem>
              <SelectItem value="READING">
                {t("bookshelfToolbar.statusReading")}
              </SelectItem>
              <SelectItem value="COMPLETED">
                {t("bookshelfToolbar.statusCompleted")}
              </SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={filters.sort || ""}
            onValueChange={(value) =>
              onSortChange(value === ALL_VALUES ? "" : value)
            }
          >
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder={t("bookshelfToolbar.sortBy")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_VALUES}>
                {t("bookshelfToolbar.noSorting")}
              </SelectItem>
              <SelectItem value="favoritesFirst">
                {t("bookshelfToolbar.sortFavoritesFirst")}
              </SelectItem>
              <SelectItem value="ratingAsc">
                {t("bookshelfToolbar.sortByRatingAsc")}
              </SelectItem>
              <SelectItem value="ratingDesc">
                {t("bookshelfToolbar.sortByRatingDesc")}
              </SelectItem>
              <SelectItem value="finishedAtAsc">
                {t("bookshelfToolbar.sortFinishedAtAsc")}
              </SelectItem>
              <SelectItem value="finishedAtDesc">
                {t("bookshelfToolbar.sortFinishedAtDesc")}
              </SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={clearFilters}
            variant="outline"
            className="text-muted-foreground hover:cursor-pointer"
          >
            {t("bookshelfToolbar.clearFilters")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
