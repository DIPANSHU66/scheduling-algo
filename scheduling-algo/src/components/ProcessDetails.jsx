import { ListTodo, Trash2, ShieldAlert } from "lucide-react";

// Vibrant process colors map for consistency
const processBorderColors = {
  P1: "border-l-indigo-500",
  P2: "border-l-emerald-500",
  P3: "border-l-violet-500",
  P4: "border-l-amber-500",
  P5: "border-l-rose-500",
  P6: "border-l-cyan-500",
  P7: "border-l-fuchsia-500",
  P8: "border-l-lime-500",
  P9: "border-l-orange-500",
  P10: "border-l-teal-500",
};

const getBorderColor = (name) => {
  return processBorderColors[name] || "border-l-sky-500";
};

const ProcessDetails = ({ processes, setProcesses }) => {
  const clearProcesses = () => {
    setProcesses([]);
  };

  const deleteProcess = (name) => {
    setProcesses(processes.filter((p) => p.name !== name));
  };

  return (
    <div className="p-6 border border-slate-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/30 backdrop-blur-md rounded-2xl shadow-md dark:shadow-xl flex flex-col justify-between min-h-[340px] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl -z-10"></div>
      
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-zinc-800 mb-6">
          <div className="flex items-center gap-2.5">
            <ListTodo className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">Processes Pool ({processes.length})</h2>
          </div>
          {processes.length > 0 && (
            <button
              onClick={clearProcesses}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-lg text-xs font-semibold active:scale-95 transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear All
            </button>
          )}
        </div>

        {processes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400 dark:text-zinc-500 text-center space-y-2">
            <ShieldAlert className="w-10 h-10 text-slate-350 dark:text-zinc-650" />
            <p className="text-sm font-medium text-slate-600 dark:text-zinc-400">No processes defined yet.</p>
            <p className="text-xs text-slate-400 dark:text-zinc-500 max-w-[280px]">
              Use the "Create Process" panel on the left to set up jobs for execution.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {processes.map((p, index) => (
              <div
                key={`${p.name}-${index}`}
                className={`flex flex-col justify-between p-4 border border-slate-200 dark:border-zinc-850 bg-slate-50 dark:bg-zinc-950/60 rounded-xl shadow-sm dark:shadow-lg border-l-4 ${getBorderColor(
                  p.name
                )} transition-all relative group`}
              >
                {/* Individual delete button */}
                <button
                  onClick={() => deleteProcess(p.name)}
                  className="absolute top-2.5 right-2.5 p-1 rounded-md text-slate-400 dark:text-zinc-500 hover:text-red-500 hover:bg-red-550/10 dark:hover:text-red-400 dark:hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove process"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                <div className="space-y-2">
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-extrabold text-base text-slate-800 dark:text-white tracking-wider">
                      {p.name}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200 dark:border-zinc-900 text-[11px] text-slate-500 dark:text-zinc-400">
                    <div>
                      <span className="block text-[9px] text-slate-400 dark:text-zinc-500 uppercase font-semibold">Burst Time</span>
                      <span className="font-mono text-slate-700 dark:text-zinc-300 font-bold">{p.burstTime}s</span>
                    </div>
                    <div>
                      <span className="block text-[9px] text-slate-400 dark:text-zinc-500 uppercase font-semibold">Arrival Time</span>
                      <span className="font-mono text-slate-700 dark:text-zinc-300 font-bold">{p.arrivalTime}s</span>
                    </div>
                  </div>

                  {p.priority !== "" && (
                    <div className="pt-1 text-[11px] flex justify-between items-center bg-slate-100 dark:bg-zinc-900/50 px-2 py-0.5 rounded border border-slate-200 dark:border-zinc-850/50">
                      <span className="text-[9px] text-slate-450 dark:text-zinc-500 uppercase font-semibold">Priority Rank</span>
                      <span className="font-mono text-amber-600 dark:text-amber-400 font-bold">{p.priority}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {processes.length > 0 && (
        <div className="mt-6 text-[10px] text-slate-400 dark:text-zinc-500 border-t border-slate-200 dark:border-zinc-900 pt-3 flex items-center justify-between">
          <span>* Hover process card to remove individually</span>
          <span className="font-semibold text-indigo-600 dark:text-indigo-400">Ready to simulate</span>
        </div>
      )}
    </div>
  );
};

export default ProcessDetails;