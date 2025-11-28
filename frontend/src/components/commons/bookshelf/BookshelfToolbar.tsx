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

interface BookshelfToolbarProps {
  filters: {
    genre?: string;
    language?: string;
    status?: string;
    searchQuery?: string;
    sort?: string;
  };
  onFilterChange: (field: string, value: string | boolean) => void;
  onSearchChange: (query: string) => void;
  onSortChange: (field: string) => void;
  clearFilters: () => void;
}

export const BookshelfToolbar: FC<BookshelfToolbarProps> = ({
  filters,
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
            value={filters.genre || ""}
            onValueChange={(value) => onFilterChange("genre", value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t("bookshelfToolbar.allGenres")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="UNKNOWN">
                {t("bookshelfToolbar.genreUnknown")}
              </SelectItem>
              <SelectItem value="FICTION">
                {t("bookshelfToolbar.genreFiction")}
              </SelectItem>
              <SelectItem value="NON-FICTION">
                {t("bookshelfToolbar.genreNonFiction")}
              </SelectItem>
              <SelectItem value="SCI-FI">
                {t("bookshelfToolbar.genreSciFi")}
              </SelectItem>
              <SelectItem value="FANTASY">
                {t("bookshelfToolbar.genreFantasy")}
              </SelectItem>
              <SelectItem value="BIOGRAPHY">
                {t("bookshelfToolbar.genreBiography")}
              </SelectItem>
              <SelectItem value="HISTORY">
                {t("bookshelfToolbar.genreHistory")}
              </SelectItem>
              <SelectItem value="MYSTERY">
                {t("bookshelfToolbar.genreMystery")}
              </SelectItem>
              <SelectItem value="THRILLER">
                {t("bookshelfToolbar.genreThriller")}
              </SelectItem>
              <SelectItem value="ROMANCE">
                {t("bookshelfToolbar.genreRomance")}
              </SelectItem>
              <SelectItem value="SCIENCE">
                {t("bookshelfToolbar.genreScience")}
              </SelectItem>
              <SelectItem value="TECHNOLOGY">
                {t("bookshelfToolbar.genreTechnology")}
              </SelectItem>
              <SelectItem value="OTHER">
                {t("bookshelfToolbar.genreOther")}
              </SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={filters.language || ""}
            onValueChange={(value) => onFilterChange("language", value)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder={t("bookshelfToolbar.allLanguages")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="UNKNOWN">
                {t("bookshelfToolbar.languageUnknown")}
              </SelectItem>
              <SelectItem value="ENGLISH">
                {t("bookshelfToolbar.languageEnglish")}
              </SelectItem>
              <SelectItem value="FINNISH">
                {t("bookshelfToolbar.languageFinnish")}
              </SelectItem>
              <SelectItem value="GERMAN">
                {t("bookshelfToolbar.languageGerman")}
              </SelectItem>
              <SelectItem value="FRENCH">
                {t("bookshelfToolbar.languageFrench")}
              </SelectItem>
              <SelectItem value="SPANISH">
                {t("bookshelfToolbar.languageSpanish")}
              </SelectItem>
              <SelectItem value="SWEDISH">
                {t("bookshelfToolbar.languageSwedish")}
              </SelectItem>
              <SelectItem value="ITALIAN">
                {t("bookshelfToolbar.languageItalian")}
              </SelectItem>
              <SelectItem value="JAPANESE">
                {t("bookshelfToolbar.languageJapanese")}
              </SelectItem>
              <SelectItem value="PORTUGUESE">
                {t("bookshelfToolbar.languagePortuguese")}
              </SelectItem>
              <SelectItem value="RUSSIAN">
                {t("bookshelfToolbar.languageRussian")}
              </SelectItem>
              <SelectItem value="CHINESE">
                {t("bookshelfToolbar.languageChinese")}
              </SelectItem>
              <SelectItem value="HINDI">
                {t("bookshelfToolbar.languageHindi")}
              </SelectItem>
              <SelectItem value="ARABIC">
                {t("bookshelfToolbar.languageArabic")}
              </SelectItem>
              <SelectItem value="OTHER">
                {t("bookshelfToolbar.languageOther")}
              </SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={filters.status || ""}
            onValueChange={(value) => onFilterChange("status", value)}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder={t("bookshelfToolbar.allStatuses")} />
            </SelectTrigger>
            <SelectContent>
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
            onValueChange={(value) => onSortChange(value)}
          >
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder={t("bookshelfToolbar.sortBy")} />
            </SelectTrigger>
            <SelectContent>
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
