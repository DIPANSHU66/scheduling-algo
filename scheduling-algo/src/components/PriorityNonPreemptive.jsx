import Visualizer from "./Visualizer";

const PriorityNonPreemptive = ({ processes }) => {
  return <Visualizer algorithm="Priority (Non-Preemptive)" processes={processes} />;
};

export default PriorityNonPreemptive;