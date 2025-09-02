// import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Skeleton } from "@/components/ui/skeleton"; // For loading state

// interface ConnectionDetailTableProps<T extends Record<string, any>> {
//   title: string;
//   data: T[] | null;
//   isLoading: boolean;
//   error: string | null;
//   emptyMessage?: string;
// }

// export function ConnectionDetailTable<T extends Record<string, any>>({
//   title,
//   data,
//   isLoading,
//   error,
//   emptyMessage = "No data available.",
// }: ConnectionDetailTableProps<T>) {
//   if (isLoading) {
//     return (
//       <div className="space-y-4">
//         <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
//         <Skeleton className="h-10 w-full" />
//         <Skeleton className="h-10 w-full" />
//         <Skeleton className="h-10 w-full" />
//         <Skeleton className="h-10 w-full" />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="space-y-4">
//         <h3 className="text-xl font-semibold text-red-700">{title}</h3>
//         <p className="text-red-500">Error fetching data: {error}</p>
//       </div>
//     );
//   }

//   if (!data || data.length === 0) {
//     return (
//       <div className="space-y-4">
//         <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
//         <p className="text-gray-500">{emptyMessage}</p>
//       </div>
//     );
//   }

//   // Extract headers from the first data object
//   const headers = Object.keys(data[0]);

