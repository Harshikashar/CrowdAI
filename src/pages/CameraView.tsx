/*import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Camera, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

const CameraView = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [detectionData, setDetectionData] = useState<{
    peopleCount: number;
    density: number;
    densityLevel: "low" | "moderate" | "high";
  } | null>(null);

  useEffect(() => {
    const connectToBackend = async () => {
      try {
        const response = await axios.get("http://localhost:5001/start-detection");
        setIsConnected(true);
        toast({
          title: "Connected to camera",
          description: "Detection system is now active",
        });
      } catch (error) {
        toast({
          title: "Connection failed",
          description: "Could not connect to the detection system",
          variant: "destructive",
        });
      }
    };

    connectToBackend();

    // Cleanup on unmount
    return () => {
      axios.get("http://localhost:5001/stop-detection").catch(() => {
        // Silently handle cleanup errors
      });
    };
  }, [toast]);

  const handleViewHeatmap = () => {
    navigate("/heatmap");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Live Detection</h1>
          
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="aspect-video bg-gray-900 relative">
              {!isConnected && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <Camera className="h-16 w-16 mb-4 text-gray-400" />
                  <p className="text-gray-400">Connecting to camera...</p>
                </div>
              )}
              {/* The video feed will be inserted here by the Python backend }
              <div id="camera-feed"></div>
            </div>

            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  {detectionData && (
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
                
                <Button onClick={handleViewHeatmap}>
                  View Heatmap
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-4 p-4 border rounded-lg bg-blue-50 border-blue-200">
            <p className="text-sm text-blue-700">
              The detection system uses YOLOv8 to identify and track people in real-time.
              Click "View Heatmap" to see the density visualization.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CameraView;
*/

/*import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Camera, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

interface DetectionData {
  peopleCount: number;
  density: number;
  densityLevel: "low" | "moderate" | "high";
}

const CameraView = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [detectionData, setDetectionData] = useState<DetectionData | null>(null);
  const [isCameraStopped, setIsCameraStopped] = useState(false);

  useEffect(() => {
    const connectToBackend = async () => {
      try {
        const response = await axios.get("http://localhost:5001/start-detection");
        setIsConnected(true);
        toast({
          title: "Connected to camera",
          description: "Detection system is now active",
        });

        // Set up event listener for 'q' key press
        const handleKeyPress = (event: KeyboardEvent) => {
          if (event.key === 'q') {
            stopCamera();
          }
        };
        window.addEventListener('keydown', handleKeyPress);

        return () => {
          window.removeEventListener('keydown', handleKeyPress);
        };
      } catch (error) {
        toast({
          title: "Connection failed",
          description: "Could not connect to the detection system",
          variant: "destructive",
        });
      }
    };

    connectToBackend();

    // Cleanup on unmount
    return () => {
      stopCamera();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stopCamera = async () => {
    try {
      await axios.get("http://localhost:5001/stop-detection");
      setIsCameraStopped(true);
      toast({
        title: "Camera stopped",
        description: "Detection system has been stopped",
      });
    } catch (error) {
      console.error("Error stopping camera:", error);
    }
  };

  const handleViewHeatmap = () => {
    if (detectionData) {
      navigate("/heatmap", { 
        state: { 
          detectionData,
          timestamp: new Date().toISOString()
        } 
      });
    } else {
      toast({
        title: "No data available",
        description: "Please wait for detection data before viewing heatmap",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Live Detection</h1>
          
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="aspect-video bg-gray-900 relative">
              {!isConnected && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <Camera className="h-16 w-16 mb-4 text-gray-400" />
                  <p className="text-gray-400">Connecting to camera...</p>
                </div>
              )}
              <div id="camera-feed"></div>
            </div>

            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  {detectionData && (
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
                
                <Button 
                  onClick={handleViewHeatmap}
                  disabled={!detectionData || !isCameraStopped}
                >
                  View Heatmap
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-4 p-4 border rounded-lg bg-amber-50 border-amber-200">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 mr-2" />
              <p className="text-sm text-amber-700">
                Press 'Q' key to stop the camera and view the heatmap. The heatmap will be generated from the last captured frame.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CameraView;*/

