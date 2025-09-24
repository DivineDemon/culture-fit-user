import ChatInterface from "./components/chat-interface";
import Navbar from "./components/navbar";

const App = () => {
  return (
    <div className="flex h-screen w-full flex-col items-start justify-start">
      <Navbar />
      <ChatInterface />
    </div>
  );
};

export default App;
