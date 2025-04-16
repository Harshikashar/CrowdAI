import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

interface DetectionData {
  peopleCount: number;
  density: number;
  densityLevel: "low" | "moderate" | "high";
}

interface StoredFrameData {
  image: string;
  detectionData: DetectionData;
  timestamp: string;
}


const ImageHeatmap = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userThreshold, setUserThreshold] = useState(30);
  const [heatmapImage, setHeatmapImage] = useState<string | null>(null);
  const [frameData, setFrameData] = useState<StoredFrameData | null>(null);
  
  useEffect(() => {
    const storedData = localStorage.getItem('lastFrameData');
    
    if (!storedData) {
      setError("No image data found. Please capture an image first.");
      setLoading(false);
      return;
    }
    
    try {
      const parsedData: StoredFrameData = JSON.parse(storedData);
      setFrameData(parsedData);
      
      // Generate heatmap from the stored image
      generateHeatmap();
    } catch (err) {
      setError("Failed to parse stored image data.");
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  

  const generateHeatmap = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5001/generate-heatmap");
      if (response.data && response.data.heatmap) {
        setHeatmapImage(`data:image/jpeg;base64,${response.data.heatmap}`);
        toast({
          title: "Heatmap Generated",
          description: "Heatmap has been successfully generated from the captured image.",
        });
      } else {
        setError("Failed to generate heatmap.");
      }
    } catch (err) {
      console.error("Error generating heatmap:", err);
      setError("Failed to connect to the backend server.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackClick = () => {
    navigate("/camera");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            <Button variant="ghost" size="sm" onClick={handleBackClick} className="mr-2">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Camera
            </Button>
            <h1 className="text-3xl font-bold pt-10">Image Heatmap Analysis</h1>
          </div>
          
          {error ? (
            <Alert variant="destructive" className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : loading ? (
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="animate-pulse">
                <div className="h-64 bg-gray-200 rounded-md mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
              </div>
              <p className="text-gray-500 mt-4">Generating heatmap...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="aspect-video bg-gray-900 relative">
                  {heatmapImage && (
                    <img 
                      src={heatmapImage} 
                      alt="Heatmap visualization"
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-2">Crowd Density Heatmap</h3>
                  <p className="text-sm text-gray-500">
                    Captured at {frameData?.timestamp ? new Date(frameData.timestamp).toLocaleString() : "unknown time"}
                  </p>
                </div>
              </div>

              {frameData?.detectionData && (
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="font-semibold mb-4">Analysis Results</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-500">People Detected</span>
                        <span className="font-medium">{frameData.detectionData.peopleCount}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full bg-blue-500"
                          style={{ width: `${Math.min(100, frameData.detectionData.peopleCount * 2)}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-500">Crowd Density</span>
                        <span className="font-medium">{frameData.detectionData.density}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            frameData.detectionData.densityLevel === 'high' ? 'bg-red-500' : 
                            frameData.detectionData.densityLevel === 'moderate' ? 'bg-amber-500' : 
                            'bg-green-500'
                          }`}
                          style={{ width: `${frameData.detectionData.density}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className={`mt-6 p-4 rounded-lg border ${
                      frameData.detectionData.densityLevel === 'high' ? 'bg-red-50 border-red-200' : 
                      frameData.detectionData.densityLevel === 'moderate' ? 'bg-amber-50 border-amber-200' : 
                      'bg-green-50 border-green-200'
                    }`}>
                      <div className="flex items-start">
                        <AlertTriangle className={`h-5 w-5 mt-0.5 mr-2 ${
                          frameData.detectionData.densityLevel === 'high' ? 'text-red-500' : 
                          frameData.detectionData.densityLevel === 'moderate' ? 'text-amber-500' : 
                          'text-green-500'
                        }`} />
                        <div className="pt-4">
                            <label className="block text-sm font-medium mb-1">Your Density Threshold</label>
                            <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            step="1" 
                            value={userThreshold} 
                            onChange={(e) => setUserThreshold(parseInt(e.target.value))}
                            className="w-full"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>Low (0-30%)</span>
                            <span>Moderate (30-70%)</span>
                            <span>High (70-100%)</span>
                            </div>
                            <div className="text-right mt-1 text-sm font-medium">
                            Threshold: {userThreshold}%
                            </div>
                            <Button 
                            className="mt-4 w-full" 
                            onClick={() => {
                                if (frameData.detectionData.density > userThreshold) {
                                toast({
                                    title: "Threshold Exceeded",
                                    description: `Current density (${frameData.detectionData.density}%) is higher than your threshold (${userThreshold}%). Not recommended to visit.`,
                                    variant: "destructive"
                                });
                                } else {
                                toast({
                                    title: "Safe Zone",
                                    description: `Current density (${frameData.detectionData.density}%) is within your safe threshold (${userThreshold}%).`,
                                });
                                }
                            }}
                            >
                            Check Against My Threshold
                            </Button>
                        </div>

                        {/* Auto Alert Box */}
                        {frameData.detectionData.density > userThreshold && (
                            <div className="mt-6 p-4 rounded-lg border bg-red-50 border-red-200">
                            <div className="flex items-start">
                                <AlertTriangle className="h-5 w-5 mt-0.5 mr-2 text-red-500" />
                                <div>
                                <p className="font-medium">⚠️ Threshold Exceeded</p>
                                <p className="text-sm mt-1">
                                    Current density ({frameData.detectionData.density}%) is higher than your threshold ({userThreshold}%). Not recommended to visit.
                                </p>
                                </div>
                            </div>
                            </div>
                        )}
                        </div>
                    </div>


                        <div>
                          <p className="font-medium">
                            {frameData.detectionData.densityLevel === 'high' ? 'High Density Alert' : 
                             frameData.detectionData.densityLevel === 'moderate' ? 'Moderate Density Warning' : 
                             'Low Density - Safe Zone'}
                          </p>
                          <p className="text-sm mt-1">
                            {frameData.detectionData.densityLevel === 'high' ? 
                              'This area is currently overcrowded. Consider redirecting traffic or implementing crowd control measures.' : 
                             frameData.detectionData.densityLevel === 'moderate' ? 
                              'This area is moderately crowded. Monitor the situation closely for any changes.' : 
                              'This area has low crowd density. Safe for normal operations.'}
                          </p>
                        </div>
                      </div>
                    </div>
                 
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ImageHeatmap;
