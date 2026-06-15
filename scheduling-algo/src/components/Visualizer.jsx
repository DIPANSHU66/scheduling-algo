import { useState, useEffect, useRef } from "react";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipBack, 
  SkipForward, 
  Cpu, 
  Layers, 
  Activity, 
  Clock, 
  Terminal, 
  ListOrdered,
  CheckCircle2,
  Sliders,
  HelpCircle
} from "lucide-react";
import { generateTimeline } from "../utils/schedulerEngine";

// Dynamic, vibrant process colors palette
const processColors = {
  P1: "from-indigo-500 to-blue-600 shadow-indigo-500/20",
  P2: "from-emerald-500 to-teal-600 shadow-emerald-500/20",
  P3: "from-violet-500 to-purple-600 shadow-violet-500/20",
  P4: "from-amber-500 to-orange-600 shadow-amber-500/20",
  P5: "from-rose-500 to-pink-600 shadow-rose-500/20",
  P6: "from-cyan-500 to-blue-500 shadow-cyan-500/20",
  P7: "from-fuchsia-500 to-pink-500 shadow-fuchsia-500/20",
  P8: "from-lime-500 to-green-500 shadow-lime-500/20",
  P9: "from-orange-500 to-red-500 shadow-orange-500/20",
  P10: "from-teal-500 to-emerald-500 shadow-teal-500/20",
  Idle: "from-zinc-200 to-zinc-350 dark:from-zinc-800 dark:to-zinc-900 border-zinc-300 dark:border-zinc-700 shadow-zinc-800/10"
};

const getProcessColor = (name) => {
  return processColors[name] || "from-sky-500 to-blue-600 shadow-sky-500/20";
};

const getProcessBgColor = (name) => {
  if (name === "Idle") return "bg-zinc-100 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400";
  const colorMap = {
    P1: "bg-indigo-500/10 border-indigo-500/30 text-indigo-600 dark:text-indigo-400",
    P2: "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400",
    P3: "bg-violet-500/10 border-violet-500/30 text-violet-600 dark:text-violet-400",
    P4: "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400",
    P5: "bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400",
    P6: "bg-cyan-500/10 border-cyan-500/30 text-cyan-600 dark:text-cyan-400",
    P7: "bg-fuchsia-500/10 border-fuchsia-500/30 text-fuchsia-600 dark:text-fuchsia-400",
    P8: "bg-lime-500/10 border-lime-500/30 text-lime-600 dark:text-lime-400",
    P9: "bg-orange-500/10 border-orange-500/30 text-orange-600 dark:text-orange-400",
    P10: "bg-teal-500/10 border-teal-500/30 text-teal-600 dark:text-teal-400",
  };
  return colorMap[name] || "bg-sky-500/10 border-sky-500/30 text-sky-600 dark:text-sky-400";
};

const getAlgorithmDescription = (algo) => {
  switch (algo) {
    case "FCFS":
      return "First Come First Serve is a non-preemptive scheduling policy. The process that requests the CPU first gets allocated the CPU first (FIFO order). Simple but prone to the Convoy Effect.";
    case "SJF":
      return "Shortest Job First is a non-preemptive algorithm that associates with each process the length of its next CPU burst. The CPU is allocated to the process with the smallest burst time. Optimizes average waiting time.";
    case "SRTF":
    case "SRJF":
      return "Shortest Remaining Time First is the preemptive version of SJF. If a newly arrived process has a shorter remaining burst time than the currently running process, the current process is preempted.";
    case "RR":
      return "Round Robin is a preemptive algorithm designed especially for time-sharing systems. A small unit of time, called a Time Quantum, is defined. The CPU scheduler goes around the ready queue, allocating CPU up to one quantum.";
    case "Priority (Non-Preemptive)":
      return "Non-Preemptive Priority scheduling allocates the CPU to the process with the highest priority (lowest numerical value). Once selected, it runs to completion without preemption.";
    case "Priority (Preemptive)":
      return "Preemptive Priority scheduling selects the highest priority process at each tick. If a newly arrived process has a higher priority than the running process, the running process is preempted immediately.";
    default:
      return "";
  }
};

