import { type FC } from "react";
import { useLanguage } from "../../hooks/useLanguage";

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
    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
      <input
        type="text"
        value={filters.searchQuery || ""}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder={t("bookshelfToolbar.searchPlaceholder")}
        className="flex-1 border border-gray-300 rounded-md p-2 text-sm text-gray-800 shadow-sm hover:border-gray-400 transition"
      />
      <div className="flex flex-wrap gap-2">
        <select
          value={filters.genre || ""}
          onChange={(event) => onFilterChange("genre", event.target.value)}
          className="border border-gray-300 rounded-md p-2 text-sm shadow-sm hover:border-gray-400 transition"
        >
          <option value="">{t("bookshelfToolbar.allGenres")}</option>
          <option value="UNKNOWN">{t("bookshelfToolbar.genreUnknown")}</option>
          <option value="FICTION">{t("bookshelfToolbar.genreFiction")}</option>
          <option value="NON-FICTION">
            {t("bookshelfToolbar.genreNonFiction")}
          </option>
          <option value="SCI-FI">{t("bookshelfToolbar.genreSciFi")}</option>
          <option value="FANTASY">{t("bookshelfToolbar.genreFantasy")}</option>
          <option value="BIOGRAPHY">
            {t("bookshelfToolbar.genreBiography")}
          </option>
          <option value="HISTORY">{t("bookshelfToolbar.genreHistory")}</option>
          <option value="MYSTERY">{t("bookshelfToolbar.genreMystery")}</option>
          <option value="THRILLER">
            {t("bookshelfToolbar.genreThriller")}
          </option>
          <option value="ROMANCE">{t("bookshelfToolbar.genreRomance")}</option>
          <option value="SCIENCE">{t("bookshelfToolbar.genreScience")}</option>
          <option value="TECHNOLOGY">
            {t("bookshelfToolbar.genreTechnology")}
          </option>
          <option value="OTHER">{t("bookshelfToolbar.genreOther")}</option>
        </select>
        <select
          value={filters.language || ""}
          onChange={(event) => onFilterChange("language", event.target.value)}
          className="border border-gray-300 rounded-md p-2 text-sm shadow-sm hover:border-gray-400 transition"
        >
          <option value="">{t("bookshelfToolbar.allLanguages")}</option>
          <option value="UNKNOWN">
            {t("bookshelfToolbar.languageUnknown")}
          </option>
          <option value="ENGLISH">
            {t("bookshelfToolbar.languageEnglish")}
          </option>
          <option value="FINNISH">
            {t("bookshelfToolbar.languageFinnish")}
          </option>
          <option value="GERMAN">{t("bookshelfToolbar.languageGerman")}</option>
          <option value="FRENCH">{t("bookshelfToolbar.languageFrench")}</option>
          <option value="SPANISH">
            {t("bookshelfToolbar.languageSpanish")}
          </option>
          <option value="SWEDISH">
            {t("bookshelfToolbar.languageSwedish")}
          </option>
          <option value="ITALIAN">
            {t("bookshelfToolbar.languageItalian")}
          </option>
          <option value="JAPANESE">
            {t("bookshelfToolbar.languageJapanese")}
          </option>
          <option value="PORTUGUESE">
            {t("bookshelfToolbar.languagePortuguese")}
          </option>
          <option value="RUSSIAN">
            {t("bookshelfToolbar.languageRussian")}
          </option>
          <option value="CHINESE">
            {t("bookshelfToolbar.languageChinese")}
          </option>
          <option value="HINDI">{t("bookshelfToolbar.languageHindi")}</option>
          <option value="ARABIC">{t("bookshelfToolbar.languageArabic")}</option>
          <option value="OTHER">{t("bookshelfToolbar.languageOther")}</option>
        </select>
        <select
          value={filters.status || ""}
          onChange={(event) => onFilterChange("status", event.target.value)}
          className="border border-gray-300 rounded-md p-2 text-sm shadow-sm hover:border-gray-400 transition"
        >
          <option value="">{t("bookshelfToolbar.allStatuses")}</option>
          <option value="WISHLIST">
            {t("bookshelfToolbar.statusWishlist")}
          </option>
          <option value="READING">{t("bookshelfToolbar.statusReading")}</option>
          <option value="COMPLETED">
            {t("bookshelfToolbar.statusCompleted")}
          </option>
        </select>
        <select
          value={filters.sort || ""}
          onChange={(event) => onSortChange(event.target.value)}
          className="border border-gray-300 rounded-md p-2 text-sm shadow-sm hover:border-gray-400 transition"
        >
          <option value="">{t("bookshelfToolbar.sortBy")}</option>
          <option value="favoritesFirst">
            {t("bookshelfToolbar.sortFavoritesFirst")}
          </option>
          <option value="ratingAsc">
            {t("bookshelfToolbar.sortByRatingAsc")}
          </option>
          <option value="ratingDesc">
            {t("bookshelfToolbar.sortByRatingDesc")}
          </option>
          <option value="finishedAtAsc">
            {t("bookshelfToolbar.sortFinishedAtAsc")}
          </option>
          <option value="finishedAtDesc">
            {t("bookshelfToolbar.sortFinishedAtDesc")}
          </option>
        </select>
        <button
          onClick={clearFilters}
          className="border border-gray-300 text-gray-600 px-3 py-2 rounded-md text-sm font-medium shadow-sm hover:bg-gray-100 active:scale-[0.98] transition-all"
        >
          {t("bookshelfToolbar.clearFilters")}
        </button>
      </div>
    </div>
  );
};
