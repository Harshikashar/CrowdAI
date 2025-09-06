import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Camera, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

// This line automatically reads the URL from your Vercel settings.
// Do NOT replace it with your direct URL. This is the correct way.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

interface DetectionData {
  peopleCount: number;
  density: number;
  densityLevel: "low" | "moderate" | "high";
}

const CameraView = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [detectionData, setDetectionData] = useState<DetectionData | null>(null);
  const [isImageCaptured, setIsImageCaptured] = useState(false);
  const videoRef = useRef<HTMLImageElement>(null);
  const detectionInterval = useRef<number | null>(null);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'q' && isCameraOpen) {
        stopCamera();
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      if (detectionInterval.current) {
        clearInterval(detectionInterval.current);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCameraOpen]);

  useEffect(() => {
    if (isConnected && videoRef.current) {
      videoRef.current.src = `${API_BASE_URL}/video-feed`;
    }
  }, [isConnected]);

  const openCamera = async () => {
    try {
      await axios.post(`${API_BASE_URL}/start-detection`);
      setIsConnected(true);
      setIsCameraOpen(true);
      toast({
        title: "Camera opened",
        description: "Detection system is now active",
      });

      detectionInterval.current = window.setInterval(async () => {
        try {
          const dataResponse = await axios.get(`${API_BASE_URL}/detection-data`);
          setDetectionData(dataResponse.data);
        } catch (error) {
          console.error("Error fetching detection data:", error);
        }
      }, 1000);
    } catch (error) {
      toast({
        title: "Connection failed",
        description: "Could not connect to the detection system",
        variant: "destructive",
      });
    }
  };

  const stopCamera = async () => {
    try {
      if (detectionInterval.current) {
        clearInterval(detectionInterval.current);
      }
      
      const heatmapResponse = await axios.post(`${API_BASE_URL}/generate-heatmap`);
      const frameData = heatmapResponse.data;
      
      if (frameData && !frameData.error) {
        localStorage.setItem('lastFrameData', JSON.stringify({
          image: frameData.heatmapImage,
          detectionData: frameData.data,
          timestamp: new Date().toISOString()
        }));
        setIsImageCaptured(true);
        
        toast({
          title: "Image captured & Heatmap Ready",
          description: "You can now view the heatmap of the captured image",
        });
      }
      
      await axios.post(`${API_BASE_URL}/stop-detection`);
      setIsCameraOpen(false);
      setIsConnected(false);
      if(videoRef.current) videoRef.current.src = "";
      
      toast({
        title: "Camera stopped",
        description: "Detection system has been stopped",
      });
    } catch (error) {
      console.error("Error stopping camera:", error);
      toast({
        title: "Error",
        description: "Failed to stop camera properly",
        variant: "destructive",
      });
    }
  };

  const handleViewHeatmap = () => {
    if (isImageCaptured) {
      navigate("/iheatmap");
    } else {
      toast({
        title: "No image captured",
        description: "Please open camera and press 'Q' to capture an image first",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 pt-10">Live Detection</h1>
          
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="aspect-video bg-gray-900 relative">
              {!isCameraOpen && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <Camera className="h-16 w-16 mb-4 text-gray-400" />
                  <p className="text-gray-400">Click "Open Camera" to start</p>
                </div>
              )}
              <img 
                ref={videoRef}
                className={`w-full h-full object-contain ${isCameraOpen ? 'block' : 'hidden'}`}
                alt="Camera feed"
              />
            </div>

            <div className="p-4">
              <div className="flex flex-wrap items-center justify-between">
                <div className="space-y-1 mb-4 md:mb-0">
                  {detectionData && isCameraOpen && (
                    <>
                      <p className="text-sm text-gray-500">
                        People detected: {detectionData.peopleCount}
                      </p>
                      <p className="text-sm text-gray-500">
                        Current density: {detectionData.density}%
                      </p>
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        detectionData.densityLevel === 'high' ? 'bg-red-100 text-red-800' :
                        detectionData.densityLevel === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {detectionData.densityLevel.charAt(0).toUpperCase() + detectionData.densityLevel.slice(1)} Density
                      </div>
                    </>
                  )}
                </div>
                
                <div className="flex gap-3">
                  {!isCameraOpen && (
                    <Button onClick={openCamera}>
                      <Camera className="w-4 h-4 mr-2" />
                      Open Camera
                    </Button>
                  )}
                  
                  <Button 
                    onClick={handleViewHeatmap}
                    disabled={!isImageCaptured}
                  >
                    View Heatmap
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 p-4 border rounded-lg bg-amber-50 border-amber-200">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 mr-2" />
              <p className="text-sm text-amber-700">
                Press 'Q' key to stop the camera and save the current frame. After capturing, you can view the heatmap.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CameraView;


