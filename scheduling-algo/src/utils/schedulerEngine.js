/**
 * Pure JavaScript CPU Scheduling Engine
 * 
 * Provides unified, textbook-style CPU scheduling algorithms (FCFS, SJF, SRTF, RR, Priority)
 * compiled into a single, highly readable file. Decouples state calculations from React.
 */

export const generateTimeline = (algorithm, processes, timeQuantum = 2) => {
  if (!processes || processes.length === 0) {
    return { timeline: [], ganttChart: [], processStats: [] };
  }

  const quantum = Math.max(1, parseInt(timeQuantum) || 2);
  
  // Clone and format processes
  const jobs = processes.map((p, idx) => ({
    name: p.name || `P${idx + 1}`,
    arrivalTime: Math.max(0, parseInt(p.arrivalTime) || 0),
    burstTime: Math.max(1, parseInt(p.burstTime) || 1),
    priority: parseInt(p.priority) || 0,
    remainingTime: Math.max(1, parseInt(p.burstTime) || 1),
    startTime: -1,
    completionTime: -1,
  }));

  const timeline = [];
  const ganttChart = [];
  const logs = [];
  
  let t = 0;
  let running = null;
  let rrTimer = 0;
  let readyQueue = []; // Strictly manages FIFO queue order for RR / FCFS

  // Run the scheduler loop until all jobs are executed
  while (jobs.some(j => j.remainingTime > 0)) {
    // 1. Handle process arrivals at time `t`
    jobs.filter(j => j.arrivalTime === t)
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach(j => {
        logs.push(`[t=${t}] Process ${j.name} arrived (Burst = ${j.burstTime}u${j.priority ? `, Priority = ${j.priority}` : ""})`);
        if (algorithm === "RR" || algorithm === "FCFS") readyQueue.push(j);
      });

    // 2. Select candidate process to execute
    let next = null;
    const arrived = jobs.filter(j => j.arrivalTime <= t && j.remainingTime > 0);

    if (arrived.length > 0) {
      if (algorithm === "FCFS") {
        next = running && running.remainingTime > 0 ? running : readyQueue.find(j => j.remainingTime > 0);
      } else if (algorithm === "SJF") {
        next = running && running.remainingTime > 0 ? running : arrived.sort((a, b) => a.burstTime - b.burstTime || a.arrivalTime - b.arrivalTime || a.name.localeCompare(b.name))[0];
      } else if (algorithm === "Priority (Non-Preemptive)") {
        next = running && running.remainingTime > 0 ? running : arrived.sort((a, b) => a.priority - b.priority || a.arrivalTime - b.arrivalTime || a.name.localeCompare(b.name))[0];
      } else if (algorithm === "SRTF" || algorithm === "SRJF") {
        next = arrived.sort((a, b) => a.remainingTime - b.remainingTime || a.arrivalTime - b.arrivalTime || a.name.localeCompare(b.name))[0];
      } else if (algorithm === "Priority (Preemptive)") {
        next = arrived.sort((a, b) => a.priority - b.priority || a.arrivalTime - b.arrivalTime || a.name.localeCompare(b.name))[0];
      } else if (algorithm === "RR") {
        if (running) {
          if (running.remainingTime <= 0) {
            running = null;
            rrTimer = 0;
          } else if (rrTimer >= quantum) {
            logs.push(`[t=${t}] Time quantum expired for ${running.name}. Preempting.`);
            readyQueue.push(running);
            running = null;
            rrTimer = 0;
          }
        }
        readyQueue = readyQueue.filter(j => j.remainingTime > 0);
        if (!running && readyQueue.length > 0) {
          next = readyQueue.shift();
          rrTimer = 0;
        } else {
          next = running;
        }
      }
    }

    // 3. Handle context switching & startup logs
    if (next !== running) {
      if (running && running.remainingTime > 0) {
        logs.push(`[t=${t}] Process ${running.name} preempted (Remaining: ${running.remainingTime}u)`);
      }
      if (next) {
        if (next.startTime === -1) next.startTime = t;
        logs.push(`[t=${t}] CPU started executing Process ${next.name}`);
        if (algorithm === "RR") rrTimer = 0;
      } else {
        logs.push(`[t=${t}] CPU is idle`);
      }
      running = next;
    }

    // 4. Update Gantt Chart block history
    if (running) {
      if (ganttChart.length > 0 && ganttChart[ganttChart.length - 1].name === running.name && !ganttChart[ganttChart.length - 1].isIdle) {
        ganttChart[ganttChart.length - 1].endTime = t + 1;
      } else {
        ganttChart.push({ name: running.name, startTime: t, endTime: t + 1, isIdle: false });
      }
    } else {
      if (ganttChart.length > 0 && ganttChart[ganttChart.length - 1].isIdle) {
        ganttChart[ganttChart.length - 1].endTime = t + 1;
      } else {
        ganttChart.push({ name: "Idle", startTime: t, endTime: t + 1, isIdle: true });
      }
    }

    // 5. Update readyQueue / waiting lanes for UI representation
    const waiting = jobs.filter(j => j.arrivalTime <= t && j.remainingTime > 0 && j !== running);
    if (algorithm === "SJF" || algorithm === "SRTF" || algorithm === "SRJF") {
      waiting.sort((a, b) => a.remainingTime - b.remainingTime || a.arrivalTime - b.arrivalTime);
    } else if (algorithm.includes("Priority")) {
      waiting.sort((a, b) => a.priority - b.priority || a.arrivalTime - b.arrivalTime);
    } else if (algorithm === "FCFS") {
      waiting.sort((a, b) => a.arrivalTime - b.arrivalTime);
    }

    // 6. Record snapshot state at time `t`
    const snapshotRemaining = {};
    jobs.forEach(j => snapshotRemaining[j.name] = j.remainingTime);
    
    timeline.push({
      time: t,
      runningProcess: running ? running.name : null,
      readyQueue: algorithm === "RR" ? readyQueue.map(j => j.name) : waiting.map(j => j.name),
      pendingProcesses: jobs.filter(j => j.arrivalTime > t).map(j => j.name),
      completedProcesses: jobs.filter(j => j.remainingTime <= 0).map(j => ({
        name: j.name,
        arrivalTime: j.arrivalTime,
        burstTime: j.burstTime,
        priority: j.priority,
        startTime: j.startTime,
        completionTime: j.completionTime,
        turnaroundTime: j.completionTime - j.arrivalTime,
        waitingTime: (j.completionTime - j.arrivalTime) - j.burstTime,
        responseTime: j.startTime - j.arrivalTime
      })),
      remainingTimes: snapshotRemaining,
      ganttChart: ganttChart.map(g => ({ ...g })),
      logs: [...logs],
      quantumProgress: algorithm === "RR" && running ? (rrTimer / quantum) * 100 : 0
    });

    // 7. Advance CPU execution tick
    if (running) {
      running.remainingTime -= 1;
      rrTimer += 1;
      if (running.remainingTime === 0) {
        running.completionTime = t + 1;
        logs.push(`[t=${t+1}] Process ${running.name} completed`);
      }
    }
    t++;
  }

  // Record final snapshot at complete completion time
  const snapshotRemaining = {};
  jobs.forEach(j => snapshotRemaining[j.name] = 0);
  
  timeline.push({
    time: t,
    runningProcess: null,
    readyQueue: [],
    pendingProcesses: [],
    completedProcesses: jobs.map(j => ({
      name: j.name,
      arrivalTime: j.arrivalTime,
      burstTime: j.burstTime,
      priority: j.priority,
      startTime: j.startTime,
      completionTime: j.completionTime,
      turnaroundTime: j.completionTime - j.arrivalTime,
      waitingTime: (j.completionTime - j.arrivalTime) - j.burstTime,
      responseTime: j.startTime - j.arrivalTime
    })),
    remainingTimes: snapshotRemaining,
    ganttChart: ganttChart.map(g => ({ ...g })),
    logs: [...logs],
    quantumProgress: 0
  });

  // Calculate final Process Stats (sorted alphabetically)
  const processStats = jobs.map(j => {
    const turnaroundTime = j.completionTime - j.arrivalTime;
    return {
      name: j.name,
      arrivalTime: j.arrivalTime,
      burstTime: j.burstTime,
      priority: j.priority,
      startTime: j.startTime,
      completionTime: j.completionTime,
      turnaroundTime,
      waitingTime: turnaroundTime - j.burstTime,
      responseTime: j.startTime - j.arrivalTime
    };
  }).sort((a, b) => a.name.localeCompare(b.name));

  return { timeline, ganttChart, processStats };
};
