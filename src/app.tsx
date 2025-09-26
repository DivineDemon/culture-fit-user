import { Route, Routes } from "react-router-dom";
import AuthLayout from "./components/layouts/auth-layout";
import GlobalLayout from "./components/layouts/global-layout";
import Account from "./pages/account";
import Chat from "./pages/chat";
import Login from "./pages/login";

const App = () => {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route index element={<Login />} />
      </Route>
      <Route element={<GlobalLayout />}>
        <Route path="/chat" element={<Chat />} />
        <Route path="/account" element={<Account />} />
      </Route>
    </Routes>
  );
};

export default App;
