import { createRoot } from "react-dom/client";
import "@/assets/css/index.css";
import App from "./app.tsx";
import Providers from "./components/providers/providers.tsx";

createRoot(document.getElementById("root")!).render(
  <Providers>
    <App />
  </Providers>,
);
