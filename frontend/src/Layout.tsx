import type { FC } from "react";
import { Outlet } from "react-router-dom";

export const Layout: FC = () => {
  return (
    <div className="flex flex-col h-screen">
      <Outlet />
    </div>
  );
};
