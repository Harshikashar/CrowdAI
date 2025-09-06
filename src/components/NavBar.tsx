
import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const NavBar = () => {
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  
  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-sm z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-crowdai-blue to-crowdai-purple rounded-md flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-crowdai-blue to-crowdai-purple bg-clip-text text-transparent">CrowdAI</span>
          </Link>
          
          {/* Nav Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-crowdai-dark hover:text-crowdai-blue transition-colors">Home</Link>
            
            {/* About Us Dropdown */}
            <div className="relative">
              <button 
                className="flex items-center text-crowdai-dark hover:text-crowdai-blue transition-colors"
                onClick={() => setAboutDropdownOpen(!aboutDropdownOpen)}
              >
                About Us <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              
              {/* Dropdown Menu */}
              <div 
                className={cn(
                  "absolute top-full left-0 mt-2 w-48 bg-white shadow-md rounded-md overflow-hidden z-50 transition-all duration-150",
                  aboutDropdownOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
                )}
              >
                <Link 
                  to="/about/project" 
                  className="block px-4 py-2 text-sm hover:bg-gray-50 hover:text-crowdai-blue"
                  onClick={() => setAboutDropdownOpen(false)}
                >
                  About Project
                </Link>
                <Link 
                  to="/about/team" 
                  className="block px-4 py-2 text-sm hover:bg-gray-50 hover:text-crowdai-blue"
                  onClick={() => setAboutDropdownOpen(false)}
                >
                  About Team
                </Link>
              </div>
            </div>
            
            <Link to="/features" className="text-crowdai-dark hover:text-crowdai-blue transition-colors">Features</Link>
            <Link to="/contact" className="text-crowdai-dark hover:text-crowdai-blue transition-colors">Contact Us</Link>
          </nav>
          
          {/* Mobile menu button - implement mobile menu later if needed */}
          <button className="md:hidden text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
