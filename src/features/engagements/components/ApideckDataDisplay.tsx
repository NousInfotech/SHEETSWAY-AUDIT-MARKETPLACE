import React, { useState, useEffect } from "react";
import { ConnectionDetailTable } from "./ConnectionDetailTable";
import {
  getJournalEntries,
  getLedgerAccountsData,
  getProfitAndLoss,
  getBalanceSheet,
  getAgedReceivables,
  getAgedPayables,
} from "@/api/apideck.api"; // Adjust this path if necessary

interface ApideckDataDisplayProps {
  connectionId: string | null;
}

interface ApiDataState {
  data: any[] | null;
  isLoading: boolean;
  error: string | null;
}

export function ApideckDataDisplay({ connectionId }: ApideckDataDisplayProps) {
  const [journalEntries, setJournalEntries] = useState<ApiDataState>({ data: null, isLoading: false, error: null });
  const [ledgerAccounts, setLedgerAccounts] = useState<ApiDataState>({ data: null, isLoading: false, error: null });
  const [profitAndLoss, setProfitAndLoss] = useState<ApiDataState>({ data: null, isLoading: false, error: null });
  const [balanceSheet, setBalanceSheet] = useState<ApiDataState>({ data: null, isLoading: false, error: null });
  const [agedReceivables, setAgedReceivables] = useState<ApiDataState>({ data: null, isLoading: false, error: null });
  const [agedPayables, setAgedPayables] = useState<ApiDataState>({ data: null, isLoading: false, error: null });

  useEffect(() => {
    if (!connectionId) {
      // Reset all data when no connectionId is selected
      setJournalEntries({ data: null, isLoading: false, error: null });
      setLedgerAccounts({ data: null, isLoading: false, error: null });
      setProfitAndLoss({ data: null, isLoading: false, error: null });
      setBalanceSheet({ data: null, isLoading: false, error: null });
      setAgedReceivables({ data: null, isLoading: false, error: null });
      setAgedPayables({ data: null, isLoading: false, error: null });
      return;
    }

    const fetchData = async () => {
      // Helper to fetch data for a specific API endpoint
      const fetchApiData = async (
        apiCall: (id: string) => Promise<any>,
        setter: React.Dispatch<React.SetStateAction<ApiDataState>>,
        dataKey: string // Key for the actual data in the API response, e.g., 'data'
      ) => {
        setter({ data: null, isLoading: true, error: null });
        try {
          const response = await apiCall(connectionId);
          // Assuming API responses might have a 'data' key or be directly an array
          const actualData = Array.isArray(response) ? response : response[dataKey] || [];
          setter({ data: actualData, isLoading: false, error: null });
        } catch (err: any) {
          console.error(`Error fetching data for ${dataKey}:`, err);
          setter({ data: null, isLoading: false, error: err.message || "Failed to fetch data" });
        }
      };

      // Invoke all API calls concurrently
      await Promise.all([
        fetchApiData(getJournalEntries, setJournalEntries, 'data'), // Adjust 'data' if response structure differs
        fetchApiData(getLedgerAccountsData, setLedgerAccounts, 'data'),
        fetchApiData(getProfitAndLoss, setProfitAndLoss, 'data'),
        fetchApiData(getBalanceSheet, setBalanceSheet, 'data'),
        fetchApiData(getAgedReceivables, setAgedReceivables, 'data'),
        fetchApiData(getAgedPayables, setAgedPayables, 'data'),
      ]);
    };

    fetchData();
  }, [connectionId]); // Re-run effect when connectionId changes

  if (!connectionId) {
    return (
      <div className="flex justify-center items-center h-40 text-gray-600 text-lg">
        Select a connection to view its details.
      </div>
    );
  }

  return (
    <div className="w-full grid grid-cols-1">
      <ConnectionDetailTable title="Journal Entries" {...journalEntries} />
      <ConnectionDetailTable title="Ledger Accounts" {...ledgerAccounts} />
      <ConnectionDetailTable title="Profit and Loss" {...profitAndLoss} />
      <ConnectionDetailTable title="Balance Sheet" {...balanceSheet} />
      <ConnectionDetailTable title="Aged Receivables" {...agedReceivables} />
      <ConnectionDetailTable title="Aged Payables" {...agedPayables} />
    </div>
  );
}





{/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 sm:p-6 lg:p-8"></div> */}