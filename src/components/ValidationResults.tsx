
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ValidationResult } from "@/types/hsn";
import { CheckCircle, Download, Info, XCircle } from "lucide-react";
import * as XLSX from "xlsx";
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface ValidationResultsProps {
  results: ValidationResult[];
  isLoading: boolean;
}

const ValidationResults = ({ results, isLoading }: ValidationResultsProps) => {
  const [expandedResults, setExpandedResults] = useState<Set<string>>(new Set());
  
  // Toggle expanded state for a result
  const toggleExpanded = (code: string) => {
    const newExpanded = new Set(expandedResults);
    if (newExpanded.has(code)) {
      newExpanded.delete(code);
    } else {
      newExpanded.add(code);
    }
    setExpandedResults(newExpanded);
  };
  
  // Export results to Excel
  const exportToExcel = () => {
    // Prepare data for export, flatten parent codes
    const exportData = results.map(result => {
      return {
        'HSN Code': result.code,
        'Valid': result.isValid ? 'Yes' : 'No',
        'Description': result.description || '',
        'Reason (if invalid)': result.reason || '',
        'Parent Codes': result.parentCodes?.map(pc => pc.code).join(', ') || ''
      };
    });
    
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Validation Results');
    XLSX.writeFile(wb, 'hsn_validation_results.xlsx');
  };
  
  // If loading, show skeleton
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Skeleton className="h-5 w-40" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // If no results, don't show the card
  if (results.length === 0) {
    return null;
  }
  
  // Calculate statistics
  const validCount = results.filter(r => r.isValid).length;
  const invalidCount = results.length - validCount;
  
  return (
    <Card className="w-full animate-fade-in">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span>Validation Results</span>
          <div className="flex items-center gap-2 text-sm font-normal">
            <span className="flex items-center text-validator-green">
              <CheckCircle className="h-4 w-4 mr-1" /> {validCount} Valid
            </span>
            <span className="mx-2 text-gray-300">|</span>
            <span className="flex items-center text-validator-red">
              <XCircle className="h-4 w-4 mr-1" /> {invalidCount} Invalid
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/5">HSN Code</TableHead>
              <TableHead className="w-1/6">Status</TableHead>
              <TableHead>Description / Reason</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((result) => (
              <TableRow key={result.code} className={`${result.isValid ? 'hover:bg-validator-green-light' : 'hover:bg-validator-red-light'} cursor-pointer transition-colors`}>
                <TableCell 
                  className="font-mono"
                  onClick={() => toggleExpanded(result.code)}
                >
                  {result.code}
                </TableCell>
                <TableCell onClick={() => toggleExpanded(result.code)}>
                  {result.isValid ? (
                    <span className="flex items-center text-validator-green font-medium">
                      <CheckCircle className="h-4 w-4 mr-1" /> Valid
                    </span>
                  ) : (
                    <span className="flex items-center text-validator-red font-medium">
                      <XCircle className="h-4 w-4 mr-1" /> Invalid
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-sm" onClick={() => toggleExpanded(result.code)}>
                  {result.isValid ? result.description : result.reason}
                  
                  {/* Expandable parent codes section */}
                  {result.isValid && result.parentCodes && result.parentCodes.length > 0 && (
                    <Accordion 
                      type="single" 
                      collapsible
                      value={expandedResults.has(result.code) ? result.code : ""}
                    >
                      <AccordionItem value={result.code} className="border-0">
                        <AccordionTrigger className="py-1 text-xs text-validator-blue">
                          <div className="flex items-center">
                            <Info className="h-3 w-3 mr-1" />
                            Show parent classifications
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="text-xs space-y-1 mt-1 pl-2 border-l-2 border-validator-blue-light">
                            {result.parentCodes.map(parent => (
                              <div key={parent.code} className="flex">
                                <span className="font-mono font-bold w-20">{parent.code}</span>
                                <span className="text-gray-600">{parent.description}</span>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      
      <CardFooter className="border-t pt-4 flex justify-end">
        <Button 
          variant="outline" 
          onClick={exportToExcel} 
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Export Results
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ValidationResults;
