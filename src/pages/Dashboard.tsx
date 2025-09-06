
/*import { useState, useRef, useEffect } from "react";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Camera, AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const Dashboard = () => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionResults, setDetectionResults] = useState<{
    count: number;
    density: number;
    densityLevel: "low" | "moderate" | "high";
  } | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Clean up webcam stream when component unmounts
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  // YOLOv8 simulation function - in a real implementation, this would use the actual YOLOv8 model
  //const processFrameWithYOLOv8 = (videoElement: HTMLVideoElement): {count: number, density: number} => {
    // This is a simulation - in a real app this would process the video frame through YOLOv8
    // For demonstration, we're generating semi-random but more realistic values
    
    // Get the current second to create a pattern
    //const seconds = new Date().getSeconds();
    
    // Create patterns based on time for more realistic simulation
    /*let baseCount;
    if (seconds < 20) {
      baseCount = 5 + Math.floor(seconds / 4); // Gradually increasing
    } else if (seconds < 40) {
      baseCount = 10 + Math.floor((seconds - 20) / 4); // Higher range
    } else {
      baseCount = 15 - Math.floor((seconds - 40) / 4); // Decreasing
    }
    
    // Add some randomness
    const count = Math.max(1, baseCount + Math.floor(Math.random() * 5 - 2));
    
    // Calculate density based on count and simulated area
    // Assuming 50 people would be 100% density for the given frame
    const density = Math.min(100, Math.round((count / 50) * 100));
    
    return { count, density };
  };*/


  /*const startLiveDetection = async () => {
    try {
      setIsDetecting(true);
      
      // Request access to the webcam
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      setStream(mediaStream);
      
      // Connect the webcam feed to the video element
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
        
        // Start YOLOv8 detection process
        /*const detectionInterval = setInterval(() => {
          if (videoRef.current) {
            const { count, density } = processFrameWithYOLOv8(videoRef.current);
            
            let densityLevel: "low" | "moderate" | "high";
            
            if (density < 30) {
              densityLevel = "low";
              toast({
                title: "Low Crowd Density Detected",
                description: "This area is not crowded. Kindly visit!",
                variant: "default",
              });
            } else if (density < 70) {
              densityLevel = "moderate";
              toast({
                title: "Moderate Crowd Density Detected",
                description: "This area has moderate crowds. You may visit.",
                variant: "default",
              });
            } else {
              densityLevel = "high";
              toast({
                title: "High Crowd Density Detected",
                description: "This area is very crowded. Don't visit!",
                variant: "destructive",
              });
            }

            setDetectionResults({
              count,
              density,
              densityLevel
            });
          }
        }, 3000);
        
        // For demonstration purposes, stop after 30 seconds
        setTimeout(() => {
          clearInterval(detectionInterval);
          if (!isDetecting) return; // Don't reset if user has already stopped detection
          setIsDetecting(false);
        }, 30000);
      }
      
    } catch (error) {
      console.error("Error accessing webcam:", error);
      toast({
        title: "Camera Access Failed",
        description: "Unable to access your camera. Please check permissions.",
        variant: "destructive",
      });
      setIsDetecting(false);
    }
  };
  */
  /*const stopDetection = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsDetecting(false);
  };

  return (
    <>
      <NavBar />
      
      <div className="container mx-auto px-4 pt-24 pb-10">
        <h1 className="text-3xl font-bold mb-8">Live Crowd Detection</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-gray-100 rounded-lg h-[400px] flex items-center justify-center relative overflow-hidden">
            {isDetecting ? (
              <>
                <video 
                  ref={videoRef} 
                  className="absolute inset-0 w-full h-full object-cover"
                  muted
                  playsInline
                />
                {detectionResults && (
                  <div className="absolute inset-0" style={{
                    background: `linear-gradient(to bottom, 
                      ${detectionResults.densityLevel === "high" ? "rgba(239, 68, 68, 0.6)" : 
                        detectionResults.densityLevel === "moderate" ? "rgba(245, 158, 11, 0.6)" : 
                        "rgba(34, 197, 94, 0.6)"}, 
                      transparent 70%)`,
                    pointerEvents: "none"
                  }}></div>
                )}
                {!detectionResults && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <div className="flex flex-col items-center text-white">
                      <Loader2 className="h-12 w-12 animate-spin mb-4" />
                      <p>Processing camera feed with YOLOv8...</p>
                    </div>
                  </div>
                )}
                {detectionResults && (
                  <div className="absolute top-4 left-4 text-white font-bold text-xl text-shadow">
                    {detectionResults.densityLevel === "high" ? "HIGH DENSITY" : 
                     detectionResults.densityLevel === "moderate" ? "MODERATE DENSITY" : 
                     "LOW DENSITY"}
                  </div>
                )}
              </>
            ) : detectionResults ? (
              <div className="w-full h-full p-4">
                <div className="w-full h-full relative rounded-lg overflow-hidden">
                  <div className="absolute inset-0" style={{
                    background: `linear-gradient(to bottom, 
                      ${detectionResults.densityLevel === "high" ? "rgba(239, 68, 68, 0.7)" : 
                        detectionResults.densityLevel === "moderate" ? "rgba(245, 158, 11, 0.7)" : 
                        "rgba(34, 197, 94, 0.7)"}, 
                      transparent)`,
                  }}></div>
                  
                  {/* Simulated detection visualization }
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white font-bold text-2xl drop-shadow-lg">
                      {detectionResults.densityLevel === "high" ? "HIGH DENSITY" : 
                       detectionResults.densityLevel === "moderate" ? "MODERATE DENSITY" : 
                       "LOW DENSITY"}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No camera feed active</p>
                <Button onClick={startLiveDetection}>
                  Start Camera Detection
                </Button>
              </div>
            )}
          </div>
          
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Detection Results</h2>
              
              {detectionResults ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">People Count</p>
                    <p className="text-2xl font-bold">{detectionResults.count}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Crowd Density</p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2 mb-1">
                      <div 
                        className={`h-2.5 rounded-full ${
                          detectionResults.densityLevel === "high" ? "bg-red-500" : 
                          detectionResults.densityLevel === "moderate" ? "bg-amber-500" : "bg-green-500"
                        }`}
                        style={{ width: `${detectionResults.density}%` }}
                      ></div>
                    </div>
                    <p className="text-sm">{detectionResults.density}%</p>
                  </div>
                  
                  <Alert className={
                    detectionResults.densityLevel === "high" ? "border-red-500 bg-red-50" : 
                    detectionResults.densityLevel === "moderate" ? "border-amber-500 bg-amber-50" : 
                    "border-green-500 bg-green-50"
                  }>
                    <AlertTriangle className={
                      detectionResults.densityLevel === "high" ? "text-red-500" : 
                      detectionResults.densityLevel === "moderate" ? "text-amber-500" : 
                      "text-green-500"
                    } />
                    <AlertTitle>{
                      detectionResults.densityLevel === "high" ? "High Density Alert" : 
                      detectionResults.densityLevel === "moderate" ? "Moderate Density Notice" : 
                      "Low Density Information"
                    }</AlertTitle>
                    <AlertDescription>{
                      detectionResults.densityLevel === "high" ? "This area is very crowded. Don't visit!" : 
                      detectionResults.densityLevel === "moderate" ? "This area has moderate crowds. You may visit." : 
                      "This area is not crowded. Kindly visit!"
                    }</AlertDescription>
                  </Alert>
                </div>
              ) : (
                <p className="text-gray-500 italic">No detection data available</p>
              )}
            </div>
            
            <Button 
              onClick={isDetecting ? stopDetection : startLiveDetection} 
              className="w-full"
              variant={isDetecting ? "destructive" : "default"}
            >
              {isDetecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Stop Detection
                </>
              ) : (
                <>
                  {detectionResults ? "Run Detection Again" : "Start Detection"}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
export default Dashboard;*/
/*import NavBar from "@/components/NavBar";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import { useEffect } from "react";


const Dashboard = () => {
  const [detectionResults, setDetectionResults] = useState<{
    count: number;
    density: number;
    densityLevel: "low" | "moderate" | "high";
  } | null>(null);

  useEffect(() => {
    const fetchDetectionData = async () => {
      try {
        const response = await fetch("http://localhost:5001/count"); // Flask backend
        const data = await response.json();
        const count = data.person_count;

        // Basic density calculation (adjust maxCount as needed)
        const maxCount = 20;
        const density = Math.min((count / maxCount) * 100, 100);

        let densityLevel: "low" | "moderate" | "high" = "low";
        if (density >= 70) densityLevel = "high";
        else if (density >= 30) densityLevel = "moderate";

        setDetectionResults({ count, density, densityLevel });
      } catch (error) {
        console.error("Failed to fetch detection data:", error);
      }
    };

    fetchDetectionData(); // Fetch once immediately
    const interval = setInterval(fetchDetectionData, 2000); // Fetch every 2 sec

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <NavBar />

      <div className="container mx-auto px-4 pt-24 pb-10">
        <h1 className="text-3xl font-bold mb-8">Live Crowd Detection</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-gray-100 rounded-lg h-[400px] flex items-center justify-center relative overflow-hidden">
            {detectionResults ? (
              <div className="w-full h-full p-4">
                <div className="w-full h-full relative rounded-lg overflow-hidden">
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(to bottom, 
                        ${
                          detectionResults.densityLevel === "high"
                            ? "rgba(239, 68, 68, 0.7)"
                            : detectionResults.densityLevel === "moderate"
                            ? "rgba(245, 158, 11, 0.7)"
                            : "rgba(34, 197, 94, 0.7)"
                        }, 
                        transparent)`,
                    }}
                  ></div>

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white font-bold text-2xl drop-shadow-lg">
                      {detectionResults.densityLevel === "high"
                        ? "HIGH DENSITY"
                        : detectionResults.densityLevel === "moderate"
                        ? "MODERATE DENSITY"
                        : "LOW DENSITY"}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-600">
                No detection data available.
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Detection Results</h2>

              {detectionResults ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">People Count</p>
                    <p className="text-2xl font-bold">{detectionResults.count}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Crowd Density</p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2 mb-1">
                      <div
                        className={`h-2.5 rounded-full ${
                          detectionResults.densityLevel === "high"
                            ? "bg-red-500"
                            : detectionResults.densityLevel === "moderate"
                            ? "bg-amber-500"
                            : "bg-green-500"
                        }`}
                        style={{ width: `${detectionResults.density}%` }}
                      ></div>
                    </div>
                    <p className="text-sm">{detectionResults.density}%</p>
                  </div>

                  <Alert
                    className={
                      detectionResults.densityLevel === "high"
                        ? "border-red-500 bg-red-50"
                        : detectionResults.densityLevel === "moderate"
                        ? "border-amber-500 bg-amber-50"
                        : "border-green-500 bg-green-50"
                    }
                  >
                    <AlertTriangle
                      className={
                        detectionResults.densityLevel === "high"
                          ? "text-red-500"
                          : detectionResults.densityLevel === "moderate"
                          ? "text-amber-500"
                          : "text-green-500"
                      }
                    />
                    <AlertTitle>
                      {detectionResults.densityLevel === "high"
                        ? "High Density Alert"
                        : detectionResults.densityLevel === "moderate"
                        ? "Moderate Density Notice"
                        : "Low Density Information"}
                    </AlertTitle>
                    <AlertDescription>
                      {detectionResults.densityLevel === "high"
                        ? "This area is very crowded. Don't visit!"
                        : detectionResults.densityLevel === "moderate"
                        ? "This area has moderate crowds. You may visit."
                        : "This area is not crowded. Kindly visit!"}
                    </AlertDescription>
                  </Alert>
                </div>
              ) : (
                <p className="text-gray-500 italic">No detection data...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;*/



