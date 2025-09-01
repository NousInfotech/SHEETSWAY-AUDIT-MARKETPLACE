// src\features\engagements\components\ApideckConnectionList.tsx
import { ApideckConnectionCard } from './ApideckConnectionCard';

interface ConnectionListItem extends Omit<React.ComponentProps<typeof ApideckConnectionCard>, 'connection'> {
  connection: {
    id: string;
    name: string;
    icon: string;
    logo: string;
    serviceId: string;
    unifiedApi: string;
    consumerId: string;
    authType: string;
    createdAt: string;
  };
}

interface ApideckConnectionListProps {
  connections: ConnectionListItem[]; // Array of connection objects with optional onClick/isActive
}

export function ApideckConnectionList({
  connections,
}: ApideckConnectionListProps) {
  return (
    <div className='container mx-auto p-0 w-full'>
      {' '}
      {/* Adjusted padding */}
      <h2 className='mb-6 text-center text-3xl font-bold text-gray-900'>
        {' '}
        Connections (Apideck)
      </h2>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        {' '}
        {/* Adjusted grid for list on left */}
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