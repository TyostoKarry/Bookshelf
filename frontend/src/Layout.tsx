import type { FC } from "react";
import { Outlet } from "react-router-dom";
import { ModalRoot } from "./components/ModalRoot";
import { Topbar } from "./components/Topbar";
import { useModal } from "./hooks/useModal";

export const Layout: FC = () => {
  const { modalState } = useModal();
  return (
    <div className="flex flex-col h-screen">
      <Topbar />
      <div className="flex-grow overflow-auto">
        <Outlet />
      </div>
      <ModalRoot modalState={modalState} />
    </div>
  );
};
