import { type FC, type ReactNode, useEffect } from "react";
import { useModal } from "../../hooks/useModal";

interface ModalBaseProps {
  children: ReactNode;
  closeOnOutsideClick?: boolean;
}

export const ModalBase: FC<ModalBaseProps> = ({
  children,
  closeOnOutsideClick = true,
}) => {
  const { closeModal } = useModal();

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", handleEscapeKey);
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [closeModal]);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
      onClick={closeOnOutsideClick ? closeModal : undefined}
    >
      <div
        className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md text-center"
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};
