
// src\features\engagements\components\ConnectionDetailTable.tsx

import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight, ChevronLeft, ChevronRight as ChevronRightIcon } from 'lucide-react'; // Renamed ChevronRight to avoid conflict

interface ConnectionDetailTableProps<T extends Record<string, any>> {
  title: string;
  data: T[] | null;
  isLoading: boolean;
  error: string | null;
  emptyMessage?: string;
}

// --- Constants for Pagination ---
const ROWS_PER_PAGE = 5;

// --- Helper for Date Formatting ---
const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    // Check if the date is valid and not just an invalid date string parsed to "Invalid Date"
    if (isNaN(date.getTime())) {
      return dateString; // Return original if not a valid date
    }
    return date.toLocaleDateString('en-CA', { // 'en-CA' gives YYYY-MM-DD format
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  } catch (e) {
    return dateString; // Fallback to original string on error
  }
};

// --- Regex to detect common date/datetime string patterns ---
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?)?$/;

// --- ComplexDataRenderer for the FULL detailed expanded row ONLY (shows raw JSON) ---
interface ComplexDataRendererProps {
  data: any;
}

const ComplexDataRenderer: React.FC<ComplexDataRendererProps> = ({ data }) => {
  if (data === null || data === undefined) {
    return <span className='text-gray-400 italic'>null</span>;
  }

  // Always show full JSON for complex types in the detailed expanded row
  if (Array.isArray(data) || (typeof data === 'object' && Object.keys(data).length > 0)) {
    return (
      <div className='max-h-60 overflow-auto rounded bg-gray-50 p-2 text-xs'>
        <pre className='whitespace-pre-wrap'>{JSON.stringify(data, null, 2)}</pre>
      </div>
    );
  }

  // For primitive values or empty objects/arrays, just display them directly
  return <span>{String(data)}</span>;
};


// --- Helper function to flatten an object/array into dot-notation keys ---
// This will be crucial for generating dynamic headers
const flattenObject = (obj: any, prefix = '', result: { [key: string]: any } = {}): { [key: string]: any } => {
  if (obj === null || obj === undefined) {
    return result;
  }

  if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      // For arrays, use index in key, e.g., 'emails[0].email'
      if (typeof item === 'object' && item !== null) {
        flattenObject(item, `${prefix}[${index}].`, result);
      } else {
        // If array contains primitives, include them directly with index
        result[`${prefix}[${index}]`] = item;
      }
    });
  } else if (typeof obj === 'object') {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = obj[key];
        const newKey = prefix ? `${prefix}${key}` : key; // No leading dot if no prefix

        if (typeof value === 'object' && value !== null && (Object.keys(value).length > 0 || Array.isArray(value))) {
          // If it's a non-empty object or array, recurse
          flattenObject(value, `${newKey}.`, result);
        } else {
          // It's a primitive or empty object/array, assign directly
          result[newKey] = value;
        }
      }
    }
  } else {
    // This case handles a primitive value at the root level if flattenObject is called directly on it
    // In our context, it will always be called on an object from a row.
    // However, if a nested value is a primitive, it will be added by the parent's loop.
  }
  return result;
};

// --- Helper to generate dynamic table data (headers and flattened rows) ---
const generateDynamicTableData = <T extends Record<string, any>>(rawData: T[]) => {
  const allFlattenedRows: { original: T; flattened: { [key: string]: any } }[] = [];
  const uniqueHeaders = new Set<string>();

  rawData.forEach(row => {
    const flattened = flattenObject(row);
    allFlattenedRows.push({ original: row, flattened });
    Object.keys(flattened).forEach(key => uniqueHeaders.add(key));
  });

  const headers = Array.from(uniqueHeaders).sort(); // Sort headers alphabetically for consistency

  return { headers, flattenedRows: allFlattenedRows };
};


// --- Component to render table cell content for the main table rows (flattened values) ---
interface TableCellContentProps {
  value: any;
  maxLength?: number; // Maximum length before truncation
}

const TableCellContent: React.FC<TableCellContentProps> = ({
  value,
  maxLength = 100 // Default maxLength
}) => {
  const [showFull, setShowFull] = useState(false);

  // Handle null/undefined
  if (value === null || value === undefined) {
    return <span className='text-gray-400 italic'>—</span>;
  }

  let displayValue: string;

  // Check if the value is a string and matches a date pattern
  if (typeof value === 'string' && DATE_REGEX.test(value)) {
    displayValue = formatDate(value);
  } else {
    displayValue = String(value); // Directly convert value to string for display
  }
  
  const isLong = displayValue.length > maxLength;

  // If it's not long, just display it
  if (!isLong) {
    return <span>{displayValue}</span>;
  }

  // Otherwise, show truncated string with "Show More/Less" button
  return (
    <div className='space-y-1'>
      <div>
        {showFull ? displayValue : `${displayValue.substring(0, maxLength)}...`}
      </div>
      <Button
        variant='ghost'
        size='sm'
        className='h-5 p-1 text-xs'
        onClick={() => setShowFull(!showFull)}
      >
        {showFull ? 'Show Less' : 'Show More'}
      </Button>
    </div>
  );
};