//   return (
//     <div className="rounded-md border bg-white p-4 shadow-sm">
//       <h3 className="text-xl font-semibold mb-4 text-gray-800">{title}</h3>
//       <div className="overflow-x-auto">
//         <Table>
//           <TableCaption>{`A list of ${title.toLowerCase()}.`}</TableCaption>
//           <TableHeader>
//             <TableRow>
//               {headers.map((header) => (
//                 <TableHead key={header} className="whitespace-nowrap">
//                   {header.charAt(0).toUpperCase() + header.slice(1).replace(/([A-Z])/g, ' $1')}
//                 </TableHead>
//               ))}
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {data.map((row, rowIndex) => (
//               <TableRow key={rowIndex}>
//                 {headers.map((header) => (
//                   <TableCell key={header} className="whitespace-nowrap">
//                     {typeof row[header] === 'object' && row[header] !== null
//                       ? JSON.stringify(row[header]) // Handle nested objects by stringifying
//                       : String(row[header])}
//                   </TableCell>
//                 ))}
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </div>
//     </div>
//   );
// }





// ########################################################################################################








import React, { useState } from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Eye, EyeOff } from "lucide-react";

interface ConnectionDetailTableProps<T extends Record<string, any>> {
  title: string;
  data: T[] | null;
  isLoading: boolean;
  error: string | null;
  emptyMessage?: string;
}

// Component to render complex data (arrays/objects)
interface ComplexDataRendererProps {
  data: any;
  maxPreviewItems?: number;
}

const ComplexDataRenderer: React.FC<ComplexDataRendererProps> = ({ 
  data, 
  maxPreviewItems = 3 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (data === null || data === undefined) {
    return <span className="text-gray-400 italic">null</span>;
  }

  // Handle arrays
  if (Array.isArray(data)) {
    if (data.length === 0) {
      // return <Badge variant="outline" className="text-xs">Empty Array</Badge>;
      return <Badge variant="outline" className="text-xs">Empty</Badge>;
    }

    const previewItems = data.slice(0, maxPreviewItems);
    const hasMore = data.length > maxPreviewItems;

    return (
      <div className="space-y-1">
        <div className="flex items-center gap-1">
          <Badge variant="secondary" className="text-xs">
            {/* Array ({data.length}) */}
            list view ({data.length})
          </Badge>
          {data.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
            </Button>
          )}
        </div>
        
        {isExpanded ? (
          <div className="bg-gray-50 p-2 rounded text-xs max-w-xs overflow-auto max-h-32">
            <pre className="whitespace-pre-wrap">{JSON.stringify(data, null, 2)}</pre>
          </div>
        ) : (
          <div className="text-xs text-gray-600">
            {previewItems.map((item, index) => (
              <div key={index} className="truncate max-w-xs">
                {typeof item === 'object' ? JSON.stringify(item) : String(item)}
              </div>
            ))}
            {hasMore && (
              <div className="text-gray-400 italic">
                +{data.length - maxPreviewItems} more items
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Handle objects
  if (typeof data === 'object') {
    const keys = Object.keys(data);
    
    if (keys.length === 0) {
      return <Badge variant="outline" className="text-xs">Empty Object</Badge>;
    }

    const previewKeys = keys.slice(0, maxPreviewItems);
    const hasMore = keys.length > maxPreviewItems;

    return (
      <div className="space-y-1">
        <div className="flex items-center gap-1">
          <Badge variant="secondary" className="text-xs">
            {/* Object ({keys.length} keys) */}
            Details ({keys.length} fields)
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
          </Button>
        </div>
        
        {isExpanded ? (
          <div className="bg-gray-50 p-2 rounded text-xs max-w-xs overflow-auto max-h-32">
            <pre className="whitespace-pre-wrap">{JSON.stringify(data, null, 2)}</pre>
          </div>
        ) : (
          <div className="text-xs text-gray-600 space-y-0.5">
            {previewKeys.map((key) => (
              <div key={key} className="truncate max-w-xs">
                <span className="font-medium">{key}:</span>{' '}
                {typeof data[key] === 'object' 
                  ? `[${Array.isArray(data[key]) ? 'Array' : 'Object'}]`
                  : String(data[key]).substring(0, 20) + (String(data[key]).length > 20 ? '...' : '')
                }
              </div>
            ))}
            {hasMore && (
              <div className="text-gray-400 italic">
                +{keys.length - maxPreviewItems} more keys
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Handle primitive values
  return <span>{String(data)}</span>;
};

// Component to render table cell content
interface TableCellContentProps {
  value: any;
  maxLength?: number;
}

const TableCellContent: React.FC<TableCellContentProps> = ({ 
  value, 
  maxLength = 50 
}) => {

  const [showFull, setShowFull] = useState(false);


  // Handle null/undefined
  if (value === null || value === undefined) {
    return <span className="text-gray-400 italic">—</span>;
  }

  // Handle complex data (arrays/objects)
  if (typeof value === 'object') {
    return <ComplexDataRenderer data={value} />;
  }

  // Handle primitive values
  const stringValue = String(value);
  const isLong = stringValue.length > maxLength;
  

  if (!isLong) {
    return <span>{stringValue}</span>;
  }

  return (
    <div className="space-y-1">
      <div>
        {showFull ? stringValue : `${stringValue.substring(0, maxLength)}...`}
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="h-5 text-xs p-1"
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
  emptyMessage = "No data available.",
}: ConnectionDetailTableProps<T>) {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-red-700">{title}</h3>
        <p className="text-red-500">Error fetching data: {error}</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  // Extract headers from the first data object
  const headers = Object.keys(data[0]);

  const toggleRowExpansion = (rowIndex: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(rowIndex)) {
      newExpanded.delete(rowIndex);
    } else {
      newExpanded.add(rowIndex);
    }
    setExpandedRows(newExpanded);
  };

  // Check if any row has complex data that might benefit from expansion
  const hasComplexData = data.some(row => 
    headers.some(header => typeof row[header] === 'object' && row[header] !== null)
  );

  return (
    <div className="rounded-md border bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        <Badge variant="outline">{data.length} record{data.length !== 1 ? 's' : ''}</Badge>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableCaption>{`A list of ${title.toLowerCase()}.`}</TableCaption>
          <TableHeader>
            <TableRow>
              {hasComplexData && (
                <TableHead className="w-10"></TableHead>
              )}
              {headers.map((header) => (
                <TableHead key={header} className="whitespace-nowrap">
                  {header.charAt(0).toUpperCase() + header.slice(1).replace(/([A-Z])/g, ' $1')}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, rowIndex) => (
              <React.Fragment key={rowIndex}>
                <TableRow className={expandedRows.has(rowIndex) ? "bg-gray-50" : ""}>
                  {hasComplexData && (
                    <TableCell className="w-10">
                      {headers.some(header => typeof row[header] === 'object' && row[header] !== null) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => toggleRowExpansion(rowIndex)}
                        >
                          {expandedRows.has(rowIndex) ? 
                            <ChevronDown className="h-4 w-4" /> : 
                            <ChevronRight className="h-4 w-4" />
                          }
                        </Button>
                      )}
                    </TableCell>
                  )}
                  {headers.map((header) => (
                    <TableCell key={header} className="align-top">
                      <TableCellContent value={row[header]} />
                    </TableCell>
                  ))}
                </TableRow>
                
                {expandedRows.has(rowIndex) && (
                  <TableRow>
                    <TableCell 
                      colSpan={headers.length + (hasComplexData ? 1 : 0)} 
                      className="bg-gray-50 p-4"
                    >
                      <div className="space-y-3">
                        <h4 className="font-medium text-gray-700">Detailed View</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {headers.map((header) => (
                            <div key={header} className="space-y-1">
                              <div className="text-sm font-medium text-gray-600">
                                {header.charAt(0).toUpperCase() + header.slice(1).replace(/([A-Z])/g, ' $1')}
                              </div>
                              <div className="text-sm">
                                <ComplexDataRenderer data={row[header]} maxPreviewItems={10} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}