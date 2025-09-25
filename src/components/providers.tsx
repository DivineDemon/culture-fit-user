import type { ReactNode } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "@/store";
import ThemeProvider from "./theme-provider";
import { SidebarProvider } from "./ui/sidebar";
import { Toaster } from "./ui/sonner";

interface ProvidersProps {
  children: ReactNode;
}

const Providers = ({ children }: ProvidersProps) => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <SidebarProvider>
            <Toaster richColors={true} duration={1500} />
            {children}
          </SidebarProvider>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
};

export default Providers;
