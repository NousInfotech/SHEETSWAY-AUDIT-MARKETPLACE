// src\features\engagements\components\ApideckConnectionCard.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils'; // Assuming you have a utility for class merging

interface ConnectionCardProps {
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
  className?: string;
  onClick?: (serviceId: string) => void; // Changed to serviceId for onClick
  isActive?: boolean; // Added isActive prop for styling when selected
}

export function ApideckConnectionCard({
  connection,
  className,
  onClick,
  isActive,
}: ConnectionCardProps) {
  const formattedDate = new Date(connection.createdAt).toLocaleDateString(
    'en-US',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }
  );

  // Status is not present in the new interface, so we'll omit it or derive it if possible.
  // For now, removing status-related logic.
  // const statusVariant = connection.status === 'active' ? 'default' : 'secondary';

  return (
    <Card
      className={cn(
        'w-full cursor-pointer shadow-lg transition-shadow duration-300 ease-in-out hover:shadow-xl', // Added cursor-pointer
        isActive && 'border-primary ring-primary-foreground border-2 ring-2', // Highlight active card
        className
      )}
      onClick={() => onClick && onClick(connection.serviceId)} // Call onClick with serviceId
    >
      <CardHeader>
        <CardTitle className='flex items-center justify-between text-lg font-semibold text-gray-800'>
          {connection.name.charAt(0).toUpperCase() + connection.name.slice(1)}
          {/* Removed Badge as status is not in the new interface */}
        </CardTitle>
        <CardDescription className='text-sm text-gray-500'>
          Unified API: {connection.unifiedApi}
        </CardDescription>
      </CardHeader>
      <CardContent className='grid gap-2 text-gray-700'>
        <div className='flex items-center space-x-2'>
          <span className='font-medium'>Service ID:</span>
          <span className='text-sm'>{connection.serviceId}</span>
        </div>
        <div className='flex items-center space-x-2'>
          <span className='font-medium'>Consumer ID:</span>
          <span className='text-sm'>{connection.consumerId}</span>
        </div>
        <div className='flex items-center space-x-2'>
          <span className='font-medium'>Auth Type:</span>
          <span className='text-sm truncate'>{connection.authType}</span>
        </div>
        <div className='flex items-center space-x-2'>
          <span className='font-medium'>Created At:</span>
          <span className='text-sm'>{formattedDate}</span>
        </div>
      </CardContent>
      <CardFooter className='flex justify-end p-4 pt-2'>
        <span className='text-xs text-gray-400'>
          ID: {connection.id.substring(0, 8)}...
        </span>
      </CardFooter>
    </Card>
  );
}