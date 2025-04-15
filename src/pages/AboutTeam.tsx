
import NavBar from "@/components/NavBar";
import { Github, Linkedin, Mail } from "lucide-react";

interface TeamMemberProps {
  name: string;
  role: string;
  education: string;
  bio: string;
  email: string;
  image?: string;
  linkedin?: string;
  github?: string;
}

const TeamMember = ({ name, role, education, bio, email, image, linkedin, github }: TeamMemberProps) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    <div className="h-64 bg-gradient-to-r from-crowdai-blue to-crowdai-purple flex items-center justify-center">
      {image ? (
        <img src={image} alt={name} className="h-48 w-48 object-cover rounded-full border-4 border-white" />
      ) : (
        <div className="h-48 w-48 rounded-full bg-white flex items-center justify-center text-4xl font-bold text-crowdai-blue">
          {name.charAt(0)}
        </div>
      )}
    </div>
    <div className="p-6">
      <h3 className="text-xl font-bold mb-1">{name}</h3>
      <p className="text-crowdai-blue mb-2">{role}</p>
      <p className="text-gray-600 mb-3"><strong>Education:</strong> {education}</p>
      <p className="text-gray-600 mb-4">{bio}</p>
      <div className="flex space-x-3">
        <a href={`mailto:${email}`} className="text-gray-500 hover:text-crowdai-blue">
          <Mail className="h-5 w-5" />
        </a>
        {linkedin && (
          <a href={linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-crowdai-blue">
            <Linkedin className="h-5 w-5" />
          </a>
        )}
        {github && (
          <a href={github} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-crowdai-blue">
            <Github className="h-5 w-5" />
          </a>
        )}
      </div>
    </div>
  </div>
);

const AboutTeam = () => {
  // Sample team data - replace with actual team information
  const teamMembers: TeamMemberProps[] = [
    {
      name: "Alex Johnson",
      role: "Project Lead & AI Specialist",
      education: "M.S. in Computer Science, Stanford University",
      bio: "Alex has over 10 years of experience in AI and machine learning, specializing in computer vision applications. He leads the overall development and strategic direction of CrowdAI.",
      email: "alex.johnson@crowdai.com",
      linkedin: "https://linkedin.com/in/alexjohnson",
      github: "https://github.com/alexjohnson"
    },
    {
      name: "Sophia Chen",
      role: "Computer Vision Engineer",
      education: "Ph.D. in Computer Science, MIT",
      bio: "Sophia is an expert in computer vision algorithms with a Ph.D. in Computer Science. She designs and optimizes the core detection models used in the CrowdAI system.",
      email: "sophia.chen@crowdai.com",
      github: "https://github.com/sophiachen",
      linkedin: "https://linkedin.com/in/sophiachen"
    },
    {
      name: "Marcus Rodriguez",
      role: "Backend Developer",
      education: "B.S. in Software Engineering, University of California",
      bio: "Marcus specializes in scalable backend systems and real-time data processing. He ensures CrowdAI can handle massive data volumes with minimal latency.",
      email: "marcus.rodriguez@crowdai.com",
      github: "https://github.com/marcusrod",
      linkedin: "https://linkedin.com/in/marcusrodriguez"
    },
    {
      name: "Priya Patel",
      role: "UX/UI Designer",
      education: "M.F.A. in Interaction Design, Rhode Island School of Design",
      bio: "Priya creates intuitive interfaces that make complex analytics accessible. Her design approach focuses on clarity and actionable insights for users of all technical levels.",
      email: "priya.patel@crowdai.com",
      linkedin: "https://linkedin.com/in/priyapatel",
      github: "https://github.com/priyapatel"
    },
    {
      name: "David Kim",
      role: "Data Scientist",
      education: "M.S. in Data Science, University of Washington",
      bio: "David applies statistical methods and predictive modeling to enhance the accuracy of crowd analysis. He specializes in pattern recognition and anomaly detection.",
      email: "david.kim@crowdai.com",
      github: "https://github.com/davidkim",
      linkedin: "https://linkedin.com/in/davidkim"
    }
  ];

  return (
    <>
      <NavBar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-to-r from-crowdai-purple to-crowdai-indigo text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Meet Our Team</h1>
          <p className="text-xl max-w-3xl mx-auto">
            The brilliant minds behind CrowdAI's innovative crowd detection and analysis system.
          </p>
        </div>
      </section>
      
      {/* Team Introduction */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold mb-6">Our Experts</h2>
            <p className="text-lg text-gray-700">
              CrowdAI brings together a diverse team of specialists in artificial intelligence, computer vision, software development, and industry-specific expertise. We're united by a passion for creating technology that enhances public safety and improves operational efficiency.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <TeamMember key={member.name} {...member} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutTeam;
