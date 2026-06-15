import Visualizer from "./Visualizer";

const PriorityScheduling = ({ processes }) => {
  return <Visualizer algorithm="Priority (Preemptive)" processes={processes} />;
};

export default PriorityScheduling;