
import { ReactNode, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";

interface InteractiveFeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}

const InteractiveFeatureCard = ({ icon, title, description, onClick }: InteractiveFeatureCardProps) => {
  return (
    <Card 
      className="h-full transition-all duration-300 hover:shadow-xl hover:scale-[1.01] cursor-pointer border-2 hover:border-crowdai-blue/50" 
      onClick={onClick}
    >
      <CardHeader>
        <div className="w-12 h-12 bg-crowdai-blue/10 rounded-md flex items-center justify-center mb-2 text-crowdai-blue">
          {icon}
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-end">
        <Button variant="ghost" size="sm" className="text-crowdai-blue">
          Explore <ArrowUpRight className="ml-1 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default InteractiveFeatureCard;
