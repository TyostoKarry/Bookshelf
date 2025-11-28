import { zodResolver } from "@hookform/resolvers/zod";
import { type FC } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ModalBase } from "./ModalBase";
import { createBookshelf } from "../../api/bookshelves";
import { useLanguage } from "../../hooks/useLanguage";
import { useModal } from "../../hooks/useModal";
import { useMyBookshelf } from "../../hooks/useMyBookshelf";
import {
  bookshelfFormSchema,
  type BookshelfForm,
} from "../../validation/bookshelfFormSchema";
import { FieldErrorMessage } from "../commons/FieldErrorMessage";
import { Button } from "@/components/ui/button";
import {
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const CreateBookshelfModal: FC = () => {
  const { t } = useLanguage();
  const { closeModal, openModal } = useModal();
  const { setEditToken } = useMyBookshelf();
  const navigate = useNavigate();

  const form = useForm<BookshelfForm>({
    resolver: zodResolver(bookshelfFormSchema),
    defaultValues: {},
  });

  const {
    reset,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = form;
  const nameValue = watch("name") ?? "";
  const descriptionValue = watch("description") ?? "";

  const onSubmit = async (data: BookshelfForm) => {
    try {
      const newBookshelf = await createBookshelf({
        name: data.name,
        description: data.description ?? null,
      });
      if (newBookshelf) {
        setEditToken(newBookshelf.editToken);
        closeModal();
        navigate("/my/bookshelf");
        openModal("TOKEN", { token: newBookshelf.editToken });
        reset();
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : t("toast.anErrorOccurred");
      toast.error(message);
      console.error("Error creating bookshelf:", error);
    }
  };

  return (
    <ModalBase>
      <DialogHeader>
        <DialogTitle className="text-center text-lg text-foreground text-shadow-md">
          {t("modal.createBookshelf")}
        </DialogTitle>
        <DialogDescription className="text-center text-muted-foreground">
          {t("modal.createBookshelfDescription")}
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <FormField
              name="name"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("modal.nameOfBookshelf")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("modal.namePlaceholder")}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex flex-row justify-between">
              <FieldErrorMessage message={errors.name?.message} />
              <p
                className={`text-xs ${nameValue.length <= 100 ? "text-muted-foreground" : "text-red-400"} text-right`}
              >
                {nameValue.length}/100
              </p>
            </div>
          </div>
          <div className="space-y-1">
            <FormField
              name="description"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("modal.descriptionOfBookshelf")}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("modal.descriptionPlaceholder")}
                      rows={3}
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex flex-row justify-between">
              <FieldErrorMessage message={errors.description?.message} />
              <p
                className={`text-xs ${(descriptionValue?.length ?? 0) <= 1000 ? "text-muted-foreground" : "text-red-400"} text-right`}
              >
                {descriptionValue ? descriptionValue.length : 0}/1000
              </p>
            </div>
          </div>
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              className="hover:cursor-pointer"
              onClick={() => closeModal()}
            >
              {t("button.cancel")}
            </Button>
            <Button
              type="submit"
              variant="default"
              className="hover:cursor-pointer"
              disabled={isSubmitting}
            >
              {t("button.create")}
            </Button>
          </div>
        </form>
      </Form>
    </ModalBase>
  );
};
