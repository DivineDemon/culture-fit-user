import AppSidebar from "./components/app-sidebar";
import ChatInterface from "./components/chat-interface";
import Navbar from "./components/navbar";

const App = () => {
  return (
    <div className="flex h-screen w-full flex-row items-start justify-start">
      <AppSidebar />
      <div className="flex flex-1 flex-col items-start justify-start">
        <Navbar />
        <ChatInterface />
      </div>
    </div>
  );
};

export default App;
