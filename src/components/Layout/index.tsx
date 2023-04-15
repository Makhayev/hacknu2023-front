import { FC, PropsWithChildren } from "react";
import { Outlet } from "react-router-dom";

export const Layout: FC<PropsWithChildren> = () => {
  return (
    <div className="tw-w-screen tw-h-screen">
      <Outlet />
    </div>
  );
};
