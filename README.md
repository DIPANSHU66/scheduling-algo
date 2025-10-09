# ⚙️ Scheduling Algorithms – A Visual Approach

### Developed by **Dipanshu Bansal**

This project is an **interactive visualization tool** for understanding how different CPU scheduling algorithms work. It helps students and developers see how processes are executed, how waiting and turnaround times are calculated, and how the CPU handles multiple processes efficiently.

---

## 🧠 Overview

In multitasking operating systems, **CPU scheduling** determines the order in which processes are executed.
The main goal of scheduling is to **maximize CPU utilization**, **reduce waiting time**, and **improve system throughput**.

This project visually represents each scheduling technique, showing how processes are picked and executed over time.
It also helps to compare algorithms based on performance metrics such as waiting time, turnaround time, and response time.

---

## 🎯 Key Concepts

- **CPU Scheduling:** The method by which processes are assigned to run on the processor.
- **Burst Time:** The time required by a process for its complete execution.
- **Arrival Time:** The time when a process enters the ready queue.
- **Waiting Time:** The total time a process spends waiting in the ready queue.
- **Turnaround Time:** The total time taken from process arrival to completion.
- **Response Time:** The time from arrival to the first CPU allocation.

Optimized scheduling ensures:
- Better CPU performance
- Reduced process starvation
- Improved system responsiveness

---

## 🧩 Implemented Algorithms

### 1. **First Come First Serve (FCFS)**
- Non-preemptive algorithm.
- Processes are executed in the order they arrive.
- Simple but can cause high waiting time for long processes.

### 2. **Shortest Job First (SJF)**
- Non-preemptive algorithm.
- The process with the smallest burst time is executed first.
- Provides minimal average waiting time but may lead to starvation for longer jobs.

### 3. **Round Robin (RR)**
- Preemptive algorithm.
- Each process is given a fixed time slice (quantum).
- Ensures fairness and responsiveness in time-sharing systems.

### 4. **Priority Scheduling**
- Can be preemptive or non-preemptive.
- Processes are executed based on priority level.
- Higher-priority tasks get CPU first; may cause starvation for low-priority ones.

---

## ⚡ Features

- Interactive user interface built using **HTML, CSS, and JavaScript**
- Real-time visualization of scheduling order
- Gantt chart-style dynamic updates for process execution
- Calculation of average waiting and turnaround times
- Option to compare algorithms side-by-side

---

## 🛠 Installation and Usage

### Step 1: Clone the repository
```bash
git clone https://github.com/DIPANSHU66/scheduling-algo..git
```

### Step 2: Open project folder
```bash
cd scheduling-algo
```

### Step 3: Run the project
You can simply open the `index.html` file in your browser.
Or, if using a local server:
```bash
npm install
npm run dev
```

### Step 4: Use the interface
- Enter process details (arrival time, burst time, etc.).
- Choose a scheduling algorithm.
- Click "Run" to see the live execution flow and Gantt chart.

---

## 🧮 Performance Metrics

Each algorithm calculates and displays the following:
- Average Waiting Time
- Average Turnaround Time
- Average Response Time

This helps in analyzing which algorithm performs better under different conditions.

---

## 🧰 Tech Stack

- **Frontend:**  React + Tailwind CSS
- **Framework:** Tailwind utilities (for responsive design)
- **Visualization:** Custom Gantt chart logic using DOM manipulation

## 🤝 Contributing

Contributions are welcome!
If you’d like to enhance the visualization or add more algorithms, follow these steps:

1. **Fork** the repository
2. **Create a new branch**
   ```bash
   git checkout -b feature-name
   ```
3. **Make your changes** and commit them
   ```bash
   git commit -m "Added advanced scheduling animation"
   ```
4. **Push the branch**
   ```bash
   git push origin feature-name
   ```
5. **Create a pull request**

---

## 👨‍💻 Author

**Dipanshu Bansal**
Student at **NIT Jalandhar** | Full Stack Developer | Tech Enthusiast  
📧 Email: dipanshu6bansal@gmail.com  
🌐 GitHub: [https://github.com/DIPANSHU66](https://github.com/DIPANSHU66)

---

## ⭐ Support

If you find this project helpful, please give it a ⭐ on GitHub!
It motivates me to build more open-
