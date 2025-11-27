import { Search, Library, ChevronDown } from "lucide-react";
import { type FC } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useLanguage } from "../../hooks/useLanguage";
import { useModal } from "../../hooks/useModal";
import { useMyBookshelf } from "../../hooks/useMyBookshelf";
import { deleteBookshelf } from "@/api/bookshelves";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Topbar: FC = () => {
  const { t } = useLanguage();
  const { bookshelf, editToken, clearBookshelf } = useMyBookshelf();
  const { openModal, closeModal } = useModal();
  const navigate = useNavigate();

  const handleDeleteBookshelf = () => {
    if (!bookshelf) {
      toast.error(t("toast.noBookshelfToDelete"));
      return;
    }
    openModal("CONFIRMATION", {
      title: t("modal.confirmationDeleteBookshelfTitle"),
      message: t("modal.confirmationDeleteBookshelfMessage"),
      confirmLabel: t("button.delete"),
      confirmColor: "danger",
      onConfirm: async () => {
        if (!editToken || !clearBookshelf) {
          toast.error(t("toast.errorOccurredWhileDeletingBookshelf"));
          closeModal();
          return;
        }
        try {
          await deleteBookshelf(bookshelf.publicId, editToken);
          toast.success(t("toast.bookshelfDeletedSuccessfully"));
          clearBookshelf();
          closeModal();
          navigate("/");
        } catch (error) {
          console.error(error);
          toast.error(t("toast.failedToDeleteBookshelf"));
          closeModal();
        }
      },
    });
  };

  return (
    <nav className="flex items-center justify-between h-16 px-4 bg-primary">
      <Link
        to="/"
        className="text-foreground text-2xl text-shadow-sm font-bold"
      >
        {t("common.appName")}
      </Link>
      <Button
        variant="secondary"
        onClick={() => openModal("ENTER_ID", {})}
        className="flex items-center gap-2 bg-muted text-foreground hover:bg-muted/80 hover:cursor-pointer"
      >
        <Search className="w-4 h-4 text-foreground" />
        {t("button.visitBookshelf")}
      </Button>
      {editToken && bookshelf ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="secondary"
              className="flex items-center gap-2 bg-muted text-foreground hover:bg-muted/80 hover:cursor-pointer"
            >
              <Library className="w-4 h-4 text-foreground" />
              {t("button.myBookshelf")}
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => navigate("/my/bookshelf")}
              className="justify-end text-end"
            >
              {t("button.openMyBookshelf")}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => clearBookshelf()}
              className="justify-end text-end"
            >
              {t("button.forgetThisBookshelf")}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDeleteBookshelf}
              className="justify-end text-end"
            >
              {t("button.deleteBookshelf")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button
          variant="secondary"
          onClick={() => openModal("ENTER_TOKEN", {})}
          className="bg-muted text-foreground hover:bg-muted/80 hover:cursor-pointer"
        >
          {t("button.openMyBookshelf")}
        </Button>
      )}
    </nav>
  );
};
