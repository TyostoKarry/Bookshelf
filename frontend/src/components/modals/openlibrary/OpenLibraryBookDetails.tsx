import { useState, type FC } from "react";
import { useLanguage } from "../../../hooks/useLanguage";
import type { OpenLibraryImportBookDetails } from "../../../types/openlibrary";
import { Button } from "../../commons/Button";

interface OpenLibraryBookDetailsProps {
  selectedBook: OpenLibraryImportBookDetails;
  onBack: () => void;
  onConfirm: (book: OpenLibraryImportBookDetails) => void;
}

const FIELD_TRANSLATION_KEYS = {
  title: "searchOpenLibrary.titleToggle",
  authors: "searchOpenLibrary.authorsToggle",
  publishYear: "searchOpenLibrary.publishYearToggle",
  description: "searchOpenLibrary.descriptionToggle",
  coverUrl: "searchOpenLibrary.coverUrlToggle",
} as const;

export const OpenLibraryBookDetails: FC<OpenLibraryBookDetailsProps> = ({
  selectedBook,
  onBack,
  onConfirm,
}) => {
  const { t } = useLanguage();

  const [selectedFields, setSelectedFields] = useState({
    title: true,
    authors: true,
    publishYear: true,
    description: true,
    coverUrl: true,
  });

  const handleConfirm = () => {
    const filteredBook: OpenLibraryImportBookDetails = {
      key: selectedBook.key,
      title: selectedFields.title ? selectedBook.title : null,
      authors: selectedFields.authors ? selectedBook.authors : null,
      publishYear: selectedFields.publishYear ? selectedBook.publishYear : null,
      description: selectedFields.description ? selectedBook.description : null,
      coverUrl: selectedFields.coverUrl ? selectedBook.coverUrl : null,
    };

    onConfirm(filteredBook as OpenLibraryImportBookDetails);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-400 pb-4 mb-4">
        {t("searchOpenLibrary.confirmImportTitle")}
      </h3>

      <div className="flex gap-3 mb-3">
        {selectedBook.coverUrl ? (
          <img
            src={selectedBook.coverUrl}
            alt={selectedBook.title ?? t("common.unknown")}
            className="w-30 h-42 object-cover rounded shadow"
          />
        ) : (
          <div className="w-30 h-42 bg-gray-200 rounded flex items-center justify-center">
            <p className="text-2xl text-gray-400">
              {t("common.placeholderQuestionMark")}
            </p>
          </div>
        )}

        <div className="flex-1 flex flex-col justify-center">
          <p className="font-semibold text-gray-800 text-lg">
            {selectedBook.title}
          </p>
          {selectedBook.authors && (
            <p className="text-gray-700">{selectedBook.authors.join(", ")}</p>
          )}
          {selectedBook.publishYear && (
            <p className="text-gray-500">
              {t("searchOpenLibrary.firstPublished")}:{" "}
              {selectedBook.publishYear}
            </p>
          )}
        </div>
      </div>

      <div
        className={`${selectedBook.description ? "border border-gray-400" : ""} rounded-md px-2 mb-2`}
      >
        {selectedBook.description ? (
          <p className="max-h-100 overflow-y-auto text-gray-700 text-sm leading-relaxed break-words whitespace-pre-wrap">
            {selectedBook.description}
          </p>
        ) : (
          <p className="italic text-gray-400 mb-4">
            {t("bookPage.noDescription")}
          </p>
        )}
      </div>

      <div className="mb-4 border border-gray-400 rounded-md p-3">
        <h4 className="font-medium text-gray-800 mb-2">
          {t("searchOpenLibrary.selectFieldsToImport")}
        </h4>
        <div className="grid grid-cols-2 gap-y-1 text-sm">
          {(
            Object.entries(selectedFields) as [
              keyof typeof selectedFields,
              boolean,
            ][]
          ).map(([key, checked]) => (
            <label
              key={key}
              className="flex items-center gap-2 cursor-pointer select-none"
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() =>
                  setSelectedFields((prev) => ({
                    ...prev,
                    [key]: !prev[key as keyof typeof prev],
                  }))
                }
                className="cursor-pointer"
              />
              <span className="text-gray-700 capitalize">
                {t(FIELD_TRANSLATION_KEYS[key])}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-between gap-3">
        <Button label={t("button.back")} onClick={onBack} color="neutral" />
        <Button
          label={t("button.importBook")}
          onClick={handleConfirm}
          color="success"
        />
      </div>
    </div>
  );
};
