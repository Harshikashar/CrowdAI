
import NavBar from "@/components/NavBar";
import { Github, Linkedin, Mail } from "lucide-react";

interface TeamMemberProps {
  name: string;
  roll: string;
  education: string;
  
  email: string;
  image?: string;
  linkedin?: string;
  github?: string;
}

const TeamMember = ({ name, roll, education, email, image, linkedin, github }: TeamMemberProps) => (
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
      <p className="text-crowdai-blue mb-2">{roll}</p>
      <p className="text-gray-600 mb-3"><strong>Education:</strong> {education}</p>
      
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
      name: "Sanskriti Jain",
      roll:"2216377",
      education: "B.Tech in Computer Science, Banasthali Vidyapith",
      email: "sanskriti8015@gmail.com",
      linkedin: "https://linkedin.com/in/sanskriti-jain-b85256265 ",
      
    },
    {
      name: "Supriya Kumari",
      roll:"2216912",
      education: "B.Tech in Information Technology, Banasthali Vidyapith",
      email: "supriyeah047@gmail.com",
      
      linkedin: "https://linkedin.com/in/supriya-kumari-866b0824b"
    },
    {
      name: "Ritika Malik",
      roll:"2216881",
      education: "B.Tech in Information technology, Banasthali Vidyapith",
      email: "ritiika.maliik@gmail.com",
      linkedin: "https://linkedin.com/in/ritika3112"
    },
    {
      name: "Harshika Sharma",
      roll:"2216276",
      education: "B.Tech in Computer Science, Banasthali Vidyapith",
      email: "sharshika408@gmil.com",
      linkedin: "https://linkedin.com/in/harshika-sharma-",
    },
    {
      name: "Sakshi Chauhan",
      roll:"2216374",
      education: "B.Tech in Computer Science, Banasthali Vidyapith",
      email: "sakshichauhan120404@gmail.com",
      linkedin: "https://linkedin.com/in/sakshi-chauhan-0b1a1a1b4",
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
