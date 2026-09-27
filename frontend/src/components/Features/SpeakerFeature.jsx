import FeatureBlock from "./FeatureBlock";
import speak from "../../assets/speak.png";

const SpeakerFeature = () => {
  return (
    <FeatureBlock
      badge="Speaker Insights"
      title="Understand conversations speaker by speaker"
      subtitle="Get better visibility into who said what."
      description="By analyzing the transcript structure, the app helps organize discussions in a more meaningful way. This makes it easier to review conversations, identify contributions, and understand the flow of the meeting."
      image={speak}
      alt="Speaker insights feature"
    />
  );
};

export default SpeakerFeature;