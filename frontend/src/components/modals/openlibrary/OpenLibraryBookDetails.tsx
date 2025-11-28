import { useState, type FC } from "react";
import { useLanguage } from "../../../hooks/useLanguage";
import type { OpenLibraryImportBookDetails } from "../../../types/openlibrary";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

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
      <DialogHeader>
        <DialogTitle className="text-center text-lg text-foreground text-shadow-md">
          {t("searchOpenLibrary.confirmImportTitle")}
        </DialogTitle>
        <DialogDescription className="text-center text-muted-foreground mb-3">
          {t("searchOpenLibrary.confirmImportDescription")}
        </DialogDescription>
      </DialogHeader>
      <Card className="flex gap-4 p-3 mt-3 bg-card border-border mb-2">
        <div className="flex flex-row">
          {selectedBook.coverUrl ? (
            <img
              src={selectedBook.coverUrl}
              alt={selectedBook.title ?? t("common.unknown")}
              className="w-30 h-42 object-cover rounded shadow"
            />
          ) : (
            <div className="w-30 h-42 bg-gray-200 rounded flex items-center justify-center">
              <p className="text-2xl text-muted-foreground">
                {t("common.placeholderQuestionMark")}
              </p>
            </div>
          )}

          <div className="flex-1 flex flex-col justify-center align-center text-center">
            <p className="font-semibold text-foreground text-lg">
              {selectedBook.title}
            </p>
            {selectedBook.authors && (
              <p className="text-foreground">
                {selectedBook.authors.join(", ")}
              </p>
            )}
            {selectedBook.publishYear && (
              <p className="text-muted-foreground">
                {t("searchOpenLibrary.firstPublished")}:{" "}
                {selectedBook.publishYear}
              </p>
            )}
          </div>
        </div>
        <div
          className={`${selectedBook.description ? "border border-muted-foreground" : ""} rounded-md px-2`}
        >
          {selectedBook.description ? (
            <p className="max-h-100 overflow-y-auto text-foreground text-sm leading-relaxed break-words whitespace-pre-wrap">
              {selectedBook.description}
            </p>
          ) : (
            <p className="italic text-center text-muted-foreground mb-4">
              {t("bookPage.noDescription")}
            </p>
          )}
        </div>
      </Card>

      <div className="mb-4 border border-muted-foreground rounded-md p-3">
        <h4 className="font-medium text-muted-foreground mb-2">
          {t("searchOpenLibrary.selectFieldsToImport")}
        </h4>
        <div className="grid grid-cols-2 gap-y-1 text-sm">
          {(
            Object.entries(selectedFields) as [
              keyof typeof selectedFields,
              boolean,
            ][]
          ).map(([key, checked]) => (
            <div key={key} className="flex items-center gap-2 select-none">
              <Checkbox
                id={`field-${key}`}
                checked={checked}
                onCheckedChange={() =>
                  setSelectedFields((prev) => ({
                    ...prev,
                    [key]: !prev[key],
                  }))
                }
                className="cursor-pointer"
              />
              <Label
                htmlFor={`field-${key}`}
                className="text-sm text-muted-foreground capitalize cursor-pointer"
              >
                {t(FIELD_TRANSLATION_KEYS[key])}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between gap-3">
        <Button
          type="button"
          variant="outline"
          className="hover:cursor-pointer"
          onClick={onBack}
        >
          {t("button.back")}
        </Button>
        <Button
          type="button"
          variant="default"
          className="hover:cursor-pointer"
          onClick={handleConfirm}
        >
          {t("button.importBook")}
        </Button>
      </div>
    </div>
  );
};
