import { Outlet } from "react-router-dom";
import Logo from "@/assets/img/logo.jpg";

const AuthLayout = () => {
  return (
    <div className="grid h-screen w-full grid-cols-2 items-start justify-start overflow-hidden">
      <div className="col-span-1 flex h-full w-full items-center justify-center">
        <img src={Logo} alt="logo" className="h-full w-full object-cover" />
      </div>
      <div className="h-full w-full">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
