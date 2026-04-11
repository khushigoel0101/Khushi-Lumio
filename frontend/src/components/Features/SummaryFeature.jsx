import FeatureBlock from "./FeatureBlock";
import sum from "../../assets/Font-rafiki.svg";

const SummaryFeature = () => {
  return (
    <FeatureBlock
      badge="AI Summaries"
      title="Generate clear and structured meeting summaries"
      subtitle="Turn long transcripts into concise notes within seconds."
      description="Our AI quickly analyzes your meeting transcript and creates readable summaries that highlight the main discussion points, key decisions, and overall context. This helps you save time and stay focused on what actually matters."
      image={sum}
      alt="AI summary feature"
    />
  );
};

export default SummaryFeature;