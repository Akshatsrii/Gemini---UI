import ContextProvider from "./context/Context";
import Sidebar from "./components/Sidebar/Sidebar";
import Main from "./components/Main/Main";
import "./index.css"

function App() {
  return (
    <ContextProvider>
      <div className="app">
        <Sidebar />
        <Main />
      </div>
    </ContextProvider>
  );
}

export default App;
