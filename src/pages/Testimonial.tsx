
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import TestimonialCard from "@/components/TestimonialCard";

const Testimonial = () => {
  const testimonials = [
    {
      content: "The CrowdAI system has completely transformed how we manage event security. The real-time alerts have helped us prevent several potential safety incidents. We can now proactively address crowd density issues before they become dangerous, and the staff allocation recommendations have improved our operational efficiency by over 30%.",
      author: "Sarah Johnson",
      role: "Head of Security, Metro Events",
    },
    {
      content: "As a shopping mall manager, understanding customer flow patterns has always been challenging. CrowdAI provides insights that have helped us optimize store layouts and staffing. Since implementing the system, we've seen a 15% increase in average time spent in the mall and a significant boost in retailer satisfaction scores.",
      author: "Michael Chen",
      role: "Operations Director, Westside Mall",
    },
    {
      content: "The predictive analytics have been a game-changer for our transit system. We can now anticipate crowding before it happens and adjust our services accordingly. This has resulted in improved customer satisfaction and a more efficient allocation of our resources during peak hours.",
      author: "David Rodriguez",
      role: "CTO, Urban Transport Authority",
    },
    {
      content: "We deployed CrowdAI for our annual music festival, and the insights were invaluable. We could see in real-time which stages were becoming overcrowded and redirect attendees to other areas. The system's accuracy in predicting crowd movements based on scheduled performances helped us create a safer, more enjoyable experience.",
      author: "Emma Thompson",
      role: "Festival Coordinator, SoundWave Events",
    },
    {
      content: "The integration with our existing security cameras was seamless, and the training period for the AI was surprisingly short. Within weeks, we were receiving accurate insights that helped us reconfigure our airport security checkpoints. The result has been shorter wait times and improved passenger satisfaction.",
      author: "James Wilson",
      role: "Security Manager, International Airport",
    },
    {
      content: "As a city planner, CrowdAI has provided us with data we never had access to before. The insights into pedestrian traffic patterns have informed several urban development projects, leading to more efficient public spaces and improved safety measures at key intersections.",
      author: "Sophia Nguyen",
      role: "Urban Planning Director, City Development Office",
    }
  ];

  return (
    <>
      <NavBar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-to-r from-crowdai-indigo to-crowdai-blue text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Client Testimonials</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Discover how CrowdAI has transformed operations for organizations across various sectors.
          </p>
        </div>
      </section>
      
      {/* Featured Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">What Our Clients Say</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real feedback from customers who have experienced the power of our crowd detection and analysis system.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard 
                key={index}
                content={testimonial.content}
                author={testimonial.author}
                role={testimonial.role}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Case Studies Preview */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Success Stories</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore detailed case studies showcasing how our technology has delivered measurable results.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gradient-to-r from-crowdai-blue to-crowdai-purple"></div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Major Sports Venue</h3>
                <p className="text-gray-600 mb-4">
                  How a 60,000-seat stadium improved safety and visitor experience using CrowdAI's real-time monitoring.
                </p>
                <a href="#" className="text-crowdai-blue hover:text-blue-700 font-medium flex items-center">
                  Read Case Study 
                  <svg className="ml-1 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gradient-to-r from-crowdai-purple to-crowdai-indigo"></div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Shopping Center Chain</h3>
                <p className="text-gray-600 mb-4">
                  How retail analytics improved store placements and increased average visitor spending by 23%.
                </p>
                <a href="#" className="text-crowdai-purple hover:text-purple-700 font-medium flex items-center">
                  Read Case Study 
                  <svg className="ml-1 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gradient-to-r from-crowdai-indigo to-crowdai-blue"></div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Public Transit Authority</h3>
                <p className="text-gray-600 mb-4">
                  How predictive crowd analytics helped optimize schedules and reduce platform overcrowding by 35%.
                </p>
                <a href="#" className="text-crowdai-indigo hover:text-indigo-700 font-medium flex items-center">
                  Read Case Study 
                  <svg className="ml-1 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-crowdai-dark text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Become Our Next Success Story?</h2>
          <p className="text-xl max-w-3xl mx-auto mb-8">
            Join the growing list of organizations that have transformed their operations with CrowdAI.
          </p>
          <a 
            href="/contact" 
            className="inline-block bg-crowdai-blue hover:bg-blue-700 px-6 py-3 rounded-md text-lg font-medium transition-colors"
          >
            Get Started Today
          </a>
        </div>
      </section>
      
      <Footer />
    </>
  );
};

export default Testimonial;
