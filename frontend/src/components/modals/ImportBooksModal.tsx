import { useState, type FC } from "react";
import { toast } from "sonner";
import { ModalBase } from "./ModalBase";
import { importBooksToBookshelf } from "../../api/bookshelves";
import { useLanguage } from "../../hooks/useLanguage";
import { useModal } from "../../hooks/useModal";
import { useMyBookshelf } from "../../hooks/useMyBookshelf";
import { Button } from "@/components/ui/button";
import {
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export const ImportBooksModal: FC = () => {
  const { t } = useLanguage();
  const { closeModal } = useModal();
  const { bookshelf, editToken, refreshBookshelf } = useMyBookshelf();
  const [jsonInput, setJsonInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImport = async () => {
    if (!bookshelf || !editToken) {
      toast.error(t("toast.importMissingBookshelfOrToken"));
      closeModal();
      return;
    }
    if (!jsonInput.trim()) {
      toast.warning(t("toast.nothingToImport"));
      return;
    }

    try {
      let parsedData;
      try {
        parsedData = JSON.parse(jsonInput);
      } catch (error) {
        console.error("Error parsing JSON input:", error);
        toast.error(t("toast.invalidJsonFormat"));
        return;
      }

      setLoading(true);
      const importedBookCount = await importBooksToBookshelf(
        bookshelf.publicId,
        editToken,
        parsedData,
      );
      toast.success(`
        ${t("toast.booksImportedSuccessfully")} (${importedBookCount} ${t("common.books")})`);
      await refreshBookshelf();
      closeModal();
    } catch (error) {
      console.error("Error during import:", error);
      toast.error(t("toast.errorOccurredWhileImportingBooks"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalBase>
      <DialogHeader>
        <DialogTitle className="text-center text-lg text-foreground">
          {t("modal.importBooksTitle")}
        </DialogTitle>
        <DialogDescription className="text-center text-muted-foreground">
          {t("modal.importBooksDescription")}
        </DialogDescription>
      </DialogHeader>
      {loading ? (
        <div
          role="status"
          aria-live="polite"
          className="flex flex-col items-center justify-center py-10 gap-3"
        >
          <div className="h-10 w-10 border-4 border-muted-foreground border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">{t("common.loading")}</p>
        </div>
      ) : (
        <>
          <Textarea
            value={jsonInput}
            onChange={(event) => setJsonInput(event.target.value)}
            placeholder={t("placeholders.pasteExportedJsonHere")}
            rows={10}
            className="w-full h-64 border rounded-md p-2 font-mono bg-muted text-foreground mt-4"
            disabled={loading}
          />
          <div className="flex justify-end gap-3 mt-4">
            <Button
              type="button"
              variant="outline"
              className="hover:cursor-pointer"
              onClick={closeModal}
              disabled={loading}
            >
              {t("button.cancel")}
            </Button>
            <Button
              type="button"
              variant="default"
              onClick={handleImport}
              disabled={loading}
              className="hover:cursor-pointer"
            >
              {t("button.importBooks")}
            </Button>
          </div>
        </>
      )}
    </ModalBase>
  );
};
