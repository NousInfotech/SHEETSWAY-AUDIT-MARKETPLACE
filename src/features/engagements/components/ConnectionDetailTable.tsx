import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton"; // For loading state

interface ConnectionDetailTableProps<T extends Record<string, any>> {
  title: string;
  data: T[] | null;
  isLoading: boolean;
  error: string | null;
  emptyMessage?: string;
}

export function ConnectionDetailTable<T extends Record<string, any>>({
  title,
  data,
  isLoading,
  error,
  emptyMessage = "No data available.",
}: ConnectionDetailTableProps<T>) {
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

  return (
    <div className="rounded-md border bg-white p-4 shadow-sm">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">{title}</h3>
      <div className="overflow-x-auto">
        <Table>
          <TableCaption>{`A list of ${title.toLowerCase()}.`}</TableCaption>
          <TableHeader>
            <TableRow>
              {headers.map((header) => (
                <TableHead key={header} className="whitespace-nowrap">
                  {header.charAt(0).toUpperCase() + header.slice(1).replace(/([A-Z])/g, ' $1')}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {headers.map((header) => (
                  <TableCell key={header} className="whitespace-nowrap">
                    {typeof row[header] === 'object' && row[header] !== null
                      ? JSON.stringify(row[header]) // Handle nested objects by stringifying
                      : String(row[header])}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}