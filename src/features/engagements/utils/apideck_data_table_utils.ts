// src/utils/dataUtils.ts

/**
 * Utility functions for processing and formatting API data
 */

// Type definitions for better type safety
export interface ProcessedData {
  [key: string]: any;
}

/**
 * Safely converts any data structure to a displayable format
 */
export const formatDisplayValue = (value: any): string => {
  if (value === null || value === undefined) {
    return '—';
  }
  
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }
  
  if (typeof value === 'number') {
    // Format numbers with appropriate decimal places
    return value % 1 === 0 ? value.toString() : value.toFixed(2);
  }
  
  if (typeof value === 'string') {
    return value.trim() || '—';
  }
  
  if (value instanceof Date) {
    return value.toLocaleDateString();
  }
  
  if (Array.isArray(value)) {
    return `Array (${value.length} items)`;
  }
  
  if (typeof value === 'object') {
    // return `Object (${Object.keys(value).length} keys)`;
    return `Details (${Object.keys(value).length} fields)`;
  }
  
  return String(value);
};

/**
 * Determines if a value is complex (array or object) and needs special rendering
 */
export const isComplexValue = (value: any): boolean => {
  return (typeof value === 'object' && value !== null) || Array.isArray(value);
};

/**
 * Safely extracts nested object properties for display
 */
export const getNestedProperty = (obj: any, path: string): any => {
  return path.split('.').reduce((current, key) => {
    return current && typeof current === 'object' ? current[key] : undefined;
  }, obj);
};

/**
 * Flattens nested objects for table display while preserving complex data
 */
export const flattenForTable = (data: any[], maxDepth: number = 2): ProcessedData[] => {
  const flattenObject = (obj: any, prefix: string = '', depth: number = 0): any => {
    if (depth >= maxDepth) return obj;
    
    const flattened: any = {};
    
    Object.keys(obj).forEach(key => {
      const value = obj[key];
      const newKey = prefix ? `${prefix}.${key}` : key;
      
      if (value && typeof value === 'object' && !Array.isArray(value) && depth < maxDepth - 1) {
        // Recursively flatten objects
        Object.assign(flattened, flattenObject(value, newKey, depth + 1));
      } else {
        // Keep the original value for arrays, primitives, or when max depth reached
        flattened[newKey] = value;
      }
    });
    
    return flattened;
  };

  return data.map(item => flattenObject(item));
};

/**
 * Analyzes data structure and suggests optimal column widths
 */
export const analyzeColumnWidths = (data: any[]): { [key: string]: 'narrow' | 'medium' | 'wide' | 'full' } => {
  if (!data || data.length === 0) return {};
  
  const columnWidths: { [key: string]: 'narrow' | 'medium' | 'wide' | 'full' } = {};
  const headers = Object.keys(data[0]);
  
  headers.forEach(header => {
    let maxLength = header.length;
    let hasComplexData = false;
    
    data.forEach(row => {
      const value = row[header];
      
      if (isComplexValue(value)) {
        hasComplexData = true;
      } else {
        const stringValue = formatDisplayValue(value);
        maxLength = Math.max(maxLength, stringValue.length);
      }
    });
    
    if (hasComplexData) {
      columnWidths[header] = 'full';
    } else if (maxLength <= 10) {
      columnWidths[header] = 'narrow';
    } else if (maxLength <= 25) {
      columnWidths[header] = 'medium';
    } else {
      columnWidths[header] = 'wide';
    }
  });
  
  return columnWidths;
};

/**
 * Groups data by a specific field for better organization
 */
export const groupDataBy = (data: any[], groupField: string): { [key: string]: any[] } => {
  return data.reduce((groups, item) => {
    const groupValue = formatDisplayValue(item[groupField]);
    if (!groups[groupValue]) {
      groups[groupValue] = [];
    }
    groups[groupValue].push(item);
    return groups;
  }, {});
};

/**
 * Searches through data for matching values
 */
export const searchData = (data: any[], searchTerm: string): any[] => {
  if (!searchTerm.trim()) return data;
  
  const term = searchTerm.toLowerCase();
  
  return data.filter(item => {
    return Object.values(item).some(value => {
      if (isComplexValue(value)) {
        return JSON.stringify(value).toLowerCase().includes(term);
      }
      return formatDisplayValue(value).toLowerCase().includes(term);
    });
  });
};

/**
 * Sorts data by a specific field with proper type handling
 */
export const sortData = (data: any[], sortField: string, direction: 'asc' | 'desc' = 'asc'): any[] => {
  return [...data].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    // Handle null/undefined values
    if (aValue === null || aValue === undefined) aValue = '';
    if (bValue === null || bValue === undefined) bValue = '';
    
    // Handle different data types
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return direction === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      const comparison = aValue.localeCompare(bValue);
      return direction === 'asc' ? comparison : -comparison;
    }
    
    if (aValue instanceof Date && bValue instanceof Date) {
      const comparison = aValue.getTime() - bValue.getTime();
      return direction === 'asc' ? comparison : -comparison;
    }
    
    // Fallback to string comparison
    const aStr = String(aValue);
    const bStr = String(bValue);
    const comparison = aStr.localeCompare(bStr);
    return direction === 'asc' ? comparison : -comparison;
  });
};

/**
 * Validates and sanitizes data for safe rendering
 */
export const sanitizeData = (data: any[]): any[] => {
  return data.map(item => {
    const sanitized: any = {};
    
    Object.keys(item).forEach(key => {
      const value = item[key];
      
      // Remove potentially problematic keys/values
      if (key.startsWith('__') || key.includes('password') || key.includes('secret')) {
        return;
      }
      
      // Sanitize the value
      if (typeof value === 'string') {
        sanitized[key] = value.trim();
      } else if (value === null || value === undefined) {
        sanitized[key] = null;
      } else {
        sanitized[key] = value;
      }
    });
    
    return sanitized;
  });
};

/**
 * Converts data to CSV format for export
 */
export const convertToCSV = (data: any[]): string => {
  if (!data || data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csvHeaders = headers.join(',');
  
  const csvRows = data.map(row => {
    return headers.map(header => {
      const value = row[header];
      
      if (isComplexValue(value)) {
        return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
      }
      
      const stringValue = formatDisplayValue(value);
      
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      
      return stringValue;
    }).join(',');
  });
  
  return [csvHeaders, ...csvRows].join('\n');
};