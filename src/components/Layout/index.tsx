import { FC, PropsWithChildren } from "react";
import { Outlet } from "react-router-dom";

export const Layout: FC<PropsWithChildren> = () => {
  return (
    <div>
      <div>Hello worlddd!</div>
      <Outlet />
    </div>
  );
};
