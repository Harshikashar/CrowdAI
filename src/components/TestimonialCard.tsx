
interface TestimonialCardProps {
  content: string;
  author: string;
  role: string;
  avatar?: string; 
}

const TestimonialCard = ({ content, author, role, avatar }: TestimonialCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-center mb-4">
        <div className="mr-4">
          {avatar ? (
            <img 
              src={avatar}
              alt={author}
              className="w-12 h-12 rounded-full"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-crowdai-blue to-crowdai-purple flex items-center justify-center text-white font-bold text-lg">
              {author.charAt(0)}
            </div>
          )}
        </div>
        <div>
          <h4 className="font-medium text-lg">{author}</h4>
          <p className="text-gray-600 text-sm">{role}</p>
        </div>
      </div>
      <blockquote>
        <p className="text-gray-700 italic">"{content}"</p>
      </blockquote>
      <div className="mt-4 flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg 
            key={star}
            className="w-5 h-5 text-yellow-500" 
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    </div>
  );
};

export default TestimonialCard;
