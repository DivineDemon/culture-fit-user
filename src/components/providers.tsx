import type { ReactNode } from "react";
import ThemeProvider from "./theme-provider";
import { Toaster } from "./ui/sonner";

interface ProvidersProps {
  children: ReactNode;
}

const Providers = ({ children }: ProvidersProps) => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Toaster richColors={true} duration={1500} />
      {children}
    </ThemeProvider>
  );
};

export default Providers;
