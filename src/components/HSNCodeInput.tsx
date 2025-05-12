
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { parseMultipleHSNCodes } from "@/utils/hsnValidation";
import { Search } from "lucide-react";
import { useState } from "react";

interface HSNCodeInputProps {
  onValidate: (codes: string[]) => void;
  isLoading: boolean;
  isDataLoaded: boolean;
}

const HSNCodeInput = ({ onValidate, isLoading, isDataLoaded }: HSNCodeInputProps) => {
  const [singleCode, setSingleCode] = useState("");
  const [batchCodes, setBatchCodes] = useState("");
  const { toast } = useToast();
  
  const handleSingleValidation = () => {
    if (!singleCode.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter an HSN code to validate",
        variant: "destructive"
      });
      return;
    }
    
    onValidate([singleCode.trim()]);
  };
  
  const handleBatchValidation = () => {
    const codes = parseMultipleHSNCodes(batchCodes);
    
    if (codes.length === 0) {
      toast({
        title: "Input Required",
        description: "Please enter one or more HSN codes to validate",
        variant: "destructive"
      });
      return;
    }
    
    onValidate(codes);
  };
  
  const isButtonDisabled = !isDataLoaded || isLoading;
  
  return (
    <Card className="w-full">
      <Tabs defaultValue="single">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="single">Single Code</TabsTrigger>
          <TabsTrigger value="batch">Batch Validation</TabsTrigger>
        </TabsList>
        
        <CardContent className="pt-6">
          <TabsContent value="single" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="single-code">Enter HSN Code</Label>
              <div className="flex gap-2">
                <Input
                  id="single-code"
                  placeholder="e.g., 01011010"
                  value={singleCode}
                  onChange={(e) => setSingleCode(e.target.value)}
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button 
                  onClick={handleSingleValidation} 
                  disabled={isButtonDisabled}
                  className="bg-validator-blue hover:bg-validator-blue-dark"
                >
                  <Search className="mr-2 h-4 w-4" />
                  Validate
                </Button>
              </div>
              {!isDataLoaded && (
                <p className="text-sm text-orange-500">Please upload master data first</p>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="batch">
            <div className="space-y-2">
              <Label htmlFor="batch-codes">Enter Multiple HSN Codes</Label>
              <Textarea
                id="batch-codes"
                placeholder="Enter multiple HSN codes (separated by commas, spaces, or newlines)"
                rows={5}
                value={batchCodes}
                onChange={(e) => setBatchCodes(e.target.value)}
                className="resize-none"
                disabled={isLoading}
              />
              {!isDataLoaded && (
                <p className="text-sm text-orange-500">Please upload master data first</p>
              )}
            </div>
          </TabsContent>
        </CardContent>
        
        <CardFooter className="border-t pt-4">
          <TabsContent value="single" className="w-full">
            <div className="text-xs text-gray-500">
              Example format: 01011010
            </div>
          </TabsContent>
          
          <TabsContent value="batch" className="space-y-4 w-full">
            <div className="flex justify-between items-center">
              <div className="text-xs text-gray-500">
                Example: 01, 0101, 01011010 (separated by commas, spaces, or new lines)
              </div>
              <Button 
                onClick={handleBatchValidation} 
                disabled={isButtonDisabled}
                className="bg-validator-blue hover:bg-validator-blue-dark"
              >
                <Search className="mr-2 h-4 w-4" />
                Validate All
              </Button>
            </div>
          </TabsContent>
        </CardFooter>
      </Tabs>
    </Card>
  );
};

export default HSNCodeInput;
