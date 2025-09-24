import { BrainCog } from "lucide-react";
import MaxWidthWrapper from "./max-width-wrapper";
import ModeToggle from "./mode-toggle";

const Navbar = () => {
  return (
    <nav className="h-16 w-full border-b">
      <MaxWidthWrapper className="flex items-center justify-between p-3.5">
        <BrainCog className="size-8" />
        <ModeToggle />
      </MaxWidthWrapper>
    </nav>
  );
};

export default Navbar;
