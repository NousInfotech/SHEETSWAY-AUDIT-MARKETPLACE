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
        return 'default'; // A nice primary color for active
      case 'inactive':
        return 'secondary'; // Muted color for inactive
      case 'error':
        return 'destructive'; // Red for errors
      default:
        return 'outline'; // Default neutral
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
      <Card
        onClick={() => onSelect(connection)}
        className="
          w-full max-w-sm cursor-pointer
          overflow-hidden rounded-xl
          shadow-lg transition-all duration-300 ease-in-out
          hover:scale-[1.02] hover:shadow-2xl
          bg-gradient-to-br from-indigo-50 to-purple-50
          dark:from-gray-800 dark:to-gray-900
          text-gray-900 dark:text-gray-100
          border border-gray-200 dark:border-gray-700
        "
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-6 border-b border-gray-100 dark:border-gray-700/50">
          <CardTitle className="text-2xl font-extrabold tracking-tight text-amber-700 dark:text-amber-300">
            {connection.provider_name}
          </CardTitle>
          <Badge
            variant={getStatusBadgeVariant(connection.status)}
            className="capitalize px-3 py-1 text-sm font-semibold rounded-full"
          >
            {connection.status}
          </Badge>
        </CardHeader>

        <CardDescription className="px-6 py-4 text-md text-gray-600 dark:text-gray-400">
          <span className="font-semibold">Provider Code:</span> {connection.provider_code}
        </CardDescription>

        <CardContent className="space-y-4 p-6 text-sm">
          {[
            { label: "Connection ID", value: connection.id },
            { label: "Customer ID", value: connection.customer_id },
          ].map((item, index) => (
            <div key={index} className="flex justify-between items-center group">
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {item.label}:
              </span>
              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  <span
                    className="
                      text-gray-500 dark:text-gray-400
                      truncate max-w-[150px] cursor-help
                      relative
                      after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-indigo-400
                      group-hover:after:w-full after:transition-all after:duration-300 after:ease-out
                    "
                  >
                    {item.value}
                  </span>
                </TooltipTrigger>
                <TooltipContent className="bg-gray-800 text-white border-none shadow-lg rounded-md">
                  <p>{item.value}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          ))}

          <div className="flex justify-between border-t border-gray-100 dark:border-gray-700/50 pt-4">
            <span className="font-medium text-gray-700 dark:text-gray-300">Country:</span>
            <span className="text-gray-500 dark:text-gray-400">{connection.country_code}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700 dark:text-gray-300">Created:</span>
            <span className="text-gray-500 dark:text-gray-400">{formatDateTime(connection.created_at)}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700 dark:text-gray-300">Last Success:</span>
            <span className="text-gray-500 dark:text-gray-400">{formatDateTime(connection.last_success_at)}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700 dark:text-gray-300">Next Refresh:</span>
            <span className="text-gray-500 dark:text-gray-400">{formatDateTime(connection.next_refresh_possible_at)}</span>
          </div>

          <div className="flex justify-between items-center pt-2">
            <span className="font-medium text-gray-700 dark:text-gray-300">Daily Refresh:</span>
            <Badge
              variant={connection.daily_refresh ? 'default' : 'secondary'}
              className="font-medium px-2 py-1"
            >
              {connection.daily_refresh ? 'Enabled' : 'Disabled'}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700 dark:text-gray-300">Store Credentials:</span>
            <Badge
              variant={connection.store_credentials ? 'default' : 'secondary'}
              className="font-medium px-2 py-1"
            >
              {connection.store_credentials ? 'Yes' : 'No'}
            </Badge>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end p-6 border-t border-gray-100 dark:border-gray-700/50">
          <Button
            variant="default"
            size="lg"
            className="
              w-full rounded-full
              bg-amber-500 hover:bg-amber-600
              text-white font-semibold
              shadow-md hover:shadow-lg
              transition-all duration-300 ease-in-out
              transform hover:-translate-y-0.5
            "
          >
            View Details
          </Button>
        </CardFooter>
      </Card>
    </TooltipProvider>
  );
};

export default ConnectionCard;