const Visualizer = ({ algorithm, processes }) => {
  const [timeQuantum, setTimeQuantum] = useState(2);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1); // multiplier
  
  // Pre-computed simulation data
  const [simData, setSimData] = useState({ timeline: [], ganttChart: [], processStats: [] });
  
  const timerRef = useRef(null);
  const terminalContainerRef = useRef(null);

  // Re-run simulation when processes or quantum or algorithm changes
  useEffect(() => {
    const data = generateTimeline(algorithm, processes, timeQuantum);
    setSimData(data);
    setCurrentTime(0);
    setIsPlaying(false);
  }, [algorithm, processes, timeQuantum]);

  // Handle auto-playing simulation ticks
  useEffect(() => {
    if (isPlaying) {
      const interval = 1000 / playbackSpeed;
      timerRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= simData.timeline.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, interval);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, playbackSpeed, simData.timeline.length]);

  // Scroll terminal logs to bottom internally on tick update (without scrolling the browser viewport)
  useEffect(() => {
    if (terminalContainerRef.current) {
      terminalContainerRef.current.scrollTop = terminalContainerRef.current.scrollHeight;
    }
  }, [currentTime]);

  const { timeline, processStats } = simData;
  const currentSnapshot = timeline[currentTime];

  // Safety checks
  if (!processes || processes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 border border-dashed border-slate-250 dark:border-zinc-800 bg-white dark:bg-zinc-900/20 backdrop-blur-md rounded-2xl text-center max-w-4xl mx-auto shadow-md dark:shadow-2xl">
        <HelpCircle className="w-16 h-16 text-indigo-500 dark:text-indigo-400/80 mb-4 animate-pulse" />
        <h3 className="text-xl font-semibold text-slate-800 dark:text-zinc-200 mb-2">Ready to Simulate</h3>
        <p className="text-slate-500 dark:text-zinc-500 max-w-md">
          Please add some CPU processes on the left panel by entering their Arrival Time and Burst Time. Then we'll visualize the execution.
        </p>
      </div>
    );
  }

  if (!currentSnapshot) {
    return <div className="text-center text-slate-400">Loading simulation details...</div>;
  }

  // Playback handlers
  const handlePlayPause = () => {
    if (currentTime >= timeline.length - 1) {
      setCurrentTime(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleStepBack = () => {
    setIsPlaying(false);
    setCurrentTime((prev) => Math.max(0, prev - 1));
  };

  const handleStepForward = () => {
    setIsPlaying(false);
    setCurrentTime((prev) => Math.min(timeline.length - 1, prev + 1));
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  // Process timeline data calculations
  const isSimulationFinished = currentTime === timeline.length - 1;
  const runningProcessObj = processes.find(p => p.name === currentSnapshot.runningProcess);
  const burstProgress = runningProcessObj 
    ? ((parseInt(runningProcessObj.burstTime) - currentSnapshot.remainingTimes[runningProcessObj.name]) / parseInt(runningProcessObj.burstTime)) * 100
    : 0;

  // Calculate Averages
  const totalWaiting = processStats.reduce((sum, p) => sum + p.waitingTime, 0);
  const totalTurnaround = processStats.reduce((sum, p) => sum + p.turnaroundTime, 0);
  const avgWaiting = (totalWaiting / processStats.length).toFixed(2);
  const avgTurnaround = (totalTurnaround / processStats.length).toFixed(2);

  // Filter Gantt chart up to current time
  const visibleGantt = currentSnapshot.ganttChart.map(block => {
    if (block.startTime <= currentSnapshot.time) {
      const displayEndTime = Math.min(block.endTime, currentSnapshot.time);
      return {
        ...block,
        endTime: displayEndTime,
        width: displayEndTime - block.startTime
      };
    }
    return null;
  }).filter(Boolean).filter(b => b.width > 0);

  const totalGanttTime = visibleGantt.length > 0 
    ? Math.max(...visibleGantt.map(b => b.endTime), currentSnapshot.time)
    : currentSnapshot.time;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 pb-16 text-slate-800 dark:text-zinc-100">
      {/* Algorithm description card */}
      <div className="border border-slate-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/30 backdrop-blur-md rounded-2xl p-6 shadow-md dark:shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -z-10 group-hover:bg-indigo-500/10 transition-all duration-700"></div>
        <div className="flex items-start gap-4">
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-600 dark:text-indigo-400 flex-shrink-0">
            <Cpu className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-800 dark:text-white">
              {algorithm === "SRTF" || algorithm === "SRJF" ? "Shortest Remaining Time First" : algorithm}
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                {algorithm === "RR" || algorithm === "SRTF" || algorithm === "SRJF" || algorithm === "Priority (Preemptive)" ? "Preemptive" : "Non-Preemptive"}
              </span>
            </h2>
            <p className="text-sm text-slate-500 dark:text-zinc-400 mt-2 leading-relaxed">
              {getAlgorithmDescription(algorithm)}
            </p>
          </div>
        </div>

        {/* Quantum configuration for Round Robin */}
        {algorithm === "RR" && (
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-zinc-800 flex items-center gap-4">
            <span className="text-sm font-medium text-slate-600 dark:text-zinc-300 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
              Configure Time Quantum:
            </span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="10"
                value={timeQuantum}
                onChange={(e) => setTimeQuantum(Math.max(1, parseInt(e.target.value) || 2))}
                className="w-16 border border-slate-250 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-slate-800 dark:text-white text-center py-1 px-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              />
              <span className="text-xs text-slate-500">units</span>
            </div>
          </div>
        )}
      </div>

      {/* Control Station Panel */}
      <div className="border border-slate-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/40 backdrop-blur-md rounded-2xl p-6 shadow-md dark:shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Controls buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-800 dark:hover:text-white transition-all text-slate-500 dark:text-zinc-400 shadow-sm"
              title="Reset"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
            <button
              onClick={handleStepBack}
              disabled={currentTime === 0}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-800 dark:hover:text-white transition-all text-slate-500 dark:text-zinc-400 shadow-sm disabled:opacity-30 disabled:pointer-events-none"
              title="Step Backward (1s)"
            >
              <SkipBack className="w-5 h-5" />
            </button>
            <button
              onClick={handlePlayPause}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 transition-all font-semibold shadow-lg shadow-indigo-500/20 text-white flex items-center gap-2 active:scale-95"
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white" />}
              <span>{isPlaying ? "Pause" : "Simulate"}</span>
            </button>
            <button
              onClick={handleStepForward}
              disabled={isSimulationFinished}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-800 dark:hover:text-white transition-all text-slate-500 dark:text-zinc-400 shadow-sm disabled:opacity-30 disabled:pointer-events-none"
              title="Step Forward (1s)"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>

          {/* Scrubber Time Badge */}
          <div className="flex items-center gap-3 bg-slate-100 dark:bg-zinc-950/60 border border-slate-200 dark:border-zinc-800 py-1.5 px-4 rounded-xl">
            <Clock className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
            <span className="text-sm font-semibold text-slate-700 dark:text-zinc-200">
              Time: <span className="text-indigo-600 dark:text-indigo-400 font-mono text-base">{currentTime}</span>
              <span className="text-slate-400 dark:text-zinc-600 font-normal"> / {timeline.length - 1}s</span>
            </span>
          </div>

          {/* Speed settings */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 dark:text-zinc-500 font-medium mr-1">Speed:</span>
            {[0.5, 1, 2, 4].map((speed) => (
              <button
                key={speed}
                onClick={() => setPlaybackSpeed(speed)}
                className={`py-1 px-3 text-xs font-semibold rounded-lg transition-all border ${
                  playbackSpeed === speed
                    ? "bg-indigo-500/10 border-indigo-500 text-indigo-600 dark:text-indigo-400"
                    : "bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-550 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800"
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>

        {/* Range slider / Scrubber */}
        <div className="relative group pt-2">
          <input
            type="range"
            min={0}
            max={timeline.length - 1}
            value={currentTime}
            onChange={(e) => {
              setIsPlaying(false);
              setCurrentTime(parseInt(e.target.value));
            }}
            className="w-full h-2 rounded-lg bg-slate-200 dark:bg-zinc-800 appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400 transition-all focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          {/* Slider track glow */}
          <div 
            className="absolute left-0 top-[18px] h-2 bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-lg pointer-events-none"
            style={{ width: `${(currentTime / (timeline.length - 1)) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Visual Execution Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CPU Core Board */}
        <div className="border border-slate-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/40 backdrop-blur-md rounded-2xl p-6 shadow-md dark:shadow-xl flex flex-col items-center justify-between text-center relative min-h-[300px]">
          <div className="w-full flex items-center justify-between pb-3 border-b border-slate-200 dark:border-zinc-800 mb-4">
            <span className="text-sm font-semibold text-slate-500 dark:text-zinc-400 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
              CPU CORE
            </span>
            {currentSnapshot.runningProcess ? (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 animate-pulse">
                ACTIVE
              </span>
            ) : (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-500 dark:text-zinc-400">
                IDLE
              </span>
            )}
          </div>

          {currentSnapshot.runningProcess ? (
            <div className="my-auto flex flex-col items-center space-y-4">
              {/* Spinning / Pulsing glow badge of running process */}
              <div className={`w-28 h-28 rounded-2xl bg-gradient-to-br ${getProcessColor(currentSnapshot.runningProcess)} p-1 shadow-lg flex items-center justify-center transition-transform duration-300 relative`}>
                <div className="absolute inset-0 bg-white/10 rounded-2xl animate-ping opacity-10 pointer-events-none"></div>
                <div className="w-full h-full bg-white dark:bg-zinc-950 rounded-xl flex flex-col items-center justify-center">
                  <span className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-wider">{currentSnapshot.runningProcess}</span>
                  <span className="text-[10px] text-slate-500 dark:text-zinc-500 font-mono mt-1">
                    Rem: {currentSnapshot.remainingTimes[currentSnapshot.runningProcess]}u
                  </span>
                </div>
              </div>

              {/* Progress bar of Burst Time */}
              <div className="w-48 space-y-1.5">
                <div className="flex justify-between text-xs font-medium text-slate-500 dark:text-zinc-400 px-1">
                  <span>Execution Progress</span>
                  <span>{Math.round(burstProgress)}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 dark:bg-zinc-850 rounded-full overflow-hidden border border-slate-200 dark:border-zinc-800">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 transition-all duration-300"
                    style={{ width: `${burstProgress}%` }}
                  ></div>
                </div>
              </div>

              {/* Quantum Progress (if RR) */}
              {algorithm === "RR" && (
                <div className="w-48 space-y-1 text-center">
                  <div className="flex justify-between text-[10px] font-mono text-slate-400 dark:text-zinc-500 px-1">
                    <span>Quantum Usage</span>
                    <span>{Math.round(currentSnapshot.quantumProgress)}%</span>
                  </div>
                  <div className="w-full h-1 bg-slate-105 dark:bg-zinc-850 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-amber-500 transition-all duration-300"
                      style={{ width: `${currentSnapshot.quantumProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="my-auto py-8 flex flex-col items-center space-y-3">
              <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 flex items-center justify-center text-slate-400 dark:text-zinc-600 animate-pulse">
                <Activity className="w-10 h-10" />
              </div>
              <div>
                <p className="text-slate-500 dark:text-zinc-550 text-sm font-medium">No process scheduled</p>
                <p className="text-slate-400 dark:text-zinc-600 text-xs">Waiting for arrivals...</p>
              </div>
            </div>
          )}

          <div className="w-full text-xs text-slate-400 dark:text-zinc-500 pt-3 border-t border-slate-200 dark:border-zinc-800/50 mt-4 flex justify-around">
            <div>
              <span className="font-semibold text-slate-700 dark:text-zinc-400 block font-mono">{processes.length}</span>
              <span>Total Jobs</span>
            </div>
            <div className="border-l border-slate-200 dark:border-zinc-800 h-6"></div>
            <div>
              <span className="font-semibold text-slate-700 dark:text-zinc-400 block font-mono">{currentSnapshot.completedProcesses.length}</span>
              <span>Completed</span>
            </div>
          </div>
        </div>

        {/* Queues (Ready Queue & Pending Queue) */}
        <div className="border border-slate-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/40 backdrop-blur-md rounded-2xl p-6 shadow-md dark:shadow-xl flex flex-col justify-between min-h-[300px] lg:col-span-2 space-y-6">
          {/* Ready Queue Lane */}
          <div className="flex-1 space-y-3">
            <h3 className="text-sm font-semibold text-slate-500 dark:text-zinc-400 flex items-center gap-2 border-b border-slate-200 dark:border-zinc-800 pb-2">
              <Layers className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
              READY QUEUE ({currentSnapshot.readyQueue.length})
            </h3>
            <div className="flex items-center gap-2 overflow-x-auto py-2 min-h-[70px] scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-800 scrollbar-track-transparent">
              {currentSnapshot.readyQueue.map((name, index) => (
                <div 
                  key={`${name}-${index}`} 
                  className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 border rounded-xl font-semibold text-sm ${getProcessBgColor(name)} transition-all duration-200`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span className="font-bold">{name}</span>
                  <span className="text-[10px] opacity-65 font-mono">rem: {currentSnapshot.remainingTimes[name]}u</span>
                </div>
              ))}
              {currentSnapshot.readyQueue.length === 0 && (
                <p className="text-slate-400 dark:text-zinc-650 text-xs italic py-2">Ready queue is empty</p>
              )}
            </div>
          </div>

          {/* Pending Queue Lane */}
          <div className="flex-1 space-y-3">
            <h3 className="text-sm font-semibold text-slate-500 dark:text-zinc-400 flex items-center gap-2 border-b border-slate-200 dark:border-zinc-800 pb-2">
              <ListOrdered className="w-4 h-4 text-amber-500 dark:text-amber-400" />
              UNARRIVED / PENDING ({currentSnapshot.pendingProcesses.length})
            </h3>
            <div className="flex items-center gap-2 overflow-x-auto py-2 min-h-[60px] scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-800 scrollbar-track-transparent">
              {currentSnapshot.pendingProcesses.map((name) => (
                <div 
                  key={name} 
                  className="flex-shrink-0 px-3 py-1.5 border border-slate-200 dark:border-zinc-800/80 bg-slate-100 dark:bg-zinc-950/40 text-slate-500 dark:text-zinc-400 rounded-lg text-xs font-semibold"
                >
                  <span>{name}</span>
                  <span className="text-[10px] font-mono ml-2 text-slate-400 dark:text-zinc-600">arr: {processes.find(p => p.name === name)?.arrivalTime}u</span>
                </div>
              ))}
              {currentSnapshot.pendingProcesses.length === 0 && (
                <p className="text-slate-400 dark:text-zinc-655 text-xs italic py-2">All processes have arrived</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Gantt Chart */}
      <div className="border border-slate-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/40 backdrop-blur-md rounded-2xl p-6 shadow-md dark:shadow-xl space-y-4">
        <h3 className="text-sm font-semibold text-slate-500 dark:text-zinc-400 flex items-center gap-2 border-b border-slate-200 dark:border-zinc-800 pb-2">
          <Activity className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
          GANTT CHART
        </h3>

        {visibleGantt.length > 0 ? (
          <div className="space-y-6 pt-2">
            {/* The Gantt blocks track */}
            <div className="w-full flex h-14 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-100 dark:bg-zinc-950 overflow-hidden relative shadow-inner">
              {visibleGantt.map((block, index) => {
                const percentage = (block.width / Math.max(1, totalGanttTime)) * 100;
                const isIdle = block.isIdle;

                return (
                  <div
                    key={index}
                    className={`h-full border-r border-white dark:border-zinc-950 flex flex-col items-center justify-center relative transition-all duration-300 ${
                      isIdle 
                        ? "bg-slate-200 dark:bg-zinc-900/80 text-slate-500 dark:text-zinc-500" 
                        : `bg-gradient-to-br ${getProcessColor(block.name)} text-white`
                    }`}
                    style={{ width: `${percentage}%`, minWidth: "35px" }}
                  >
                    <span className="text-xs font-bold font-mono">{block.name}</span>
                    <span className="text-[9px] font-semibold opacity-85 mt-0.5">
                      {block.width}u
                    </span>
                    
                    {/* Tick time endpoints underneath */}
                    <div className="absolute left-0 -bottom-5 text-[9px] font-semibold font-mono text-slate-500 dark:text-zinc-500 bg-slate-100 dark:bg-zinc-950/80 px-1 rounded">
                      {block.startTime}
                    </div>
                    {index === visibleGantt.length - 1 && (
                      <div className="absolute right-0 -bottom-5 text-[9px] font-semibold font-mono text-slate-700 dark:text-zinc-400 bg-slate-100 dark:bg-zinc-950/80 px-1 rounded font-bold">
                        {block.endTime}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {/* Spacer for tick time overlaps */}
            <div className="h-2"></div>
          </div>
        ) : (
          <div className="text-center py-10 border border-dashed border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/10 rounded-xl text-slate-400 dark:text-zinc-500 text-sm">
            Gantt chart will compile here as time increments.
          </div>
        )}
      </div>

      {/* Terminal decision log & Metrics row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Terminal log console (remains dark for coding aesthetics) */}
        <div className="border border-slate-200 dark:border-zinc-800 bg-zinc-950 rounded-2xl p-5 shadow-lg dark:shadow-2xl flex flex-col md:col-span-2 h-[260px] relative font-mono overflow-hidden">
          <div className="absolute top-2 right-4 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/80"></span>
          </div>

          <span className="text-xs font-bold text-zinc-400 flex items-center gap-2 pb-2 border-b border-zinc-800 mb-3">
            <Terminal className="w-4 h-4 text-emerald-400" />
            DECISION ENGINE LOG CONSOLE
          </span>

          <div ref={terminalContainerRef} className="flex-1 overflow-y-auto text-[11px] space-y-1 text-emerald-400/90 leading-relaxed pr-2 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
            {currentSnapshot.logs.map((logLine, index) => (
              <div key={index} className="flex gap-2">
                <span className="text-emerald-600 select-none">&gt;</span>
                <p>{logLine}</p>
              </div>
            ))}
            {currentSnapshot.logs.length === 0 && (
              <p className="text-zinc-600 italic">No events logged yet. Click Simulate to start.</p>
            )}
          </div>
        </div>

        {/* Performance averages cards */}
        <div className="grid grid-cols-1 gap-4">
          <div className="border border-slate-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/40 backdrop-blur-md rounded-2xl p-5 shadow-md dark:shadow-xl flex flex-col justify-center">
            <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 block mb-1">AVERAGE WAITING TIME</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500 dark:from-indigo-400 dark:to-blue-400 font-mono">
                {avgWaiting}
              </span>
              <span className="text-xs text-slate-400 dark:text-zinc-550">units</span>
            </div>
            <p className="text-[10px] text-slate-400 dark:text-zinc-500 mt-2">
              Total idle time spent by processes in the ready queue.
            </p>
          </div>

          <div className="border border-slate-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/40 backdrop-blur-md rounded-2xl p-5 shadow-md dark:shadow-xl flex flex-col justify-center">
            <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 block mb-1">AVERAGE TURNAROUND TIME</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-400 font-mono">
                {avgTurnaround}
              </span>
              <span className="text-xs text-slate-400 dark:text-zinc-550">units</span>
            </div>
            <p className="text-[10px] text-slate-400 dark:text-zinc-500 mt-2">
              Total execution completion span from arrival.
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Table */}
      <div className="border border-slate-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/40 backdrop-blur-md rounded-2xl p-6 shadow-md dark:shadow-xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-3 mb-4">
          <h3 className="text-sm font-semibold text-slate-500 dark:text-zinc-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-550 dark:text-emerald-400" />
            DETAILED SIMULATION STATISTICS
          </h3>
          <span className="text-xs text-slate-400 dark:text-zinc-500">Sorted by Process Name</span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-zinc-800">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 dark:bg-zinc-950/60 border-b border-slate-200 dark:border-zinc-800 text-slate-500 dark:text-zinc-400 uppercase font-mono tracking-wider">
                <th className="py-3.5 px-4 font-semibold">Process</th>
                <th className="py-3.5 px-4 text-center font-semibold">Arrival Time</th>
                <th className="py-3.5 px-4 text-center font-semibold">Burst Time</th>
                {algorithm.includes("Priority") && <th className="py-3.5 px-4 text-center font-semibold">Priority</th>}
                <th className="py-3.5 px-4 text-center font-semibold">Start Time</th>
                <th className="py-3.5 px-4 text-center font-semibold">Completion Time</th>
                <th className="py-3.5 px-4 text-center font-semibold">Turnaround Time</th>
                <th className="py-3.5 px-4 text-center font-semibold">Waiting Time</th>
                <th className="py-3.5 px-4 text-center font-semibold">Response Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-zinc-850">
              {processStats.map((stat) => {
                const isCompletedNow = currentSnapshot.completedProcesses.some(p => p.name === stat.name);
                const isRunningNow = currentSnapshot.runningProcess === stat.name;

                return (
                  <tr 
                    key={stat.name} 
                    className={`transition-colors duration-200 ${
                      isRunningNow 
                        ? "bg-indigo-500/5 hover:bg-indigo-500/10 text-slate-900 dark:text-white" 
                        : isCompletedNow 
                          ? "bg-slate-50 dark:bg-zinc-900/20 hover:bg-slate-100 dark:hover:bg-zinc-900/40 text-slate-700 dark:text-zinc-300"
                          : "text-slate-400 dark:text-zinc-600 hover:bg-slate-50 dark:hover:bg-zinc-900/10"
                    }`}
                  >
                    <td className="py-3.5 px-4 font-bold flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${getProcessColor(stat.name)}`}></span>
                      {stat.name}
                      {isRunningNow && (
                        <span className="text-[8px] px-1 py-0.2 rounded bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30">RUNNING</span>
                      )}
                      {isCompletedNow && !isRunningNow && (
                        <span className="text-[8px] px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">DONE</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono">{stat.arrivalTime}</td>
                    <td className="py-3.5 px-4 text-center font-mono">{stat.burstTime}</td>
                    {algorithm.includes("Priority") && <td className="py-3.5 px-4 text-center font-mono font-bold text-amber-500 dark:text-amber-400/90">{stat.priority}</td>}
                    
                    <td className="py-3.5 px-4 text-center font-mono">
                      {isCompletedNow || stat.startTime <= currentTime ? (stat.startTime !== -1 ? stat.startTime : "-") : "-"}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono">
                      {isCompletedNow ? stat.completionTime : "-"}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold">
                      {isCompletedNow ? stat.turnaroundTime : "-"}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono text-emerald-600 dark:text-emerald-400/90">
                      {isCompletedNow ? stat.waitingTime : "-"}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono text-indigo-650 dark:text-indigo-400/90">
                      {isCompletedNow || stat.startTime <= currentTime ? (stat.responseTime !== -1 ? stat.responseTime : "-") : "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Visualizer;
