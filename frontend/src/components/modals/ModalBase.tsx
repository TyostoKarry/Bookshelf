import { type FC, type ReactNode, useEffect } from "react";
import CrossIcon from "../../assets/icons/cross.svg?react";
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
        className="relative bg-white p-6 rounded-xl shadow-xl w-full max-w-md text-center"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="absolute -top-3 -right-3 p-2 rounded-full bg-white border border-gray-300 shadow-sm hover:bg-gray-100 active:scale-95 transition"
          onClick={closeModal}
          aria-label="Close modal"
        >
          <CrossIcon className="w-4 h-4 text-gray-700" strokeWidth={4} />
        </button>
        {children}
      </div>
    </div>
  );
};
