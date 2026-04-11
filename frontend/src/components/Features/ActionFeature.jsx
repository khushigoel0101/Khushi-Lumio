import FeatureBlock from "./FeatureBlock";
import tasks from "../../assets/undraw_tasks_l9ct.svg";
const ActionFeature = () => {
  return (
    <FeatureBlock
      badge="Action Items"
      title="Extract tasks and follow-ups automatically"
      subtitle="Never miss an assignment or responsibility again."
      description="The system identifies action items from meeting discussions and helps you track who needs to do what. Instead of manually reviewing every transcript, you get a clear view of the next steps instantly."
      image={tasks}
      alt="Action items feature"
      reverse
    />
  );
};

export default ActionFeature;