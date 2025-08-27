// components/ConnectionCard.tsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format, parseISO } from 'date-fns';

interface Connection {
  id: string;
  secret: string;
  provider_id: string;
  provider_code: string;
  provider_name: string;
  customer_id: string;
  next_refresh_possible_at: string;
  created_at: string;
  updated_at: string;
  status: 'active' | 'inactive' | 'error'; // Added for example, adjust as per your actual data
  categorization: string;
  daily_refresh: boolean;
  store_credentials: boolean;
  country_code: string;
  last_success_at: string;
  show_consent_confirmation: boolean;
  last_consent_id: string;
  last_attempt: {
    id: string;
    finished: boolean;
    api_mode: string;
    api_version: string;
    locale: string;
    user_present: boolean;
    customer_last_logged_at: string | null;
    remote_ip: string;
    finished_recent: boolean;
    partial: boolean;
    automatic_fetch: boolean;
    daily_refresh: boolean;
    categorize: boolean;
    custom_fields: {};
    device_type: string;
    user_agent: string;
    exclude_accounts: any[];
    fetch_scopes: string[];
    from_date: string;
    to_date: string;
    interactive: boolean;
    store_credentials: boolean;
    include_natures: any | null;
    show_consent_confirmation: boolean;
    consent_id: string;
    fail_at: string | null;
    fail_message: string | null;
    fail_error_class: string | null;
    created_at: string;
    updated_at: string;
    success_at: string | null;
    unduplication_strategy: string;
    last_stage: {
      id: string;
      name: string;
      interactive_html: string | null;
      interactive_fields_names: string | null;
      interactive_fields_options: string | null;
      created_at: string;
      updated_at: string;
    };
  };
}

interface ConnectionCardProps {
  connection: Connection;
  onSelect: (connection:any) => void;
}

const ConnectionCard: React.FC<ConnectionCardProps> = ({ connection, onSelect }) => {
  const getStatusBadgeVariant = (status: Connection['status']) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'inactive':
        return 'secondary';
      case 'error':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const formatDateTime = (isoString: string | null) => {
    if (!isoString) return 'N/A';
    try {
      return format(parseISO(isoString), 'MMM dd, yyyy HH:mm');
    } catch (error) {
      console.error("Error parsing date:", isoString, error);
      return 'Invalid Date';
    }
  };

  return (
    <TooltipProvider>
      <Card onClick={() => onSelect(connection)} className="w-full shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-bold">{connection.provider_name}</CardTitle>
          <Badge variant={getStatusBadgeVariant(connection.status)} className="capitalize">
            {connection.status}
          </Badge>
        </CardHeader>
        <CardDescription className="px-6 pb-4 text-sm text-muted-foreground">
          Provider Code: {connection.provider_code}
        </CardDescription>
        <CardContent className="space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <span className="font-medium">Connection ID:</span>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-gray-600 truncate max-w-[150px] cursor-help">
                  {connection.id}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>{connection.id}</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Customer ID:</span>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-gray-600 truncate max-w-[150px] cursor-help">
                  {connection.customer_id}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>{connection.customer_id}</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Country:</span>
            <span className="text-gray-600">{connection.country_code}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Created:</span>
            <span className="text-gray-600">{formatDateTime(connection.created_at)}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Last Success:</span>
            <span className="text-gray-600">{formatDateTime(connection.last_success_at)}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Next Refresh:</span>
            <span className="text-gray-600">{formatDateTime(connection.next_refresh_possible_at)}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Daily Refresh:</span>
            <Badge variant={connection.daily_refresh ? 'outline' : 'secondary'}>
              {connection.daily_refresh ? 'Enabled' : 'Disabled'}
            </Badge>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Store Credentials:</span>
            <Badge variant={connection.store_credentials ? 'outline' : 'secondary'}>
              {connection.store_credentials ? 'Yes' : 'No'}
            </Badge>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2 p-4">
          <Button variant="outline" size="sm">View Details</Button>
          <Button size="sm">Manage</Button>
        </CardFooter>
      </Card>
    </TooltipProvider>
  );
};

export default ConnectionCard;