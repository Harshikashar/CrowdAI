
import NavBar from "@/components/NavBar";
import { ArrowRight, Shield, Users, Clock, Hospital } from "lucide-react";

const AboutProject = () => {
  return (
    <>
      <NavBar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-to-r from-crowdai-blue to-crowdai-purple text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About Our Project</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Discover the technology and vision behind CrowdAI's advanced crowd detection and analysis system.
          </p>
        </div>
      </section>
      
      {/* Overview Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-crowdai-dark">Project Overview</h2>
            <p className="text-lg text-gray-700 mb-6">
              CrowdAI is an innovative crowd detection and analysis system that leverages advanced artificial intelligence and computer vision technologies to monitor crowd densities, movement patterns, and behaviors in real-time.
            </p>
            <p className="text-lg text-gray-700 mb-6">
              Our system was born out of the need for more effective crowd management solutions across various sectors including public safety, event management, retail, transportation, and urban planning. By providing accurate, real-time data and predictive insights, we enable organizations to make informed decisions that enhance safety, optimize operations, and improve user experiences.
            </p>
            <p className="text-lg text-gray-700">
              Developed by a team of AI specialists, computer vision experts, and industry professionals, CrowdAI represents the cutting edge in crowd analytics technology. Our commitment to continuous improvement ensures that our system evolves alongside emerging technologies and changing customer needs.
            </p>
          </div>
        </div>
      </section>
      
      {/* Technology Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Technology</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h3 className="text-2xl font-semibold mb-4 text-crowdai-blue">Advanced Computer Vision</h3>
              <p className="text-lg text-gray-700 mb-4">
                Our system employs state-of-the-art computer vision algorithms that can accurately identify and track individuals within crowds, even in challenging lighting conditions or partially obscured views.
              </p>
              <p className="text-lg text-gray-700">
                These algorithms are capable of distinguishing between different types of movement patterns, detecting anomalies, and providing accurate crowd density measurements across various environments.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg flex items-center justify-center">
              <svg className="h-32 w-32 text-crowdai-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
          </div>
        </div>
      </section>
      
      {/* Applications Section - Updated with 3 focused use cases */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Applications & Use Cases</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-xl">
              <div className="w-12 h-12 bg-crowdai-blue/10 rounded-md flex items-center justify-center mb-4 text-crowdai-blue">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Time Management</h3>
              <p className="text-gray-700">
                Optimize scheduling and resource allocation by analyzing peak hours and crowd flow patterns. Reduce wait times by predicting busy periods and adjusting staffing levels accordingly.
              </p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-xl">
              <div className="w-12 h-12 bg-crowdai-purple/10 rounded-md flex items-center justify-center mb-4 text-crowdai-purple">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Public Safety</h3>
              <p className="text-gray-700">
                Enhance security by monitoring crowd density and detecting unusual patterns. Prevent overcrowding in public spaces and improve emergency response by identifying potential hazards before they escalate.
              </p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-xl">
              <div className="w-12 h-12 bg-crowdai-indigo/10 rounded-md flex items-center justify-center mb-4 text-crowdai-indigo">
                <Hospital className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Healthcare</h3>
              <p className="text-gray-700">
                Improve patient flow in hospitals and clinics by monitoring waiting areas and optimizing appointment scheduling. Ensure social distancing in healthcare facilities during outbreaks and peak seasons.
              </p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-xl">
              <div className="w-12 h-12 bg-crowdai-blue/10 rounded-md flex items-center justify-center mb-4 text-crowdai-blue">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Event Management</h3>
              <p className="text-gray-700">
                Optimize venue layouts and entry/exit points based on crowd flow analysis. Enhance attendee experience by monitoring popular areas and adapting resources in real-time during conferences, concerts, and festivals.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Future Vision Section */}
      <section className="py-16 bg-crowdai-dark text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Our Vision for the Future</h2>
            <p className="text-lg mb-6">
              We are committed to continuous innovation and improvement of our crowd detection and analysis system. Our roadmap includes enhanced predictive capabilities, integration with IoT devices, and expanded applications across new sectors.
            </p>
            <p className="text-lg">
              As AI technology evolves, so will CrowdAI, maintaining its position at the forefront of crowd analytics technology while prioritizing privacy, accuracy, and actionable insights for our clients.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutProject;