export function ConnectionDetailTable<T extends Record<string, any>>({
  title,
  data,
  isLoading,
  error,
  emptyMessage = 'No data available.'
}: ConnectionDetailTableProps<T>) {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1); // State for pagination

  // Memoize the dynamic table data generation to avoid recalculating on every render
  const { headers, flattenedRows } = useMemo(() => {
    // Reset to first page when data changes
    setCurrentPage(1); 
    if (!data || data.length === 0) {
      return { headers: [], flattenedRows: [] };
    }
    return generateDynamicTableData(data);
  }, [data]);

  // Calculate pagination details
  const totalPages = Math.ceil(flattenedRows.length / ROWS_PER_PAGE);
  const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
  const endIndex = startIndex + ROWS_PER_PAGE;
  const currentRows = flattenedRows.slice(startIndex, endIndex);

  // Event handlers for pagination
  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };


  if (isLoading) {
    return (
      <div className='space-y-4'>
        <h3 className='text-xl font-semibold text-gray-800'>{title}</h3>
        <Skeleton className='h-10 w-full' />
        <Skeleton className='h-10 w-full' />
        <Skeleton className='h-10 w-full' />
        <Skeleton className='h-10 w-full' />
      </div>
    );
  }

  if (error) {
    return (
      <div className='space-y-4'>
        <h3 className='text-xl font-semibold text-red-700'>{title}</h3>
        <p className='text-red-500'>Error fetching data: {error}</p>
      </div>
    );
  }

  if (!data || data.length === 0 || headers.length === 0) {
    return (
      <div className='space-y-4'>
        <h3 className='text-xl font-semibold text-gray-800'>{title}</h3>
        <p className='text-gray-500'>{emptyMessage}</p>
      </div>
    );
  }

  const toggleRowExpansion = (rowIndex: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(rowIndex)) {
      newExpanded.delete(rowIndex);
    } else {
      newExpanded.add(rowIndex);
    }
    setExpandedRows(newExpanded);
  };

  // The expand/collapse button for a row is now determined by whether its *original* data
  // contained any complex objects/arrays, regardless of the flattened display.
  // This is because the expanded view will show the original raw JSON.
  const hasExpandableContentInAnyRow = data.some((row) =>
    Object.values(row).some(
      (value) => (typeof value === 'object' && value !== null && Object.keys(value).length > 0) ||
                   (Array.isArray(value) && value.length > 0)
    )
  );


  return (
    <div className='rounded-md border bg-white p-4 shadow-sm'>
      <div className='mb-4 flex items-center justify-between'>
        <h3 className='text-xl font-semibold text-gray-800'>{title}</h3>
        <Badge variant='outline'>
          {data.length} record{data.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      <div className='overflow-x-auto'>
        <Table>
          <TableCaption>{`A list of ${title.toLowerCase()}.`}</TableCaption>
          <TableHeader>
            <TableRow>
              {hasExpandableContentInAnyRow && <TableHead className='w-10'></TableHead>}
              {headers.map((header) => (
                <TableHead key={header} className='whitespace-nowrap'>
                  {/* Nicely format the header, e.g., "Account.id" -> "Account Id" */}
                  {header.replace(/([.[\]])/g, ' $1 ').replace(/\b\w/g, c => c.toUpperCase()).replace(/\[ (\d+) \]/g, '[$1]').trim()}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentRows.map((rowWrapper, index) => {
              // We need originalRowIndex to correctly toggle expandedRows state
              // which refers to the index in the *full* flattenedRows array.
              const originalRowIndex = startIndex + index; 
              return (
                <React.Fragment key={originalRowIndex}>
                  <TableRow
                    className={expandedRows.has(originalRowIndex) ? 'bg-gray-50' : ''}
                  >
                    {hasExpandableContentInAnyRow && (
                      <TableCell className='w-10'>
                        {/* Show expand button if the original row had complex data */}
                        {Object.values(rowWrapper.original).some(
                          (value) => (typeof value === 'object' && value !== null && Object.keys(value).length > 0) ||
                                       (Array.isArray(value) && value.length > 0)
                        ) && (
                          <Button
                            variant='ghost'
                            size='sm'
                            className='h-6 w-6 p-0'
                            onClick={() => toggleRowExpansion(originalRowIndex)}
                            title={expandedRows.has(originalRowIndex) ? 'Collapse details' : 'Expand details'}
                          >
                            {expandedRows.has(originalRowIndex) ? (
                              <ChevronDown className='h-4 w-4' />
                            ) : (
                              <ChevronRight className='h-4 w-4' />
                            )}
                          </Button>
                        )}
                      </TableCell>
                    )}
                    {headers.map((header) => (
                      <TableCell key={header} className='align-top'>
                        <TableCellContent value={rowWrapper.flattened[header]} />
                      </TableCell>
                    ))}
                  </TableRow>

                  {expandedRows.has(originalRowIndex) && (
                    <TableRow>
                      <TableCell
                        colSpan={headers.length + (hasExpandableContentInAnyRow ? 1 : 0)}
                        className='bg-gray-50 p-4'
                      >
                        <div className='space-y-3'>
                          <h4 className='font-medium text-gray-700'>
                            Detailed View (Original Raw JSON)
                          </h4>
                          <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                            {/* Iterate over ORIGINAL row keys for the detailed view */}
                            {Object.keys(rowWrapper.original).map((originalKey) => (
                              <div key={originalKey} className='space-y-1'>
                                <div className='text-sm font-medium text-gray-600'>
                                  {originalKey.charAt(0).toUpperCase() +
                                    originalKey.slice(1).replace(/([A-Z])/g, ' $1')}
                                </div>
                                <div className='text-sm'>
                                  <ComplexDataRenderer data={rowWrapper.original[originalKey]} />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
          >
            Next <ChevronRightIcon className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}