
import { useState } from "react";
import { HSNMasterData, ValidationResult } from "@/types/hsn";
import { validateHSNCodes } from "@/utils/hsnValidation";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import HSNFileUploader from "@/components/HSNFileUploader";
import HSNCodeInput from "@/components/HSNCodeInput";
import ValidationResults from "@/components/ValidationResults";
import { Loader2, Database } from "lucide-react";

const Index = () => {
  const [masterData, setMasterData] = useState<HSNMasterData | null>(null);
  const [results, setResults] = useState<ValidationResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Handle file upload and processing
  const handleFileProcessed = (data: HSNMasterData) => {
    setMasterData(data);
    setResults([]);
  };

  // Validate HSN codes
  const validateCodes = (codes: string[]) => {
    if (!masterData) {
      toast({
        title: "No Master Data",
        description: "Please upload HSN master data Excel file first",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Small delay to show loading state
    setTimeout(() => {
      try {
        const validationResults = validateHSNCodes(codes, masterData);
        setResults(validationResults);
      } catch (error) {
        console.error("Validation error:", error);
        toast({
          title: "Validation Error",
          description: "An error occurred during validation",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-validator-blue rounded-lg p-2">
                <Database className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">HSN Code Validator</h1>
                <p className="text-sm text-gray-500">
                  Validate Harmonized System Nomenclature codes against master data
                </p>
              </div>
            </div>
            {masterData && (
              <div className="bg-validator-blue-light text-validator-blue-dark rounded-full px-3 py-1 text-sm font-medium">
                {Object.keys(masterData).length} Codes Loaded
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-3">1. Load Master Data</h2>
                <HSNFileUploader 
                  onFileProcessed={handleFileProcessed}
                  setLoading={setIsLoading}
                />
              </div>

              <Separator />

              <div>
                <h2 className="text-lg font-semibold mb-3">2. Enter HSN Code(s)</h2>
                <HSNCodeInput 
                  onValidate={validateCodes}
                  isLoading={isLoading}
                  isDataLoaded={!!masterData}
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h2 className="text-lg font-semibold mb-3">3. Validation Results</h2>
            
            {isLoading ? (
              <div className="flex items-center justify-center h-64 bg-white rounded-lg border">
                <div className="flex flex-col items-center">
                  <Loader2 className="h-8 w-8 text-validator-blue animate-spin mb-2" />
                  <p className="text-gray-500">Validating HSN codes...</p>
                </div>
              </div>
            ) : results.length === 0 ? (
              <div className="flex items-center justify-center h-64 bg-white rounded-lg border border-dashed">
                <div className="text-center max-w-md">
                  <h3 className="text-lg font-medium text-gray-700 mb-1">No Results Yet</h3>
                  <p className="text-gray-500">
                    {masterData 
                      ? "Enter and validate HSN codes to see results here"
                      : "Please upload master data and validate HSN codes to see results"}
                  </p>
                </div>
              </div>
            ) : (
              <ValidationResults results={results} isLoading={isLoading} />
            )}
          </div>
        </div>
      </main>

      <footer className="bg-white border-t mt-12">
        <div className="container mx-auto py-4">
          <p className="text-center text-sm text-gray-500">
            HSN Code Validator Buddy — Validate codes efficiently
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
