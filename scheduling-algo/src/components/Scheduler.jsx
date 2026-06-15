import { useState, useEffect } from "react";
import ProcessForm from "./ProcessForm";
import SRJF from "./SRJF";
import FCFS from "./FCFS";
import RR from "./RR.jsx";
import PriorityNonPreemptive from "./PriorityNonPreemptive.jsx";
import PriorityScheduling from "./PriorityScheduling";
import ProcessDetails from "./ProcessDetails";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SJF from "./SJF";
import { Cpu, Settings2, Sparkles, Sun, Moon } from "lucide-react";

const Scheduler = () => {
  const [algorithm, setAlgorithm] = useState("FCFS");
  const [processes, setProcesses] = useState([]);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });

  // Apply theme class to document root
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const addProcess = (process) => {
    setProcesses([...processes, process]);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-transparent text-slate-800 dark:text-slate-100 transition-all font-poppins selection:bg-indigo-500 selection:text-white pb-12">
      <ToastContainer 
        theme={theme}
        toastClassName="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-slate-200 rounded-xl"
        progressClassName="bg-indigo-500"
      />

      {/* Hero Header Section */}
      <div className="w-full max-w-6xl text-center py-10 mb-8 border-b border-slate-200 dark:border-zinc-800/80 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[100px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        
        {/* Floating Theme Toggle Switch on Header */}
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={toggleTheme}
            className="p-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/60 hover:bg-slate-100 dark:hover:bg-zinc-800/80 transition-all text-slate-600 dark:text-slate-300 shadow-md flex items-center gap-2"
            aria-label="Toggle entire page theme"
          >
            {theme === "dark" ? (
              <>
                <Sun className="w-4 h-4 text-yellow-400" />
                <span className="text-xs font-semibold">Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-semibold">Dark Mode</span>
              </>
            )}
          </button>
        </div>

        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-2 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-xl shadow-lg shadow-indigo-500/20 text-white">
            <Cpu className="w-8 h-8 animate-pulse" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 dark:from-white via-slate-700 dark:via-slate-200 to-slate-500 dark:to-slate-400">
            CPU OS Scheduler
          </h1>
        </div>
        <p className="text-slate-500 dark:text-zinc-400 max-w-xl mx-auto text-sm leading-relaxed">
          A premium OS CPU Scheduling Algorithm simulator. Build processes, visualise execution sequences, scrub the playback timeline, and evaluate performance indicators instantly.
        </p>
      </div>

      {/* Core Setup Controls */}
      <div className="w-full max-w-6xl space-y-8">
        {/* Selection bar */}
        <div className="border border-slate-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/40 backdrop-blur-md p-6 rounded-2xl shadow-md dark:shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Settings2 className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">Simulation Settings</h2>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <label className="text-sm font-medium text-slate-500 dark:text-zinc-400 whitespace-nowrap">Scheduling Algorithm:</label>
            <select
              className="w-full md:w-[280px] bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl py-2 px-3 text-sm font-semibold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer shadow-sm dark:shadow-inner"
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value)}
            >
              <option value="FCFS">First Come First Serve (FCFS)</option>
              <option value="SJF">Shortest Job First (SJF)</option>
              <option value="SRTF">Shortest Remaining Time First (SRTF)</option>
              <option value="RR">Round Robin (RR)</option>
              <option value="Priority (Non-Preemptive)">Priority Scheduling (Non-Preemptive)</option>
              <option value="Priority (Preemptive)">Priority Scheduling (Preemptive)</option>
            </select>
          </div>
        </div>

        {/* Process Management Arena */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Left: Input Form */}
          <div className="md:col-span-5 lg:col-span-4">
            <ProcessForm processes={processes} addProcess={addProcess} algorithm={algorithm} />
          </div>

          {/* Right: Loaded Process Badges */}
          <div className="md:col-span-7 lg:col-span-8">
            <ProcessDetails processes={processes} setProcesses={setProcesses} />
          </div>
        </div>

        {/* Simulator Output Arena */}
        <div className="pt-4 border-t border-slate-200 dark:border-zinc-900">
          <div className="flex items-center gap-2 mb-6 text-slate-400 dark:text-zinc-500">
            <Sparkles className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
            <span className="text-xs font-semibold uppercase tracking-wider">Visual Execution Output</span>
          </div>
          
          <div>
            {algorithm === "FCFS" && <FCFS processes={processes} />}
            {algorithm === "SJF" && <SJF processes={processes} />}
            {algorithm === "SRTF" && <SRJF processes={processes} />}
            {algorithm === "RR" && <RR processes={processes} />}
            {algorithm === "Priority (Non-Preemptive)" && <PriorityNonPreemptive processes={processes} />}
            {algorithm === "Priority (Preemptive)" && <PriorityScheduling processes={processes} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scheduler;