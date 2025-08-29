// import { ApideckConnectionCard } from "./ApideckConnectionCard";

// interface ConnectionListProps {
//   connections: Array<{
//     id: string;
//     userId: string;
//     unifiedApi: string;
//     createdAt: string;
//     connectionId: string;
//     consumerId: string;
//     label: string;
//     serviceId: string;
//     status: string | null;
//   }>;
// }

// export function ApideckConnectionList({ connections }: ConnectionListProps) {
//   return (
//     <div className="container mx-auto p-4 sm:p-6 lg:p-8">
//       <h2 className="text-3xl font-bold mb-8 text-center text-gray-900"> Connections (apideck)</h2>
//       <div className="grid grid-cols-1  lg:grid-cols-2 gap-2">
//         {connections.map((connection) => (
//           <ApideckConnectionCard key={connection.id} connection={connection} />
//         ))}
//       </div>
//     </div>
//   );
// }



//##################################################################################################################



import { ApideckConnectionCard } from "./ApideckConnectionCard";

interface ConnectionListItem extends Omit<React.ComponentProps<typeof ApideckConnectionCard>, 'connection'> {
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
}

interface ApideckConnectionListProps {
  connections: ConnectionListItem[]; // Array of connection objects with optional onClick/isActive
}

export function ApideckConnectionList({ connections }: ApideckConnectionListProps) {
  return (
    <div className="w-full container mx-auto p-0"> {/* Adjusted padding */}
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-900"> Connections (Apideck)</h2>
      <div className="grid grid-cols-1 md:grid-cols-2  gap-4"> {/* Adjusted grid for list on left */}
        {connections.map((item, index) => (
          <ApideckConnectionCard
            key={index}
            connection={item.connection}
            onClick={item.onClick}
            isActive={item.isActive}
            className={item.className}
          />
        ))}
      </div>
    </div>
  );
}