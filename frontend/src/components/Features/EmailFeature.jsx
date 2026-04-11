import FeatureBlock from "./FeatureBlock";
import Email from "../../assets/Emails-cuate.svg";

const EmailFeature = () => {
  return (
    <FeatureBlock
      badge="Email Sharing"
      title="Send generated reports instantly with Brevo"
      subtitle="Share summaries with teammates, clients, or faculty in one click."
      description="Once the report is generated, you can send it directly through email without copying and pasting content manually. This makes your workflow smoother and helps you distribute professional summaries quickly and efficiently."
      image= {Email}
      alt="Email sharing feature"
      reverse
    />
  );
};

export default EmailFeature;