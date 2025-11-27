import { type FC, type ReactNode } from "react";

interface SectionTitleProps {
  children: ReactNode;
}

export const SectionTitle: FC<SectionTitleProps> = ({ children }) => {
  return (
    <div className="flex items-center justify-center w-full">
      <div className="flex-grow h-px bg-gray-200"></div>
      <h3 className="px-4 text-md uppercase tracking-wide text-foreground whitespace-nowrap">
        {children}
      </h3>
      <div className="flex-grow h-px bg-gray-200"></div>
    </div>
  );
};
