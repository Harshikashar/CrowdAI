import { AlertTriangle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const AlertPage = () => {
  return (
    <div className="min-h-screen py-10 px-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Alert Explanation</h1>
        <p className="mb-4 text-gray-700">
          Alerts are triggered based on the density level detected from the heatmap analysis. These alerts help users make safe and informed decisions. Here’s how they appear:
        </p>

        {/* Low Density Alert */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-green-700">Low Density (0–30%)</h2>
          <Alert className="bg-green-50 border border-green-200">
            <AlertTriangle className="text-green-500 h-5 w-5" />
            <AlertTitle>Low Density - Safe Zone</AlertTitle>
            <AlertDescription>
              This area has low crowd density. Safe for normal operations.
            </AlertDescription>
          </Alert>
        </div>

        {/* Moderate Density Alert */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-amber-700">Moderate Density (30–70%)</h2>
          <Alert className="bg-amber-50 border border-amber-200">
            <AlertTriangle className="text-amber-500 h-5 w-5" />
            <AlertTitle>Moderate Density Warning</AlertTitle>
            <AlertDescription>
              This area is moderately crowded. Monitor the situation closely.
            </AlertDescription>
          </Alert>
        </div>

        {/* High Density Alert */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-red-700">High Density (70–100%)</h2>
          <Alert className="bg-red-50 border border-red-200">
            <AlertTriangle className="text-red-500 h-5 w-5" />
            <AlertTitle>High Density Alert</AlertTitle>
            <AlertDescription>
              This area is overcrowded. Avoid if possible or implement crowd control measures.
            </AlertDescription>
          </Alert>
        </div>

        {/* Threshold Exceeded Alert */}
        <div>
          <h2 className="text-xl font-semibold mb-2 text-red-700">Threshold Exceeded</h2>
          <Alert className="bg-red-50 border border-red-200">
            <AlertTriangle className="text-red-500 h-5 w-5" />
            <AlertTitle>Threshold Exceeded</AlertTitle>
            <AlertDescription>
              Current density (45%) is higher than your threshold (30%). Not recommended to visit.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
};

export default AlertPage;
