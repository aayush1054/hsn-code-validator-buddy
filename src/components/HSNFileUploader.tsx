
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { parseExcelFile } from "@/utils/hsnValidation";
import { Upload } from "lucide-react";
import { useState } from "react";

interface HSNFileUploaderProps {
  onFileProcessed: (data: any) => void;
  setLoading: (loading: boolean) => void;
}

const HSNFileUploader = ({ onFileProcessed, setLoading }: HSNFileUploaderProps) => {
  const { toast } = useToast();
  const [dragActive, setDragActive] = useState(false);
  
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };
  
  const processFile = async (file: File) => {
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      toast({
        title: "Invalid File",
        description: "Please upload a valid Excel file (.xlsx or .xls)",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setLoading(true);
      const data = await parseExcelFile(file);
      onFileProcessed(data);
      toast({
        title: "File Uploaded Successfully",
        description: `Loaded ${Object.keys(data).length} HSN codes`
      });
    } catch (error) {
      console.error("Error processing file:", error);
      toast({
        title: "Error Processing File",
        description: "There was an error processing the Excel file. Please ensure it has HSNCode and Description columns.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };
  
  return (
    <Card 
      className={`border-2 border-dashed ${
        dragActive ? "border-validator-blue" : "border-gray-300"
      } transition-all duration-200 bg-white`}
    >
      <CardContent className="p-6">
        <div
          className="flex flex-col items-center justify-center gap-4"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="rounded-full bg-validator-blue-light p-3">
            <Upload className="h-6 w-6 text-validator-blue" />
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">
              Drag and drop your HSN master data Excel file here, or click to browse
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Supports .xlsx and .xls files with HSNCode and Description columns
            </p>
          </div>
          <input
            id="file-upload"
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={handleChange}
          />
          <label htmlFor="file-upload">
            <Button variant="outline" className="cursor-pointer">
              Browse File
            </Button>
          </label>
        </div>
      </CardContent>
    </Card>
  );
};

export default HSNFileUploader;
