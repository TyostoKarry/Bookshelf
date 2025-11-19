import { zodResolver } from "@hookform/resolvers/zod";
import { type FC, useEffect } from "react";
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
import { Button } from "../commons/Button";
import { FieldErrorMessage } from "../commons/FieldErrorMessage";

export const CreateBookshelfModal: FC = () => {
  const { t } = useLanguage();
  const { closeModal, openModal } = useModal();
  const { setEditToken } = useMyBookshelf();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<BookshelfForm>({
    resolver: zodResolver(bookshelfFormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

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

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };
    document.addEventListener("keydown", handleEscapeKey);
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [closeModal]);

  return (
    <ModalBase>
      <h2 className="text-center text-lg text-text text-shadow-md mb-4">
        {t("modal.createBookshelf")}
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-800 text-shadow-sm mb-1">
            {t("modal.nameOfBookshelf")}
          </label>
          <input
            type="text"
            {...register("name")}
            className={`w-full rounded-md  border ${errors.name ? "border-red-500" : "border-gray-300"} shadow-sm px-3 py-2 text-sm mb-1`}
            placeholder={t("modal.namePlaceholder")}
          />
          <div className="flex flex-row justify-between">
            <FieldErrorMessage message={errors.name?.message} />
            <p
              className={`text-xs ${nameValue.length <= 100 ? "text-gray-400" : "text-red-400"} text-right`}
            >
              {nameValue.length}/100
            </p>
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-800 text-shadow-sm mb-1">
            {t("modal.descriptionOfBookshelf")}
          </label>
          <textarea
            {...register("description")}
            className={`w-full rounded-md  border ${errors.description ? "border-red-500" : "border-gray-300"} shadow-sm px-3 py-2 text-sm resize-none`}
            placeholder={t("modal.descriptionPlaceholder")}
            rows={3}
          />
          <div className="flex flex-row justify-between">
            <FieldErrorMessage message={errors.description?.message} />
            <p
              className={`text-xs ${(descriptionValue?.length ?? 0) <= 1000 ? "text-gray-400" : "text-red-400"} text-right`}
            >
              {descriptionValue ? descriptionValue.length : 0}/1000
            </p>
          </div>
        </div>
        <div className="flex justify-end space-x-3">
          <Button
            label={t("button.cancel")}
            onClick={() => closeModal()}
            color="danger"
          />
          <Button
            label={t("button.create")}
            type="submit"
            disabled={isSubmitting}
          />
        </div>
      </form>
    </ModalBase>
  );
};
