import { useNavigate } from "react-router-dom";
import NavBar from "@/components/NavBar";
import FeatureSection from "@/components/FeatureSection";
import InteractiveFeatureCard from "@/components/InteractiveFeatureCard";
import { Upload, Activity, Bell, Eye, BarChart3, Shield, BrainCircuit, AlertCircle } from "lucide-react";

const Features = () => {
  const navigate = useNavigate();
  
  return (
    <>
      <NavBar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-r from-crowdai-blue to-crowdai-purple text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Powerful Features</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Explore the comprehensive capabilities of our crowd detection and analysis system.
          </p>
        </div>
      </section>
      
      {/* Interactive Feature Cards */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Core Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <InteractiveFeatureCard
              icon={<Upload className="h-6 w-6" />}
              title="Media Upload"
              description="Upload images or videos of crowds for detailed analysis and heatmap generation."
              onClick={() => navigate("/media-upload")}
            />
            
            <InteractiveFeatureCard
              icon={<Activity className="h-6 w-6" />}
              title="Heatmap Visualization"
              description="Advanced visualization of crowd density with customizable thresholds and alerts."
              onClick={() => navigate("/heatmap")}
            />
            
            <InteractiveFeatureCard
              icon={<Bell className="h-6 w-6" />}
              title="Alert System"
              description="Receive notifications when crowd density exceeds your specified thresholds."
              onClick={() => navigate("/alert")}
            />
          </div>
        </div>
      </section>
      
      {/* Features Sections - Add padding top to ensure heading isn't covered by navbar */}
      <section className="py-16" id="feature-details">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-16 text-center pt-8">Feature Details</h2>
          
          <FeatureSection
            title="Real-Time Monitoring"
            description="Monitor crowd density and movement patterns in real-time with advanced computer vision."
            icon={<Eye className="h-8 w-8" />}
          >
            <ul className="space-y-4 mb-6">
              <li className="flex items-start">
                <span className="text-crowdai-blue mr-3">✓</span>
                <span>Live crowd density mapping with heat map visualization</span>
              </li>
              <li className="flex items-start">
                <span className="text-crowdai-blue mr-3">✓</span>
                <span>Directional flow analysis of crowd movement</span>
              </li>
              <li className="flex items-start">
                <span className="text-crowdai-blue mr-3">✓</span>
                <span>Automatic detection of unusually dense areas</span>
              </li>
              <li className="flex items-start">
                <span className="text-crowdai-blue mr-3">✓</span>
                <span>Multi-camera integration for comprehensive coverage</span>
              </li>
            </ul>
          </FeatureSection>
          
          <FeatureSection
            title="Advanced Analytics Dashboard"
            description="Access comprehensive analytics and visualizations to understand crowd behavior."
            icon={<BarChart3 className="h-8 w-8" />}
            reversed
          >
            <ul className="space-y-4 mb-6">
              <li className="flex items-start">
                <span className="text-crowdai-blue mr-3">✓</span>
                <span>Intuitive dashboard with customizable views</span>
              </li>
              <li className="flex items-start">
                <span className="text-crowdai-blue mr-3">✓</span>
                <span>Historical data comparison and trend analysis</span>
              </li>
              <li className="flex items-start">
                <span className="text-crowdai-blue mr-3">✓</span>
                <span>Exportable reports in multiple formats</span>
              </li>
              <li className="flex items-start">
                <span className="text-crowdai-blue mr-3">✓</span>
                <span>Custom KPIs and metrics configuration</span>
              </li>
            </ul>
          </FeatureSection>
          
          <FeatureSection
            title="Predictive Alerts"
            description="Receive proactive alerts when crowd conditions approach critical thresholds."
            icon={<AlertCircle className="h-8 w-8" />}
          >
            <ul className="space-y-4 mb-6">
              <li className="flex items-start">
                <span className="text-crowdai-blue mr-3">✓</span>
                <span>Customizable alert thresholds based on venue capacity</span>
              </li>
              <li className="flex items-start">
                <span className="text-crowdai-blue mr-3">✓</span>
                <span>Multi-channel notifications (SMS, email, in-app)</span>
              </li>
              <li className="flex items-start">
                <span className="text-crowdai-blue mr-3">✓</span>
                <span>Escalation protocols for critical situations</span>
              </li>
              <li className="flex items-start">
                <span className="text-crowdai-blue mr-3">✓</span>
                <span>Predictive warnings based on trend analysis</span>
              </li>
            </ul>
          </FeatureSection>
        </div>
      </section>
    </>
  );
};

export default Features;
