
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AboutProject from "./pages/AboutProject";
import AboutTeam from "./pages/AboutTeam";
import Features from "./pages/Features";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import CameraView from "./pages/CameraView";
import MediaUpload from "./pages/MediaUpload";
import ImageHeatmap from "./pages/ImageHeatmap";
import HeatmapVisualization from "./pages/HeatmapVisualization";
import NotFound from "./pages/NotFound";
import AlertPage from "./pages/Alert";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about/project" element={<AboutProject />} />
          <Route path="/about/team" element={<AboutTeam />} />
          <Route path="/features" element={<Features />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/media-upload" element={<MediaUpload />} />
          <Route path="/alert" element={<AlertPage />} />
          <Route path="/camera" element={<CameraView />} />
          <Route path="/heatmap" element={<HeatmapVisualization />} />
          <Route path="/iheatmap" element={<ImageHeatmap />} />
          <Route path="/heatmap-visualization" element={<HeatmapVisualization />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
