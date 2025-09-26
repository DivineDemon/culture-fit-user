import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { RootState } from "@/types/global";
import AppSidebar from "../app-sidebar";
import Navbar from "../navbar";

const GlobalLayout = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.global);

  useEffect(() => {
    if (!user) {
      toast.error("Please login to continue");
      navigate("/");
    }
  }, [user]);

  return (
    <div className="flex h-screen w-full flex-row items-start justify-start">
      <AppSidebar />
      <div className="flex h-full flex-1 flex-col items-start justify-start">
        <Navbar />
        <Outlet />
      </div>
    </div>
  );
};

export default GlobalLayout;
