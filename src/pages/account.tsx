import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Account = () => {
  return (
    <div className="flex h-full w-full flex-col items-start justify-start p-5">
      <div className="flex w-full items-start justify-start gap-5">
        <Link
          to="/chat"
          className={cn(
            buttonVariants({
              variant: "outline",
              size: "icon",
            }),
          )}
        >
          <ArrowLeft />
        </Link>
        <div className="flex flex-1 flex-col items-start justify-start gap-2">
          <span className="flex-1 text-left font-semibold text-[30px] leading-[30px]">Account</span>
          <span className="flex-1 text-left text-[14px] text-muted-foreground leading-[14px]">
            Manage your account settings and preferences.
          </span>
        </div>
      </div>
    </div>
  );
};

export default Account;
