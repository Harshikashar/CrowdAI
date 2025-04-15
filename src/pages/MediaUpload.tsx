
import { useState } from "react";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Upload, Image, Video, Trash2, AlertTriangle, FileUp } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const MediaUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<{
    peopleCount: number;
    density: number;
    coveredArea: number;
    densityLevel: "low" | "moderate" | "high";
  } | null>(null);
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Check if file matches the current tab type
      const isImage = selectedFile.type.match('image.*');
      const isVideo = selectedFile.type.match('video.*');
      
      if ((mediaType === "image" && !isImage) || (mediaType === "video" && !isVideo)) {
        toast({
          title: `Invalid file type`,
          description: `Please upload ${mediaType === "image" ? "an image" : "a video"} file.`,
          variant: "destructive",
        });
        return;
      }
      
      setFile(selectedFile);
      
      // Create preview for images
      if (isImage) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setPreview(e.target.result as string);
          }
        };
        reader.readAsDataURL(selectedFile);
      } else {
        setPreview(null);
      }
      
      // Reset results
      setResults(null);
    }
  };
  
  const processFile = () => {
    if (!file) return;
    
    setIsProcessing(true);
    
    // Simulate processing delay
    setTimeout(() => {
      // Generate random results for demonstration
      const peopleCount = Math.floor(Math.random() * 50) + 1;
      const density = Math.floor(Math.random() * 100);
      const coveredArea = Math.floor(Math.random() * 100);
      
      let densityLevel: "low" | "moderate" | "high";
      
      // Determine density level based on thresholds
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
      
      setResults({
        peopleCount,
        density,
        coveredArea,
        densityLevel
      });
      
      setIsProcessing(false);
    }, 2000);
  };
  
  const clearFile = () => {
    setFile(null);
    setPreview(null);
    setResults(null);
  };
  
  return (
    <>
      <NavBar />
      
      <div className="container mx-auto px-4 pt-24 pb-10">
        <h1 className="text-3xl font-bold mb-8">Media Upload & Analysis</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Upload Media</h2>
              
              <Tabs 
                defaultValue="image" 
                className="mb-6"
                onValueChange={(value) => {
                  setMediaType(value as "image" | "video");
                  clearFile();
                }}
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="image" className="flex items-center gap-2">
                    <Image className="h-4 w-4" />
                    Images
                  </TabsTrigger>
                  <TabsTrigger value="video" className="flex items-center gap-2">
                    <Video className="h-4 w-4" />
                    Videos
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="image" className="mt-4">
                  {!file ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <input
                        type="file"
                        id="image-upload"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                          <Image className="h-6 w-6 text-gray-500" />
                        </div>
                        <p className="text-gray-700 font-medium">Click to upload image</p>
                        <p className="text-sm text-gray-500 mt-1">JPG, PNG, WEBP formats supported</p>
                      </label>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Image className="h-5 w-5 text-blue-500 mr-2" />
                          <span className="text-sm text-gray-700 truncate max-w-[200px]">
                            {file.name}
                          </span>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={clearFile}
                          disabled={isProcessing}
                        >
                          <Trash2 className="h-4 w-4 text-gray-500" />
                        </Button>
                      </div>
                      
                      {preview && (
                        <div className="relative w-full h-40 bg-gray-100 rounded overflow-hidden">
                          <img 
                            src={preview} 
                            alt="Preview" 
                            className="w-full h-full object-contain"
                          />
                        </div>
                      )}
                      
                      <Button 
                        className="w-full"
                        onClick={processFile}
                        disabled={isProcessing}
                      >
                        {isProcessing ? (
                          <span className="flex items-center">
                            <FileUp className="animate-bounce mr-2 h-4 w-4" />
                            Processing...
                          </span>
                        ) : (
                          "Process Image"
                        )}
                      </Button>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="video" className="mt-4">
                  {!file ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <input
                        type="file"
                        id="video-upload"
                        className="hidden"
                        accept="video/*"
                        onChange={handleFileChange}
                      />
                      <label htmlFor="video-upload" className="cursor-pointer">
                        <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                          <Video className="h-6 w-6 text-gray-500" />
                        </div>
                        <p className="text-gray-700 font-medium">Click to upload video</p>
                        <p className="text-sm text-gray-500 mt-1">MP4, MOV, AVI formats supported</p>
                      </label>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Video className="h-5 w-5 text-purple-500 mr-2" />
                          <span className="text-sm text-gray-700 truncate max-w-[200px]">
                            {file.name}
                          </span>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={clearFile}
                          disabled={isProcessing}
                        >
                          <Trash2 className="h-4 w-4 text-gray-500" />
                        </Button>
                      </div>
                      
                      <div className="w-full h-40 bg-gray-100 rounded flex items-center justify-center">
                        <Video className="h-12 w-12 text-gray-400" />
                      </div>
                      
                      <Button 
                        className="w-full"
                        onClick={processFile}
                        disabled={isProcessing}
                      >
                        {isProcessing ? (
                          <span className="flex items-center">
                            <FileUp className="animate-bounce mr-2 h-4 w-4" />
                            Processing...
                          </span>
                        ) : (
                          "Process Video"
                        )}
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
            
            {results && (
              <Alert className={
                results.densityLevel === "high" ? "border-red-500 bg-red-50" : 
                results.densityLevel === "moderate" ? "border-amber-500 bg-amber-50" : 
                "border-green-500 bg-green-50"
              }>
                <AlertTriangle className={
                  results.densityLevel === "high" ? "text-red-500" : 
                  results.densityLevel === "moderate" ? "text-amber-500" : 
                  "text-green-500"
                } />
                <AlertTitle>{
                  results.densityLevel === "high" ? "High Density Alert" : 
                  results.densityLevel === "moderate" ? "Moderate Density Notice" : 
                  "Low Density Information"
                }</AlertTitle>
                <AlertDescription>{
                  results.densityLevel === "high" ? "This area is very crowded. Don't visit!" : 
                  results.densityLevel === "moderate" ? "This area has moderate crowds. You may visit." : 
                  "This area is not crowded. Kindly visit!"
                }</AlertDescription>
              </Alert>
            )}
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Analysis Results</h2>
            
            {results ? (
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-sm text-gray-500 mb-1">People Count</p>
                    <p className="text-2xl font-bold">{results.peopleCount}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-sm text-gray-500 mb-1">Density</p>
                    <p className="text-2xl font-bold">{results.density}%</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-sm text-gray-500 mb-1">Area Covered</p>
                    <p className="text-2xl font-bold">{results.coveredArea}%</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Crowd Heatmap</h3>
                  <div className="w-full h-[250px] rounded-lg overflow-hidden relative">
                    {/* Simulated heatmap visualization */}
                    <div className="absolute inset-0" style={{
                      background: `linear-gradient(135deg, 
                        rgba(34, 197, 94, 0.7),
                        rgba(245, 158, 11, 0.7) ${results.densityLevel === "low" ? "80%" : "50%"},
                        rgba(239, 68, 68, 0.7) ${results.densityLevel === "high" ? "50%" : "90%"})`
                    }}></div>
                    
                    {/* Simulate people dots */}
                    {Array.from({length: Math.min(results.peopleCount, 20)}).map((_, i) => (
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
                    
                    <div className="absolute bottom-2 left-2 right-2 flex justify-between text-xs text-white font-medium">
                      <span className="bg-green-500/50 px-2 py-1 rounded">Low</span>
                      <span className="bg-amber-500/50 px-2 py-1 rounded">Moderate</span>
                      <span className="bg-red-500/50 px-2 py-1 rounded">High</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500 italic">
                {file ? (
                  isProcessing ? (
                    <p>Processing your {mediaType}...</p>
                  ) : (
                    <p>Click "Process {mediaType}" to analyze</p>
                  )
                ) : (
                  <p>Upload {mediaType} to see analysis results</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MediaUpload;
