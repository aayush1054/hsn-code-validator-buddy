
export interface HSNCode {
  code: string;
  description: string;
  isValid?: boolean;
  reason?: string;
  parentCodes?: string[];
}

export interface ValidationResult {
  code: string;
  isValid: boolean;
  description?: string;
  reason?: string;
  parentCodes?: {
    code: string;
    description: string;
  }[];
}

export interface HSNMasterData {
  [code: string]: {
    description: string;
  };
}
