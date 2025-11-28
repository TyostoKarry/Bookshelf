import { CopyIcon, DownloadIcon } from "lucide-react";
import { useEffect, useState, type FC } from "react";
import { toast } from "sonner";
import { ModalBase } from "./ModalBase";
import { useModal } from "../../hooks/useModal";
import { exportBooksFromBookshelf } from "@/api/bookshelves";
import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/hooks/useLanguage";

interface ExportBooksModalProps {
  bookshelfPublicId: string;
}

export const ExportBooksModal: FC<ExportBooksModalProps> = ({
  bookshelfPublicId,
}) => {
  const { t } = useLanguage();
  const { closeModal } = useModal();
  const [json, setJson] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchExportData = async () => {
      setLoading(true);
      try {
        const response = await exportBooksFromBookshelf(bookshelfPublicId);
        setJson(JSON.stringify(response, null, 2));
      } catch (error) {
        console.error(error);
        toast.error(t("toast.errorOccurredWhileExportingBooks"));
        closeModal();
      } finally {
        setLoading(false);
      }
    };

    fetchExportData();
  }, [bookshelfPublicId, closeModal, t]);

  const handleCopy = async () => {
    if (!json) {
      toast.warning(t("toast.nothingToCopy"));
      return;
    }
    try {
      await navigator.clipboard.writeText(json);
      toast.success(t("toast.exportDataCopiedSuccessfully"));
    } catch (err) {
      console.error("Failed to copy export data to clipboard:", err);
      toast.error(t("toast.exportDataCopyFailed"));
    }
  };

  const handleDownload = () => {
    if (!json) {
      toast.warning(t("toast.nothingToDownload"));
      return;
    }
    try {
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `bookshelf_${bookshelfPublicId}_export.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success(t("toast.exportDataDownloadedSuccessfully"));
    } catch (err) {
      console.error("Failed to download export data:", err);
      toast.error(t("toast.exportDataDownloadFailed"));
    }
  };

  return (
    <ModalBase>
      <DialogHeader>
        <DialogTitle className="text-center text-lg text-foreground">
          {t("modal.exportBooksTitle")}
        </DialogTitle>
        <DialogDescription className="text-center text-muted-foreground">
          {t("modal.exportBooksDescription")}
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
        <div className="relative">
          <Textarea
            value={json ?? ""}
            readOnly
            className="w-full h-64 border rounded-md p-2 font-mono bg-muted text-foreground"
            disabled={loading}
          />
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={handleCopy}
            className="absolute top-2 right-4 hover:cursor-pointer rounded hover:bg-foreground/20 active:bg-foreground/10"
            title={t("button.copyExportDataToClipboard")}
          >
            <CopyIcon className="w-4 h-4 text-muted-foreground" />
          </Button>
        </div>
      )}
      <div className="flex justify-between gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={handleDownload}
          className="flex items-center gap-2 hover:cursor-pointer"
        >
          <DownloadIcon className="w-4 h-4" />
          {t("button.downloadExportData")}
        </Button>
        <Button
          type="button"
          variant="default"
          className="hover:cursor-pointer"
          onClick={() => closeModal()}
        >
          {t("button.close")}
        </Button>
      </div>
    </ModalBase>
  );
};
