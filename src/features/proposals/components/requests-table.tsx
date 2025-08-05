'use client';

import * as React from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table';
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
  businessProfiles: { id: string; size?: string }[];
}

export function RequestsTable({
  requests,
  onRequestSelect,
  onViewProposals,
  businessProfiles
}: RequestsTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

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
        <div
          className='max-w-xs truncate font-medium'
          title={row.getValue('title')}
        >
          {row.getValue('title')}
        </div>
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
      accessorKey: 'budget',
      header: ({ column }) => {
        return (
          <div className='text-right'>
            <Button
              variant='ghost'
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
            >
              Budget
              <ArrowUpDown className='ml-2 h-4 w-4' />
            </Button>
          </div>
        );
      },
      cell: ({ row }) => {
        const budget = row.getValue('budget');
        let display = 'Not specified';
        if (typeof budget === 'string' && budget.trim() !== '') {
          const num = parseFloat(budget);
          if (!isNaN(num)) display = formatCurrency(num);
        } else if (typeof budget === 'number') {
          display = formatCurrency(budget);
        }
        return <div className='text-right font-mono'>{display}</div>;
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
            className={
              urgency === 'Urgent'
                ? 'bg-red-600 text-white'
                : 'bg-muted text-muted-foreground'
            }
          >
            {urgency}
          </Badge>
        );
      }
    },
    {
      accessorKey: 'deadline',
      header: 'Duration',
      cell: ({ row }) => {
        const deadlineRaw =
          row.getValue('deadline') || row.getValue('deliveryDeadline');
        const deadline =
          typeof deadlineRaw === 'string' ? deadlineRaw : undefined;
        const daysRemaining = deadline ? getDaysRemaining(deadline) : undefined;
        return (
          <div className='flex flex-col'>
            <span>{deadline ? formatDate(deadline) : '-'}</span>
            <span
              className={`text-xs ${daysRemaining !== undefined && daysRemaining < 7 ? 'text-red-600' : 'text-muted-foreground'}`}
            >
              {daysRemaining !== undefined && daysRemaining > 0
                ? `${daysRemaining} days left`
                : daysRemaining !== undefined
                  ? 'Overdue'
                  : ''}
            </span>
          </div>
        );
      }
    },
    // {
    //   accessorKey: 'notes',
    //   header: 'Notes',
    //   cell: ({ row }) => {
    //     const notes = row.getValue('notes');
    //     const safeNotes = typeof notes === 'string' ? notes : '';
    //     return (
    //       <div className='max-w-xs truncate' title={safeNotes}>
    //         {safeNotes || '-'}
    //       </div>
    //     );
    //   }
    // },
    // Add Type column
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => {
        const type = row.getValue('type');
        return (
          <Badge variant='outline'>
            {typeof type === 'string' ? type : '-'}
          </Badge>
        );
      }
    },
    // Add Is Active column
    {
      accessorKey: 'isActive',
      header: 'Active',
      cell: ({ row }) => {
        const isActive = row.getValue('isActive');
        return (
          <Badge variant={isActive ? 'default' : 'secondary'}>
            {isActive ? 'Yes' : 'No'}
          </Badge>
        );
      }
    },
    {
      id: 'actions',
      header: 'Action',
      cell: ({ row }) => {
        const request = row.original;
        return (
          <Button
          className='cursor-pointer'
            size='sm'
            variant='ghost'
            onClick={() => onViewProposals(request)}
          >
            {/* <Eye className='h-5 w-5' /> */}
            View
          </Button>
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
    },
    meta: { businessProfiles }
  });

  return (
    <div>
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
