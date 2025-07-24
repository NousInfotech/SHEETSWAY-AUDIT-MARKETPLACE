'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

// This type is used to define the shape of our data.
export type Project = {
  projectName: string;
  startDate: string;
  endDate: string;
  status:
    | 'Completed'
    | 'Fieldwork'
    | 'Manager Review'
    | 'Awaiting Client Info'
    | 'Planning'
    | 'Partner Review';
  budget: number;
};

// Helper function to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2
  }).format(amount);
};

// Helper to assign colors to status badges
const getStatusBadgeVariant = (
  status: Project['status']
): 'default' | 'secondary' | 'destructive' | 'outline' => {
  switch (status) {
    case 'Completed':
      return 'default'; // Green in shadcn default theme
    case 'Fieldwork':
    case 'Manager Review':
    case 'Partner Review':
      return 'secondary'; // Blue-ish/Gray
    case 'Planning':
      return 'outline'; // Light gray
    case 'Awaiting Client Info':
      return 'destructive'; // Red/Orange
    default:
      return 'secondary';
  }
};

export const columns: ColumnDef<Project>[] = [
  {
    accessorKey: 'projectName',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Project Name
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className='font-medium'>{row.getValue('projectName')}</div>
    )
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as Project['status'];
      return <Badge variant={getStatusBadgeVariant(status)}>{status}</Badge>;
    }
  },
  {
    accessorKey: 'budget',
    header: ({ column }) => {
      return (
        <div className='text-right'>
          <Button
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Budget
            <ArrowUpDown className='ml-2 h-4 w-4' />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('budget'));
      return (
        <div className='text-right font-mono'>{formatCurrency(amount)}</div>
      );
    }
  },
  {
    accessorKey: 'endDate',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          End Date
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue('endDate'));
      return <div>{date.toLocaleDateString()}</div>;
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const project = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(project.projectName)}
            >
              View Files
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Upload Files</DropdownMenuItem>
            <DropdownMenuItem>Download Files</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
  }
];