/*import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Camera, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

interface DetectionData {
  peopleCount: number;
  density: number;
  densityLevel: "low" | "moderate" | "high";
}

const CameraView = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [detectionData, setDetectionData] = useState<DetectionData | null>(null);
  const [isCameraStopped, setIsCameraStopped] = useState(false);
  const videoRef = useRef<HTMLImageElement>(null);
  const detectionInterval = useRef<number | null>(null);

  useEffect(() => {
    const connectToBackend = async () => {
      try {
        const response = await axios.get("http://localhost:5001/start-detection");
        setIsConnected(true);
        toast({
          title: "Connected to camera",
          description: "Detection system is now active",
        });

        // Start polling for detection data
        detectionInterval.current = window.setInterval(async () => {
          try {
            const dataResponse = await axios.get("http://localhost:5001/detection-data");
            setDetectionData(dataResponse.data);
          } catch (error) {
            console.error("Error fetching detection data:", error);
          }
        }, 1000);

        // Set up event listener for 'q' key press
        const handleKeyPress = (event: KeyboardEvent) => {
          if (event.key === 'q') {
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
      } catch (error) {
        toast({
          title: "Connection failed",
          description: "Could not connect to the detection system",
          variant: "destructive",
        });
      }
    };

    connectToBackend();

    // Cleanup on unmount
    return () => {
      stopCamera();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Start streaming video when connected
  useEffect(() => {
    if (isConnected && videoRef.current) {
      videoRef.current.src = "http://localhost:5001/video-feed";
    }
  }, [isConnected]);

  const stopCamera = async () => {
    try {
      if (detectionInterval.current) {
        clearInterval(detectionInterval.current);
      }
      
      // Get the last frame before stopping the camera
      const lastFrameResponse = await axios.get("http://localhost:5001/last-frame");
      const frameData = lastFrameResponse.data;
      
      // Stop the camera
      await axios.get("http://localhost:5001/stop-detection");
      setIsCameraStopped(true);
      
      // Store the frame data in localStorage for the heatmap page
      if (frameData && !frameData.error) {
        localStorage.setItem('lastFrameData', JSON.stringify({
          image: frameData.image,
          detectionData: frameData.data,
          timestamp: new Date().toISOString()
        }));
      }
      
      toast({
        title: "Camera stopped",
        description: "Detection system has been stopped",
      });
    } catch (error) {
      console.error("Error stopping camera:", error);
    }
  };

  const handleViewHeatmap = () => {
    if (isCameraStopped) {
      navigate("/heatmap");
    } else {
      toast({
        title: "Camera still active",
        description: "Please press 'Q' to stop the camera before viewing the heatmap",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Live Detection</h1>
          
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="aspect-video bg-gray-900 relative">
              {!isConnected && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <Camera className="h-16 w-16 mb-4 text-gray-400" />
                  <p className="text-gray-400">Connecting to camera...</p>
                </div>
              )}
              <img 
                ref={videoRef}
                className={`w-full h-full object-contain ${isConnected ? 'block' : 'hidden'}`}
                alt="Camera feed"
              />
            </div>

            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  {detectionData && (
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
                
                <Button 
                  onClick={handleViewHeatmap}
                  disabled={!isCameraStopped}
                >
                  View Heatmap
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-4 p-4 border rounded-lg bg-amber-50 border-amber-200">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 mr-2" />
              <p className="text-sm text-amber-700">
                Press 'Q' key to stop the camera and save the current frame. After stopping, you can view the heatmap.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CameraView;*/


/*import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Camera, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

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
  const [isCameraStopped, setIsCameraStopped] = useState(false);
  const [isImageCaptured, setIsImageCaptured] = useState(false);
  const videoRef = useRef<HTMLImageElement>(null);
  const detectionInterval = useRef<number | null>(null);

  useEffect(() => {
    // Set up event listener for 'q' key press
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

  // Start streaming video when connected
  useEffect(() => {
    if (isConnected && videoRef.current) {
      videoRef.current.src = "http://localhost:5001/video-feed";
    }
  }, [isConnected]);

  const openCamera = async () => {
    try {
      const response = await axios.get("http://localhost:5001/start-detection");
      setIsConnected(true);
      setIsCameraOpen(true);
      toast({
        title: "Camera opened",
        description: "Detection system is now active",
      });

      // Start polling for detection data
      detectionInterval.current = window.setInterval(async () => {
        try {
          const dataResponse = await axios.get("http://localhost:5001/detection-data");
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
      
      // Get the last frame before stopping the camera
      const lastFrameResponse = await axios.get("http://localhost:5001/last-frame");
      const frameData = lastFrameResponse.data;
      
      
      // Stop the camera
      await axios.get("http://localhost:5001/stop-detection");
      setIsCameraStopped(true);
      setIsCameraOpen(false);
      
      // Store the frame data in localStorage for the heatmap page
      if (frameData && !frameData.error) {
        localStorage.setItem('lastFrameData', JSON.stringify({
          image: frameData.image,
          detectionData: frameData.data,
          timestamp: new Date().toISOString()
        }));
        setIsImageCaptured(true);
        
        toast({
          title: "Image captured",
          description: "You can now view the heatmap of the captured image",
        });
      }
      
      toast({
        title: "Camera stopped",
        description: "Detection system has been stopped",
      });
    } catch (error) {
      console.error("Error stopping camera:", error);
      toast({
        title: "Error",
        description: "Failed to stop camera and capture image",
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
              <div className="flex items-center justify-between">
                <div className="space-y-1">
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
                  {!isCameraOpen && !isImageCaptured && (
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

export default CameraView;*/

import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Camera, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

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
    // Set up event listener for 'q' key press
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

  // Start streaming video when connected
  useEffect(() => {
    if (isConnected && videoRef.current) {
      videoRef.current.src = "http://localhost:5001/video-feed";
    }
  }, [isConnected]);

  const openCamera = async () => {
    try {
      await axios.get("http://localhost:5001/start-detection");
      setIsConnected(true);
      setIsCameraOpen(true);
      toast({
        title: "Camera opened",
        description: "Detection system is now active",
      });

      // Start polling for detection data
      detectionInterval.current = window.setInterval(async () => {
        try {
          const dataResponse = await axios.get("http://localhost:5001/detection-data");
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
      
      try {
        // Get the last frame before stopping the camera
        const lastFrameResponse = await axios.get("http://localhost:5001/last-frame");
        const frameData = lastFrameResponse.data;
        
        // Store the frame data in localStorage for the heatmap page
        if (frameData && !frameData.error) {
          localStorage.setItem('lastFrameData', JSON.stringify({
            image: frameData.image,
            detectionData: frameData.data,
            timestamp: new Date().toISOString()
          }));
          setIsImageCaptured(true);
          
          toast({
            title: "Image captured",
            description: "You can now view the heatmap of the captured image",
          });
        }
      } catch (frameError) {
        console.error("Error getting last frame:", frameError);
      }
      
      // Stop the camera
      await axios.get("http://localhost:5001/stop-detection");
      setIsCameraOpen(false);
      
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