import NavBar from "@/components/NavBar";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";

const Dashboard = () => {
  const [detectionResults, setDetectionResults] = useState<{
    count: number;
    density: number;
    densityLevel: "low" | "moderate" | "high";
  } | null>(null);

  // Function to fetch data from the backend
  const fetchDetectionData = async () => {
    try {
      // Sending the GET request to backend Flask API endpoint
      const response = await fetch("http://localhost:5001/count"); // Your Flask API URL
      const data = await response.json();

      const count = data.person_count; // Assuming your response structure includes person_count

      // Basic density calculation (adjust maxCount as needed)
      const maxCount = 20;
      const density = Math.min((count / maxCount) * 100, 100);

      let densityLevel: "low" | "moderate" | "high" = "low";
      if (density >= 70) densityLevel = "high";
      else if (density >= 30) densityLevel = "moderate";

      setDetectionResults({ count, density, densityLevel });
    } catch (error) {
      console.error("Failed to fetch detection data:", error);
      setDetectionResults(null); // Optional: you can display an error state in the UI
    }
  };

  useEffect(() => {
    fetchDetectionData(); // Fetch data immediately when the component mounts

    const interval = setInterval(fetchDetectionData, 2000); // Fetch every 2 seconds
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return (
    <>
      <NavBar />

      <div className="container mx-auto px-4 pt-24 pb-10">
        <h1 className="text-3xl font-bold mb-8">Live Crowd Detection</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-gray-100 rounded-lg h-[400px] flex items-center justify-center relative overflow-hidden">
            {detectionResults ? (
              <div className="w-full h-full p-4">
                <div className="w-full h-full relative rounded-lg overflow-hidden">
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(to bottom, 
                        ${
                          detectionResults.densityLevel === "high"
                            ? "rgba(239, 68, 68, 0.7)"
                            : detectionResults.densityLevel === "moderate"
                            ? "rgba(245, 158, 11, 0.7)"
                            : "rgba(34, 197, 94, 0.7)"
                        }, 
                        transparent)`,
                    }}
                  ></div>

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white font-bold text-2xl drop-shadow-lg">
                      {detectionResults.densityLevel === "high"
                        ? "HIGH DENSITY"
                        : detectionResults.densityLevel === "moderate"
                        ? "MODERATE DENSITY"
                        : "LOW DENSITY"}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-600">
                No detection data available.
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Detection Results</h2>

              {detectionResults ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">People Count</p>
                    <p className="text-2xl font-bold">{detectionResults.count}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Crowd Density</p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2 mb-1">
                      <div
                        className={`h-2.5 rounded-full ${
                          detectionResults.densityLevel === "high"
                            ? "bg-red-500"
                            : detectionResults.densityLevel === "moderate"
                            ? "bg-amber-500"
                            : "bg-green-500"
                        }`}
                        style={{ width: `${detectionResults.density}%` }}
                      ></div>
                    </div>
                    <p className="text-sm">{detectionResults.density}%</p>
                  </div>

                  <Alert
                    className={
                      detectionResults.densityLevel === "high"
                        ? "border-red-500 bg-red-50"
                        : detectionResults.densityLevel === "moderate"
                        ? "border-amber-500 bg-amber-50"
                        : "border-green-500 bg-green-50"
                    }
                  >
                    <AlertTriangle
                      className={
                        detectionResults.densityLevel === "high"
                          ? "text-red-500"
                          : detectionResults.densityLevel === "moderate"
                          ? "text-amber-500"
                          : "text-green-500"
                      }
                    />
                    <AlertTitle>
                      {detectionResults.densityLevel === "high"
                        ? "High Density Alert"
                        : detectionResults.densityLevel === "moderate"
                        ? "Moderate Density Notice"
                        : "Low Density Information"}
                    </AlertTitle>
                    <AlertDescription>
                      {detectionResults.densityLevel === "high"
                        ? "This area is very crowded. Don't visit!"
                        : detectionResults.densityLevel === "moderate"
                        ? "This area has moderate crowds. You may visit."
                        : "This area is not crowded. Kindly visit!"}
                    </AlertDescription>
                  </Alert>
                </div>
              ) : (
                <p className="text-gray-500 italic">No detection data...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;

