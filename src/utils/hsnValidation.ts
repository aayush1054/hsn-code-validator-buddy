
import { HSNCode, HSNMasterData, ValidationResult } from "@/types/hsn";
import * as XLSX from "xlsx";

// Function to parse Excel file and extract HSN master data
export const parseExcelFile = async (file: File): Promise<HSNMasterData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        // Convert to our HSNMasterData format
        const hsnMasterData: HSNMasterData = {};
        jsonData.forEach((row: any) => {
          if (row.HSNCode && row.Description) {
            hsnMasterData[row.HSNCode] = {
              description: row.Description
            };
          }
        });
        
        resolve(hsnMasterData);
      } catch (error) {
        console.error("Error parsing Excel file:", error);
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsBinaryString(file);
  });
};

// Format validation: Check if the input follows HSN code format rules
export const validateHSNFormat = (code: string): boolean => {
  // HSN codes are typically numeric and 2 to 8 digits long
  const isValidFormat = /^\d{2,8}$/.test(code);
  return isValidFormat;
};

// Existence validation: Check if code exists in master data
export const validateHSNExistence = (code: string, masterData: HSNMasterData): boolean => {
  return !!masterData[code];
};

// Get parent codes of a given HSN code
export const getParentCodes = (code: string): string[] => {
  const parentCodes: string[] = [];
  
  if (code.length <= 2) return parentCodes;
  
  // Generate parent codes based on length
  // For an 8-digit code like 01011010, parents would be 010110, 0101, 01
  for (let i = 2; i < code.length; i += 2) {
    if (i <= code.length - 2) {
      parentCodes.push(code.substring(0, i));
    }
  }
  
  return parentCodes;
};

// Main validation function
export const validateHSNCode = (code: string, masterData: HSNMasterData): ValidationResult => {
  // Trim whitespace
  const trimmedCode = code.trim();
  
  // Format validation
  if (!validateHSNFormat(trimmedCode)) {
    return {
      code: trimmedCode,
      isValid: false,
      reason: "Invalid format: HSN code must be numeric and 2-8 digits long"
    };
  }
  
  // Existence validation
  if (!validateHSNExistence(trimmedCode, masterData)) {
    return {
      code: trimmedCode,
      isValid: false,
      reason: "HSN code not found in master data"
    };
  }
  
  // Code exists, get parent codes and their descriptions
  const parentCodes = getParentCodes(trimmedCode)
    .filter(parentCode => masterData[parentCode])
    .map(parentCode => ({
      code: parentCode,
      description: masterData[parentCode].description
    }));
  
  return {
    code: trimmedCode,
    isValid: true,
    description: masterData[trimmedCode].description,
    parentCodes
  };
};

// Batch validation function
export const validateHSNCodes = (codes: string[], masterData: HSNMasterData): ValidationResult[] => {
  return codes.map(code => validateHSNCode(code, masterData));
};

// Parse a text area input into individual codes
export const parseMultipleHSNCodes = (input: string): string[] => {
  // Split by commas, newlines, or spaces
  return input
    .split(/[\s,]+/)
    .map(code => code.trim())
    .filter(code => code.length > 0);
};
