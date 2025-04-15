import { useState } from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { LineChart, AreaChart, Settings, Info, AlertTriangle } from "lucide-react";

const HeatmapVisualization = () => {
  const { toast } = useToast();
  const [userThreshold, setUserThreshold] = useState(30);
  const [selectedTab, setSelectedTab] = useState("live");
  const [heatmapData, setHeatmapData] = useState<{
    density: number;
    peopleCount: number;
    densityLevel: "low" | "moderate" | "high";
  }>({
    density: 45,
    peopleCount: 23,
    densityLevel: "moderate"
  });
  
  const handleThresholdChange = (value: number[]) => {
    setUserThreshold(value[0]);
  };
  
  const checkUserThreshold = () => {
    if (heatmapData.density <= userThreshold) {
      toast({
        title: "Good to go!",
        description: `The current density (${heatmapData.density}%) is below your threshold (${userThreshold}%).`,
        variant: "default",
      });
    } else {
      toast({
        title: "Threshold Exceeded",
        description: `The current density (${heatmapData.density}%) exceeds your threshold (${userThreshold}%).`,
        variant: "destructive",
      });
    }
  };
  
  const timePoints = ["8:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"];
  const densityValues = [15, 35, 65, 85, 55, 70, 30];
  const peopleCountValues = [8, 17, 32, 42, 27, 35, 15];
  
  return (
    <>
      <NavBar />
      
      <div className="container mx-auto px-4 pt-24 pb-10">
        <h1 className="text-3xl font-bold mb-8">Crowd Heatmap Visualization</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Visualization</h2>
                <TabsList className="mt-2 md:mt-0">
                  <TabsTrigger value="live">Live View</TabsTrigger>
                  <TabsTrigger value="historical">Historical Data</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="live" className="mt-0">
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="w-full h-[400px] relative">
                    <div className="absolute inset-0" style={{
                      background: `radial-gradient(circle at center, 
                        rgba(239, 68, 68, 0.8) 20%,
                        rgba(245, 158, 11, 0.7) 50%,
                        rgba(34, 197, 94, 0.6) 90%,
                        transparent)`
                    }}></div>
                    
                    {Array.from({length: 30}).map((_, i) => (
                      <div 
                        key={i}
                        className="absolute w-2 h-2 rounded-full bg-white"
                        style={{
                          top: `${Math.random() * 90 + 5}%`,
                          left: `${Math.random() * 90 + 5}%`,
                          opacity: 0.7
                        }}
                      ></div>
                    ))}
                    
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between text-sm text-white font-medium">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                        <span>Low (0-30%)</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-amber-500 mr-1"></div>
                        <span>Moderate (30-70%)</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
                        <span>High (70-100%)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="historical" className="mt-0">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="w-full h-[350px] relative">
                    <div className="absolute inset-0 flex flex-col">
                      <div className="flex-1 flex items-end">
                        <div className="w-full flex items-end justify-between h-full">
                          {densityValues.map((value, index) => (
                            <div key={index} className="flex-1 flex flex-col items-center">
                              <div 
                                className={`w-[80%] ${
                                  value >= 70 ? "bg-red-500" : 
                                  value >= 30 ? "bg-amber-500" : 
                                  "bg-green-500"
                                }`} 
                                style={{ height: `${value}%` }}
                              ></div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="h-8 mt-4 flex justify-between">
                        {timePoints.map((time, index) => (
                          <span key={index} className="text-xs">{time}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Morning</span>
                      <span>Afternoon</span>
                      <span>Evening</span>
                    </div>
                    <p className="mt-4 text-sm text-gray-600">
                      This chart shows crowd density throughout the day. Peak hours typically occur around noon and early evening.
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Analysis</h2>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  heatmapData.densityLevel === "high" ? "bg-red-100 text-red-700" : 
                  heatmapData.densityLevel === "moderate" ? "bg-amber-100 text-amber-700" : 
                  "bg-green-100 text-green-700"
                }`}>
                  {heatmapData.densityLevel.charAt(0).toUpperCase() + heatmapData.densityLevel.slice(1)} Density
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-500">Current Density</span>
                    <span className="text-sm font-medium">{heatmapData.density}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${
                        heatmapData.densityLevel === "high" ? "bg-red-500" : 
                        heatmapData.densityLevel === "moderate" ? "bg-amber-500" : "bg-green-500"
                      }`}
                      style={{ width: `${heatmapData.density}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-500">People Count</span>
                    <span className="text-sm font-medium">{heatmapData.peopleCount}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="h-2.5 rounded-full bg-blue-500"
                      style={{ width: `${heatmapData.peopleCount * 2}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500">Your Density Threshold</span>
                    <span className="text-sm font-medium">{userThreshold}%</span>
                  </div>
                  <Slider 
                    value={[userThreshold]} 
                    onValueChange={handleThresholdChange} 
                    max={100}
                    step={1}
                    className="mb-4"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Low (0-30%)</span>
                    <span>Moderate (30-70%)</span>
                    <span>High (70-100%)</span>
                  </div>
                </div>
                
                <Button 
                  onClick={checkUserThreshold}
                  className="w-full"
                >
                  Check Against My Threshold
                </Button>
                
                <Alert className={
                  heatmapData.density > userThreshold ? "border-red-500 bg-red-50" : "border-green-500 bg-green-50"
                }>
                  <AlertTriangle className={
                    heatmapData.density > userThreshold ? "text-red-500" : "text-green-500"
                  } />
                  <AlertTitle>{
                    heatmapData.density > userThreshold ? "Threshold Exceeded" : "Below Threshold"
                  }</AlertTitle>
                  <AlertDescription>{
                    heatmapData.density > userThreshold ? 
                    `Current density (${heatmapData.density}%) is higher than your threshold (${userThreshold}%). Not recommended to visit.` : 
                    `Current density (${heatmapData.density}%) is lower than your threshold (${userThreshold}%). Safe to visit.`
                  }</AlertDescription>
                </Alert>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeatmapVisualization;
