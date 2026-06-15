import { useState } from "react";
import { toast } from "react-toastify";
import { Plus, Tag, Clock, Activity, AlertCircle } from "lucide-react";

const ProcessForm = ({ processes, addProcess, algorithm }) => {
  const [process, setProcess] = useState({
    name: "",
    burstTime: "",
    arrivalTime: "",
    priority: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const trimmedName = process.name.trim();
    if (!trimmedName) {
      toast.error("Process name cannot be empty!", { position: "top-right", autoClose: 2000 });
      return;
    }
    if (processes.some((p) => p.name === trimmedName)) {
      toast.error("Process name must be unique!", { position: "top-right", autoClose: 2000 });
      return;
    }

    const burstTime = parseInt(process.burstTime);
    const arrivalTime = parseInt(process.arrivalTime);
    const priority = parseInt(process.priority);

    if (isNaN(burstTime) || burstTime <= 0 || isNaN(arrivalTime) || arrivalTime < 0) {
      toast.error("Please enter valid Burst Time and Arrival Time!", { position: "top-right", autoClose: 2000 });
      return;
    }

    const isPriorityAlgo = ["Priority (Preemptive)", "Priority (Non-Preemptive)"].includes(algorithm);
    if (isPriorityAlgo && (isNaN(priority) || priority < 0)) {
      toast.error("Please enter a valid Priority!", { position: "top-right", autoClose: 2000 });
      return;
    }

    // Add the process with parsed values
    addProcess({
      name: trimmedName,
      burstTime: burstTime.toString(),
      arrivalTime: arrivalTime.toString(),
      priority: isPriorityAlgo ? priority.toString() : "",
    });

    toast.success(`Process ${trimmedName} added!`, { position: "top-right", autoClose: 1500 });

    // Reset form
    setProcess({
      name: "",
      burstTime: "",
      arrivalTime: "",
      priority: "",
    });
  };

  const isPriorityAlgo = ["Priority (Preemptive)", "Priority (Non-Preemptive)"].includes(algorithm);

  return (
    <form 
      onSubmit={handleSubmit} 
      className="p-6 border border-slate-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/30 backdrop-blur-md rounded-2xl shadow-md dark:shadow-xl space-y-5 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl -z-10"></div>
      
      <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200 dark:border-zinc-800">
        <Plus className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
        <h2 className="text-lg font-bold text-slate-800 dark:text-white">Create Process</h2>
      </div>

      <div className="space-y-4">
        {/* Process Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-indigo-550 dark:text-indigo-400" />
            Process Label
          </label>
          <input
            type="text"
            placeholder="e.g. P1, P2, JobA"
            value={process.name}
            onChange={(e) => setProcess({ ...process, name: e.target.value })}
            className="w-full border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/60 rounded-xl py-2.5 px-3.5 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            maxLength={10}
          />
        </div>

        {/* Burst Time */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-indigo-550 dark:text-indigo-400" />
            Burst Time (CPU cycles)
          </label>
          <input
            type="number"
            placeholder="Execution duration (e.g. 5)"
            min="1"
            value={process.burstTime}
            onChange={(e) => setProcess({ ...process, burstTime: e.target.value })}
            className="w-full border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/60 rounded-xl py-2.5 px-3.5 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Arrival Time */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-indigo-550 dark:text-indigo-400" />
            Arrival Time (seconds)
          </label>
          <input
            type="number"
            placeholder="Ready queue arrival (e.g. 0)"
            min="0"
            value={process.arrivalTime}
            onChange={(e) => setProcess({ ...process, arrivalTime: e.target.value })}
            className="w-full border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/60 rounded-xl py-2.5 px-3.5 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Priority */}
        {isPriorityAlgo && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                Priority Rank
              </label>
              <span className="text-[10px] text-slate-400 dark:text-zinc-500 italic">Lower = Higher priority</span>
            </div>
            <input
              type="number"
              placeholder="e.g. 1 (High), 5 (Low)"
              min="0"
              value={process.priority}
              onChange={(e) => setProcess({ ...process, priority: e.target.value })}
              className="w-full border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/60 rounded-xl py-2.5 px-3.5 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>
        )}
      </div>

      <button
        type="submit"
        className="w-full mt-2 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 transition-all font-semibold shadow-lg shadow-indigo-500/10 text-white rounded-xl flex items-center justify-center gap-2 active:scale-98"
      >
        <Plus className="w-4 h-4" />
        <span>Add Process</span>
      </button>
    </form>
  );
};

export default ProcessForm;