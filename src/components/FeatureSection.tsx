
import { ReactNode } from "react";

interface FeatureSectionProps {
  title: string;
  description: string;
  icon: ReactNode;
  children: ReactNode;
  reversed?: boolean;
}

const FeatureSection = ({ title, description, icon, children, reversed = false }: FeatureSectionProps) => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className={`flex flex-col ${reversed ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8`}>
          <div className="md:w-1/2 space-y-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-crowdai-blue/10 rounded-md flex items-center justify-center text-crowdai-blue">
                {icon}
              </div>
              <h2 className="text-3xl font-bold">{title}</h2>
            </div>
            <p className="text-xl text-gray-600 mb-6">
              {description}
            </p>
            {children}
          </div>
          <div className="md:w-1/2">
            <div className="h-full w-full bg-gray-100 rounded-lg overflow-hidden">
              <div className="w-full h-full flex items-center justify-center p-8">
                <div className="w-16 h-16 text-crowdai-blue">
                  {icon}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
