import { useEffect } from "react";
import Scheduler from "./components/Scheduler";
import GitHubFooter from "./components/GitHubFooter";
import "./App.css";

function App() {
  useEffect(() => {
    document.title = "CPU Scheduler";
  }, []);
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <div className="m-auto p-6">
        <Scheduler />
      </div>
      <GitHubFooter />
    </div>
  );
}

export default App;
