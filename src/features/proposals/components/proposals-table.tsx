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
import { ProposalDetailsModal } from './proposal-details-modal';
import { toast } from 'sonner';

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
  const [openProposal, setOpenProposal] = React.useState<Proposal | null>(null);
  const router = useRouter();
  const [tableProposals, setTableProposals] = React.useState<Proposal[]>(proposals);

  React.useEffect(() => {
    setTableProposals(proposals);
  }, [proposals]);

  const handleAccept = (updatedProposal: Proposal) => {
    setTableProposals((prev) => prev.map((p) => p.id === updatedProposal.id ? { ...p, status: 'Accepted' } : p));
    toast.success('Proposal accepted successfully!');
    if (onAcceptProposal) onAcceptProposal(updatedProposal);
  };

  const handleReject = (updatedProposal: Proposal) => {
    setTableProposals((prev) => prev.map((p) => p.id === updatedProposal.id ? { ...p, status: 'Rejected' } : p));
    toast.success('Proposal rejected successfully!');
    if (onRejectProposal) onRejectProposal(updatedProposal);
  };

  const columns: ColumnDef<Proposal>[] = [
    {
      accessorKey: 'proposalName', // was 'title'
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
        <div className='font-medium max-w-xs truncate' title={row.getValue('proposalName')}>
          {row.getValue('proposalName')}
        </div>
      )
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => (
        <div className='max-w-xs truncate' title={row.getValue('description')}>
          {row.getValue('description')}
        </div>
      )
    },
    // {
    //   accessorKey: 'auditorId',
    //   header: 'Auditor',
    //   cell: ({ row }) => {
    //     const proposal = row.original;
    //     return (
    //       <div className='flex items-center gap-2'>
    //         <span>Anonymous</span>
    //         <Button size='sm' variant='outline' onClick={() => router.push(`/dashboard/profile/${proposal.auditorId}`)}>
    //           View Profile
    //         </Button>
    //       </div>
    //     );
    //   }
    // },
    {
      accessorKey: 'quotation', // was 'proposedBudget'
      header: ({ column }) => {
        return (
          <div className='text-right'>
            <Button
              variant='ghost'
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              Quotation
              <ArrowUpDown className='ml-2 h-4 w-4' />
            </Button>
          </div>
        );
      },
      cell: ({ row }) => {
        const amount = row.getValue('quotation');
        return (
          <div className='text-right font-mono'>{formatCurrency(Number(amount))}</div>
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
        return (
          <Button size='icon' variant='ghost' onClick={() => setOpenProposal(proposal)}>
            <Eye className='h-5 w-5' />
          </Button>
        );
      }
    }
  ];

  const table = useReactTable({
    data: tableProposals,
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
          value={(table.getColumn('proposalName')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('proposalName')?.setFilterValue(event.target.value)
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
      {openProposal && (
        <ProposalDetailsModal
          proposal={openProposal}
          isOpen={!!openProposal}
          onClose={() => setOpenProposal(null)}
          onAcceptProposal={handleAccept}
          onRejectProposal={handleReject}
        />
      )}
    </div>
  );
} 