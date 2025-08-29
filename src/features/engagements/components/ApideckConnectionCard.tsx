// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { cn } from "@/lib/utils"; // Assuming you have a utility for class merging

// interface ConnectionCardProps {
//   connection: {
//     id: string;
//     userId: string;
//     unifiedApi: string;
//     createdAt: string;
//     connectionId: string;
//     consumerId: string;
//     label: string;
//     serviceId: string;
//     status: string | null;
//   };
//   className?: string;
// }

// export function ApideckConnectionCard({ connection, className }: ConnectionCardProps) {
//   const formattedDate = new Date(connection.createdAt).toLocaleDateString("en-US", {
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//     hour: "2-digit",
//     minute: "2-digit",
//   });

//   const statusVariant = connection.status === "active" ? "default" : "secondary";

//   return (
//     <Card className={cn("w-full shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out", className)}>
//       <CardHeader>
//         <CardTitle className="flex items-center justify-between text-lg font-semibold text-gray-800">
//           {connection.label.charAt(0).toUpperCase() + connection.label.slice(1)}
//           <Badge variant={statusVariant} className="ml-2">
//             {connection.status ? connection.status.charAt(0).toUpperCase() + connection.status.slice(1) : "Unknown"}
//           </Badge>
//         </CardTitle>
//         <CardDescription className="text-sm text-gray-500">
//           Unified API: {connection.unifiedApi}
//         </CardDescription>
//       </CardHeader>
//       <CardContent className="grid gap-2 text-gray-700">
//         <div className="flex items-center space-x-2">
//           <span className="font-medium">Service ID:</span>
//           <span className="text-sm">{connection.serviceId}</span>
//         </div>
//         <div className="flex items-center space-x-2">
//           <span className="font-medium">Consumer ID:</span>
//           <span className="text-sm">{connection.consumerId}</span>
//         </div>
//         <div className="flex items-center space-x-2">
//           <span className="font-medium">Connection ID:</span>
//           <span className="text-sm truncate">{connection.connectionId}</span>
//         </div>
//         <div className="flex items-center space-x-2">
//           <span className="font-medium">Created At:</span>
//           <span className="text-sm">{formattedDate}</span>
//         </div>
//       </CardContent>
//       <CardFooter className="flex justify-end p-4 pt-2">
//         <span className="text-xs text-gray-400">ID: {connection.id.substring(0, 8)}...</span>
//       </CardFooter>
//     </Card>
//   );
// }




// ###################################################################################################################




import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils"; // Assuming you have a utility for class merging

interface ConnectionCardProps {
  connection: {
    id: string;
    userId: string;
    unifiedApi: string;
    createdAt: string;
    connectionId: string;
    consumerId: string;
    label: string;
    serviceId: string;
    status: string | null;
  };
  className?: string;
  onClick?: (connectionId: string) => void; // Added onClick prop
  isActive?: boolean; // Added isActive prop for styling when selected
}

export function ApideckConnectionCard({ connection, className, onClick, isActive }: ConnectionCardProps) {
  const formattedDate = new Date(connection.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const statusVariant = connection.status === "active" ? "default" : "secondary";

  return (
    <Card
      className={cn(
        "w-full shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out cursor-pointer", // Added cursor-pointer
        isActive && "border-2 border-primary ring-2 ring-primary-foreground", // Highlight active card
        className
      )}
      onClick={() => onClick && onClick(connection.serviceId)} // Call onClick with connectionId
    >
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-lg font-semibold text-gray-800">
          {connection.label.charAt(0).toUpperCase() + connection.label.slice(1)}
          <Badge variant={statusVariant} className="ml-2">
            {connection.status ? connection.status.charAt(0).toUpperCase() + connection.status.slice(1) : "Unknown"}
          </Badge>
        </CardTitle>
        <CardDescription className="text-sm text-gray-500">
          Unified API: {connection.unifiedApi}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2 text-gray-700">
        <div className="flex items-center space-x-2">
          <span className="font-medium">Service ID:</span>
          <span className="text-sm">{connection.serviceId}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="font-medium">Consumer ID:</span>
          <span className="text-sm">{connection.consumerId}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="font-medium">Connection ID:</span>
          <span className="text-sm truncate">{connection.connectionId}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="font-medium">Created At:</span>
          <span className="text-sm">{formattedDate}</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end p-4 pt-2">
        <span className="text-xs text-gray-400">ID: {connection.id.substring(0, 8)}...</span>
      </CardFooter>
    </Card>
  );
}