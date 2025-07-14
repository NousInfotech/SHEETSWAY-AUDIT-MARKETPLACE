'use client';

import * as React from 'react';
import { ColumnDef, ColumnFiltersState, SortingState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal, Eye, CheckCircle, XCircle, Info } from 'lucide-react';

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
import { Proposal } from '../types';
import { 
  formatCurrency, 
  formatDate, 
  getProposalStatusBadgeVariant,
  getRandomAnonUsername
} from '../utils';
import AuditorProfileModal from './auditor-profile-modal';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useRouter } from 'next/navigation';

interface ProposalsTableProps {
  proposals: Proposal[];
  onProposalSelect: (proposal: Proposal) => void;
  onAcceptProposal?: (proposal: Proposal) => void;
  onRejectProposal?: (proposal: Proposal) => void;
}

export function ProposalsTable({ 
  proposals, 
  onProposalSelect, 
  onAcceptProposal, 
  onRejectProposal 
}: ProposalsTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [openProfileId, setOpenProfileId] = React.useState<string | null>(null);
  const router = useRouter();

  const columns: ColumnDef<Proposal>[] = [
    {
      accessorKey: 'title',
      header: ({ column }) => {
        return (
          <Button
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Proposal Title
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
      accessorKey: 'auditorName',
      header: 'Auditor',
      cell: ({ row }) => {
        const proposal = row.original;
        const isAccepted = proposal.status === 'Accepted';
        return (
          <div className='flex items-center gap-2'>
            {isAccepted ? (
              <span>{proposal.auditorName}</span>
            ) : (
              <>
                <span>{getRandomAnonUsername(proposal.id)}</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className='h-4 w-4 text-muted-foreground cursor-pointer' />
                    </TooltipTrigger>
                    <TooltipContent>
                      Auditor name is visible once proposal is accepted
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </>
            )}
            <Button size='sm' variant='outline' onClick={() => router.push(`/dashboard/profile/${proposal.auditorId}`)}>
              View Profile
            </Button>
          </div>
        );
      }
    },
    {
      accessorKey: 'proposedBudget',
      header: ({ column }) => {
        return (
          <div className='text-right'>
            <Button
              variant='ghost'
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              Proposed Budget
              <ArrowUpDown className='ml-2 h-4 w-4' />
            </Button>
          </div>
        );
      },
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue('proposedBudget'));
        return (
          <div className='text-right font-mono'>{formatCurrency(amount)}</div>
        );
      }
    },
    {
      accessorKey: 'estimatedDuration',
      header: 'Duration',
      cell: ({ row }) => (
        <div className='font-medium'>{row.getValue('estimatedDuration')}</div>
      )
    },
    {
      accessorKey: 'startDate',
      header: 'Start Date',
      cell: ({ row }) => (
        <div>{formatDate(row.getValue('startDate'))}</div>
      )
    },
    {
      accessorKey: 'endDate',
      header: 'End Date',
      cell: ({ row }) => (
        <div>{formatDate(row.getValue('endDate'))}</div>
      )
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as Proposal['status'];
        return <Badge variant={getProposalStatusBadgeVariant(status)}>{status}</Badge>;
      }
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const proposal = row.original;
        const isPending = proposal.status === 'Pending';

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
              {isPending && onAcceptProposal && onRejectProposal && (
                <>
                  <DropdownMenuItem onClick={() => onAcceptProposal(proposal)}>
                    <CheckCircle className='mr-2 h-4 w-4' />
                    Accept Proposal
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onRejectProposal(proposal)}>
                    <XCircle className='mr-2 h-4 w-4' />
                    Reject Proposal
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem>Download Proposal</DropdownMenuItem>
              <DropdownMenuItem>Contact Auditor</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      }
    }
  ];

  const table = useReactTable({
    data: proposals,
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
          placeholder='Filter proposals...'
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