'use client';

import * as React from 'react';
import { ColumnDef, ColumnFiltersState, SortingState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal, Eye, FileText } from 'lucide-react';

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Request } from '../types';
import { 
  formatCurrency, 
  formatDate, 
  getRequestStatusBadgeVariant, 
  getDaysRemaining,
  getUrgencyColor 
} from '../utils';

interface RequestsTableProps {
  requests: Request[];
  onRequestSelect: (request: Request) => void;
  onViewProposals: (request: Request) => void;
}



export function RequestsTable({ requests, onRequestSelect, onViewProposals }: RequestsTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

  const columns: ColumnDef<Request>[] = [
    {
      accessorKey: 'title',
      header: ({ column }) => {
        return (
          <Button
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Request Title
            <ArrowUpDown className='ml-2 h-4 w-4' />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className='font-medium max-w-xs truncate' title={row.getValue('title')}>
          {row.getValue('title')}
        </div>
      )
    },
    {
      accessorKey: 'clientName',
      header: 'Client',
      cell: ({ row }) => (
        <div className='font-medium'>{row.getValue('clientName')}</div>
      )
    },
    {
      accessorKey: 'framework',
      header: 'Framework',
      cell: ({ row }) => (
        <Badge variant='outline'>{row.getValue('framework')}</Badge>
      )
    },
    {
      accessorKey: 'businessSize',
      header: 'Size',
      cell: ({ row }) => (
        <Badge variant='secondary'>{row.getValue('businessSize')}</Badge>
      )
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
        const budget = row.getValue('budget') as string;
        return (
          <div className='text-right font-mono'>
            {budget ? formatCurrency(parseInt(budget)) : 'Not specified'}
          </div>
        );
      }
    },
    {
      accessorKey: 'urgency',
      header: 'Urgency',
      cell: ({ row }) => {
        const urgency = row.getValue('urgency') as 'Normal' | 'Urgent';
        return (
          <Badge 
  variant={urgency === 'Urgent' ? 'destructive' : 'outline'}
  className={urgency === 'Urgent' ? 'bg-red-600 text-white' : 'bg-muted text-muted-foreground'}
>
  {urgency}
</Badge>
        );
      }
    },
    {
      accessorKey: 'deliveryDeadline',
      header: ({ column }) => {
        return (
          <Button
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Deadline
            <ArrowUpDown className='ml-2 h-4 w-4' />
          </Button>
        );
      },
      cell: ({ row }) => {
        const deadline = row.getValue('deliveryDeadline') as string;
        const daysRemaining = getDaysRemaining(deadline);
        return (
          <div className='flex flex-col'>
            <span>{formatDate(deadline)}</span>
            <span className={`text-xs ${daysRemaining < 7 ? 'text-red-600' : 'text-muted-foreground'}`}>
              {daysRemaining > 0 ? `${daysRemaining} days left` : 'Overdue'}
            </span>
          </div>
        );
      }
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as Request['status'];
        return <Badge variant={getRequestStatusBadgeVariant(status)}>{status}</Badge>;
      }
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const request = row.original;

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
              <DropdownMenuItem onClick={() => onViewProposals(request)}>
                <FileText className='mr-2 h-4 w-4' />
                View Proposals
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onRequestSelect(request)}>
                <Eye className='mr-2 h-4 w-4' />
                View Details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Edit Request</DropdownMenuItem>
              <DropdownMenuItem>Download Files</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      }
    }
  ];

  const table = useReactTable({
    data: requests,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters
    }
  });

  return (
    <div className='w-full'>
      <div className='flex items-center py-4'>
        <Input
          placeholder='Filter requests...'
          value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('title')?.setFilterValue(event.target.value)
          }
          className='max-w-sm'
        />
      </div>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className='flex items-center justify-end space-x-2 py-4'>
        <Button
          variant='outline'
          size='sm'
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant='outline'
          size='sm'
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
} 