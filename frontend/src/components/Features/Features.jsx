import SummaryFeature from "./SummaryFeature";
import ActionFeature from "./ActionFeature";
import SpeakerFeature from "./SpeakerFeature";
import EmailFeature from "./EmailFeature";

const Features = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 text-center mb-16">
        <span className="inline-block px-4 py-1 rounded-full bg-amber-100 text-amber-700 text-sm font-medium mb-4">
          Features
        </span>

        <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
          Everything you need for smarter meeting notes
        </h2>

        <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
          From summary generation to email sharing, your meeting assistant helps
          you save time, stay organized, and communicate clearly.
        </p>
      </div>

      <div className="space-y-24">
        <SummaryFeature />
        <ActionFeature />
        <SpeakerFeature />
        <EmailFeature />
      </div>
    </section>
  );
};

export default Features;