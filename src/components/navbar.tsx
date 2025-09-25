import ModeToggle from "./mode-toggle";
import { SidebarTrigger } from "./ui/sidebar";

const Navbar = () => {
  return (
    <nav className="flex h-16 w-full flex-row items-center justify-between border-b p-3.5">
      <SidebarTrigger />
      <ModeToggle />
    </nav>
  );
};

export default Navbar;
