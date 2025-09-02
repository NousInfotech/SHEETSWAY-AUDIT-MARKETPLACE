// // src\features\engagements\components\ApideckDataDisplay.tsx

// import React, { useState, useEffect } from "react";
// import { ConnectionDetailTable } from "./ConnectionDetailTable";
// import {
//   getJournalEntries,
//   getLedgerAccountsData,
//   getProfitAndLoss,
//   getBalanceSheet,
//   getAgedReceivables,
//   getAgedPayables,
//   getCustomers,
//   getSuppliers,
//   getBillPayments,
//   getBills,
//   getExpenses,
//   getPayments,
//   getBankFeed,
//   getBankStatements,
// } from "@/api/apideck.api"; // Adjust this path if necessary

// interface ApideckDataDisplayProps {
//   connectionId: string | null;
// }

// interface ApiDataState {
//   data: any[] | null;
//   isLoading: boolean;
//   error: string | null;
// }

// // Define the structure for an API call configuration
// interface ApiCallConfig {
//   apiCall: (id: string) => Promise<any>;
//   setter: React.Dispatch<React.SetStateAction<ApiDataState>>;
//   title: string;
//   // dataKey is no longer needed here as API functions will return direct data
// }

// export function ApideckDataDisplay({ connectionId }: ApideckDataDisplayProps) {
//   // Initialize all possible states
//   const [journalEntries, setJournalEntries] = useState<ApiDataState>({ data: null, isLoading: false, error: null });
//   const [ledgerAccounts, setLedgerAccounts] = useState<ApiDataState>({ data: null, isLoading: false, error: null });
//   const [profitAndLoss, setProfitAndLoss] = useState<ApiDataState>({ data: null, isLoading: false, error: null });
//   const [balanceSheet, setBalanceSheet] = useState<ApiDataState>({ data: null, isLoading: false, error: null });
//   const [agedReceivables, setAgedReceivables] = useState<ApiDataState>({ data: null, isLoading: false, error: null });
//   const [agedPayables, setAgedPayables] = useState<ApiDataState>({ data: null, isLoading: false, error: null });
//   const [customers, setCustomers] = useState<ApiDataState>({ data: null, isLoading: false, error: null });
//   const [suppliers, setSuppliers] = useState<ApiDataState>({ data: null, isLoading: false, error: null });
//   const [billPayments, setBillPayments] = useState<ApiDataState>({ data: null, isLoading: false, error: null });
//   const [bills, setBills] = useState<ApiDataState>({ data: null, isLoading: false, error: null });
//   const [expenses, setExpenses] = useState<ApiDataState>({ data: null, isLoading: false, error: null });
//   const [payments, setPayments] = useState<ApiDataState>({ data: null, isLoading: false, error: null });
//   const [bankFeed, setBankFeed] = useState<ApiDataState>({ data: null, isLoading: false, error: null });
//   const [bankStatements, setBankStatements] = useState<ApiDataState>({ data: null, isLoading: false, error: null });

//   // Mapping of service names (connectionId) to their available API calls
//   const serviceApiMap: { [key: string]: ApiCallConfig[] } = {
//     "acumatica": [
//       { apiCall: getCustomers, setter: setCustomers, title: "Customers" },
//       { apiCall: getSuppliers, setter: setSuppliers, title: "Suppliers" },
//       { apiCall: getJournalEntries, setter: setJournalEntries, title: "Journal Entries" },
//       { apiCall: getLedgerAccountsData, setter: setLedgerAccounts, title: "Ledger Accounts" },
//       { apiCall: getBills, setter: setBills, title: "Bills" },
//       { apiCall: getPayments, setter: setPayments, title: "Payments" },
//     ],
//     "banqup": [
//       { apiCall: getCustomers, setter: setCustomers, title: "Customers" },
//       { apiCall: getPayments, setter: setPayments, title: "Payments" },
//     ],
//     "clear-books": [
//       { apiCall: getCustomers, setter: setCustomers, title: "Customers" },
//       { apiCall: getLedgerAccountsData, setter: setLedgerAccounts, title: "Ledger Accounts" },
//       { apiCall: getBills, setter: setBills, title: "Bills" },
//     ],
//     "dualentry": [
//       { apiCall: getJournalEntries, setter: setJournalEntries, title: "Journal Entries" },
//       { apiCall: getLedgerAccountsData, setter: setLedgerAccounts, title: "Ledger Accounts" },
//     ],
//     "exact-online": [ // Assuming "Exact Online" from the PDF corresponds to this connectionId
//       { apiCall: getCustomers, setter: setCustomers, title: "Customers" },
//       { apiCall: getJournalEntries, setter: setJournalEntries, title: "Journal Entries" },
//       { apiCall: getLedgerAccountsData, setter: setLedgerAccounts, title: "Ledger Accounts" },
//       { apiCall: getBills, setter: setBills, title: "Bills" },
//       { apiCall: getBalanceSheet, setter: setBalanceSheet, title: "Balance Sheet" },
//       { apiCall: getProfitAndLoss, setter: setProfitAndLoss, title: "Profit and Loss" },
//       { apiCall: getPayments, setter: setPayments, title: "Payments" },
//     ],
//     "exact-online-nl": [ // Assuming "Exact Online NL" from the PDF
//       { apiCall: getCustomers, setter: setCustomers, title: "Customers" },
//       { apiCall: getJournalEntries, setter: setJournalEntries, title: "Journal Entries" },
//       { apiCall: getLedgerAccountsData, setter: setLedgerAccounts, title: "Ledger Accounts" },
//       { apiCall: getBills, setter: setBills, title: "Bills" },
//       { apiCall: getBalanceSheet, setter: setBalanceSheet, title: "Balance Sheet" },
//       { apiCall: getPayments, setter: setPayments, title: "Payments" },
//     ],
//     "exact-online-uk": [ // Assuming "Exact Online UK" from the PDF
//       { apiCall: getCustomers, setter: setCustomers, title: "Customers" },
//       { apiCall: getJournalEntries, setter: setJournalEntries, title: "Journal Entries" },
//       { apiCall: getLedgerAccountsData, setter: setLedgerAccounts, title: "Ledger Accounts" },
//       { apiCall: getBills, setter: setBills, title: "Bills" },
//       { apiCall: getBalanceSheet, setter: setBalanceSheet, title: "Balance Sheet" },
//       { apiCall: getProfitAndLoss, setter: setProfitAndLoss, title: "Profit and Loss" },
//       { apiCall: getPayments, setter: setPayments, title: "Payments" },
//     ],
//     "freeagent": [
//       { apiCall: getCustomers, setter: setCustomers, title: "Customers" },
//       { apiCall: getJournalEntries, setter: setJournalEntries, title: "Journal Entries" },
//       { apiCall: getLedgerAccountsData, setter: setLedgerAccounts, title: "Ledger Accounts" },
//       { apiCall: getBills, setter: setBills, title: "Bills" },
//       { apiCall: getBalanceSheet, setter: setBalanceSheet, title: "Balance Sheet" },
//       { apiCall: getProfitAndLoss, setter: setProfitAndLoss, title: "Profit and Loss" },
//     ],
//     "freshbooks": [
//       { apiCall: getCustomers, setter: setCustomers, title: "Customers" },
//       { apiCall: getSuppliers, setter: setSuppliers, title: "Suppliers" },
//       { apiCall: getJournalEntries, setter: setJournalEntries, title: "Journal Entries" },
//       { apiCall: getLedgerAccountsData, setter: setLedgerAccounts, title: "Ledger Accounts" },
//       { apiCall: getBalanceSheet, setter: setBalanceSheet, title: "Balance Sheet" },
//       { apiCall: getBillPayments, setter: setBillPayments, title: "Bill Payments" },
//       { apiCall: getBills, setter: setBills, title: "Bills" },
//       { apiCall: getProfitAndLoss, setter: setProfitAndLoss, title: "Profit and Loss" },
//       { apiCall: getPayments, setter: setPayments, title: "Payments" },
//     ],
//     "kashflow": [
//       { apiCall: getCustomers, setter: setCustomers, title: "Customers" },
//       { apiCall: getJournalEntries, setter: setJournalEntries, title: "Journal Entries" },
//       { apiCall: getLedgerAccountsData, setter: setLedgerAccounts, title: "Ledger Accounts" },
//       { apiCall: getPayments, setter: setPayments, title: "Payments" },
//     ],
//     "microsoft-dynamics-365-business-central": [
//       { apiCall: getCustomers, setter: setCustomers, title: "Customers" },
//       { apiCall: getSuppliers, setter: setSuppliers, title: "Suppliers" },
//       { apiCall: getJournalEntries, setter: setJournalEntries, title: "Journal Entries" },
//       { apiCall: getLedgerAccountsData, setter: setLedgerAccounts, title: "Ledger Accounts" },
//       { apiCall: getBills, setter: setBills, title: "Bills" },
//       { apiCall: getExpenses, setter: setExpenses, title: "Expenses" },
//       { apiCall: getPayments, setter: setPayments, title: "Payments" },
//     ],
//     "mri-software": [
//       { apiCall: getCustomers, setter: setCustomers, title: "Customers" },
//       { apiCall: getJournalEntries, setter: setJournalEntries, title: "Journal Entries" },
//       { apiCall: getLedgerAccountsData, setter: setLedgerAccounts, title: "Ledger Accounts" },
//       { apiCall: getBills, setter: setBills, title: "Bills" },
//     ],
//     "myob": [
//       { apiCall: getCustomers, setter: setCustomers, title: "Customers" },
//       { apiCall: getLedgerAccountsData, setter: setLedgerAccounts, title: "Ledger Accounts" },
//       { apiCall: getPayments, setter: setPayments, title: "Payments" },
//     ],
//     "myob-acumatica": [
//       { apiCall: getCustomers, setter: setCustomers, title: "Customers" },
//       { apiCall: getSuppliers, setter: setSuppliers, title: "Suppliers" },
//       { apiCall: getJournalEntries, setter: setJournalEntries, title: "Journal Entries" },
//       { apiCall: getLedgerAccountsData, setter: setLedgerAccounts, title: "Ledger Accounts" },
//       { apiCall: getBills, setter: setBills, title: "Bills" },
//       { apiCall: getPayments, setter: setPayments, title: "Payments" },
//     ],
//     "netsuite": [
//       { apiCall: getCustomers, setter: setCustomers, title: "Customers" },
//       { apiCall: getSuppliers, setter: setSuppliers, title: "Suppliers" },
//       { apiCall: getJournalEntries, setter: setJournalEntries, title: "Journal Entries" },
//       { apiCall: getLedgerAccountsData, setter: setLedgerAccounts, title: "Ledger Accounts" },
//       { apiCall: getBillPayments, setter: setBillPayments, title: "Bill Payments" },
//       { apiCall: getBills, setter: setBills, title: "Bills" },
//       { apiCall: getExpenses, setter: setExpenses, title: "Expenses" },
//       { apiCall: getPayments, setter: setPayments, title: "Payments" },
//     ],
//     "procountor": [
//       { apiCall: getCustomers, setter: setCustomers, title: "Customers" },
//       { apiCall: getJournalEntries, setter: setJournalEntries, title: "Journal Entries" },
//       { apiCall: getLedgerAccountsData, setter: setLedgerAccounts, title: "Ledger Accounts" },
//       { apiCall: getBills, setter: setBills, title: "Bills" },
//       { apiCall: getPayments, setter: setPayments, title: "Payments" },
//     ],
//     "quickbooks": [
//       { apiCall: getCustomers, setter: setCustomers, title: "Customers" },
//       { apiCall: getSuppliers, setter: setSuppliers, title: "Suppliers" },
//       { apiCall: getJournalEntries, setter: setJournalEntries, title: "Journal Entries" },
//       { apiCall: getLedgerAccountsData, setter: setLedgerAccounts, title: "Ledger Accounts" },
//       { apiCall: getBalanceSheet, setter: setBalanceSheet, title: "Balance Sheet" },
//       { apiCall: getBillPayments, setter: setBillPayments, title: "Bill Payments" },
//       { apiCall: getBills, setter: setBills, title: "Bills" },
//       { apiCall: getExpenses, setter: setExpenses, title: "Expenses" },
//       { apiCall: getPayments, setter: setPayments, title: "Payments" },
//       { apiCall: getAgedReceivables, setter: setAgedReceivables, title: "Aged Receivables" }, // Assuming "Aged Debtors & Payables" covers both
//       { apiCall: getAgedPayables, setter: setAgedPayables, title: "Aged Payables" },
//       { apiCall: getProfitAndLoss, setter: setProfitAndLoss, title: "Profit and Loss" },
//     ],
//     "sage-business-cloud-accounting": [
//       { apiCall: getCustomers, setter: setCustomers, title: "Customers" },
//       { apiCall: getJournalEntries, setter: setJournalEntries, title: "Journal Entries" },
//       { apiCall: getLedgerAccountsData, setter: setLedgerAccounts, title: "Ledger Accounts" },
//       { apiCall: getBillPayments, setter: setBillPayments, title: "Bill Payments" },
//       { apiCall: getBills, setter: setBills, title: "Bills" },
//       { apiCall: getPayments, setter: setPayments, title: "Payments" },
//     ],
//     "sage-intacct": [
//       { apiCall: getCustomers, setter: setCustomers, title: "Customers" },
//       { apiCall: getSuppliers, setter: setSuppliers, title: "Suppliers" },
//       { apiCall: getJournalEntries, setter: setJournalEntries, title: "Journal Entries" },
//       { apiCall: getLedgerAccountsData, setter: setLedgerAccounts, title: "Ledger Accounts" },
//       { apiCall: getBalanceSheet, setter: setBalanceSheet, title: "Balance Sheet" },
//       { apiCall: getBillPayments, setter: setBillPayments, title: "Bill Payments" },
//       { apiCall: getBills, setter: setBills, title: "Bills" },
//       { apiCall: getExpenses, setter: setExpenses, title: "Expenses" },
//       { apiCall: getPayments, setter: setPayments, title: "Payments" },
//       { apiCall: getProfitAndLoss, setter: setProfitAndLoss, title: "Profit and Loss" },
//     ],
//     "visma-netvisor": [
//       { apiCall: getCustomers, setter: setCustomers, title: "Customers" },
//       { apiCall: getJournalEntries, setter: setJournalEntries, title: "Journal Entries" },
//       { apiCall: getBills, setter: setBills, title: "Bills" },
//       { apiCall: getPayments, setter: setPayments, title: "Payments" },
//     ],
//     "workday": [
//       { apiCall: getBills, setter: setBills, title: "Bills" },
//     ],
//     "xero": [
//       { apiCall: getCustomers, setter: setCustomers, title: "Customers" },
//       { apiCall: getSuppliers, setter: setSuppliers, title: "Suppliers" },
//       { apiCall: getJournalEntries, setter: setJournalEntries, title: "Journal Entries" },
//       { apiCall: getLedgerAccountsData, setter: setLedgerAccounts, title: "Ledger Accounts" },
//       { apiCall: getBalanceSheet, setter: setBalanceSheet, title: "Balance Sheet" },
//       { apiCall: getBillPayments, setter: setBillPayments, title: "Bill Payments" },
//       { apiCall: getBills, setter: setBills, title: "Bills" },
//       { apiCall: getExpenses, setter: setExpenses, title: "Expenses" },
//       { apiCall: getPayments, setter: setPayments, title: "Payments" },
//       { apiCall: getAgedReceivables, setter: setAgedReceivables, title: "Aged Receivables" }, // Assuming "Aged Debtors & Payables" covers both
//       { apiCall: getAgedPayables, setter: setAgedPayables, title: "Aged Payables" },
//       { apiCall: getBankFeed, setter: setBankFeed, title: "Bank Feed" },
//       { apiCall: getBankStatements, setter: setBankStatements, title: "Bank Statements" },
//       { apiCall: getProfitAndLoss, setter: setProfitAndLoss, title: "Profit and Loss" },
//     ],
//     "zoho-books": [
//       { apiCall: getCustomers, setter: setCustomers, title: "Customers" },
//       { apiCall: getSuppliers, setter: setSuppliers, title: "Suppliers" },
//       { apiCall: getJournalEntries, setter: setJournalEntries, title: "Journal Entries" },
//       { apiCall: getLedgerAccountsData, setter: setLedgerAccounts, title: "Ledger Accounts" },
//       { apiCall: getBills, setter: setBills, title: "Bills" },
//       { apiCall: getPayments, setter: setPayments, title: "Payments" },
//     ],
//   };

//   // An array of all possible setters for resetting state
//   const allSetters = [
//     setJournalEntries, setLedgerAccounts, setProfitAndLoss, setBalanceSheet,
//     setAgedReceivables, setAgedPayables, setCustomers, setSuppliers,
//     setBillPayments, setBills, setExpenses, setPayments,
//     setBankFeed, setBankStatements
//   ];

//   useEffect(() => {
//     if (!connectionId) {
//       // Reset all data states when no connectionId is selected
//       allSetters.forEach(setter => setter({ data: null, isLoading: false, error: null }));
//       return;
//     }

//     const fetchData = async () => {
//       // Helper to fetch data for a specific API endpoint
//       const fetchApiData = async (config: ApiCallConfig) => {
//         config.setter({ data: null, isLoading: true, error: null });
//         try {
//           // The API call itself is now responsible for returning the actual data array
//           const actualData = await config.apiCall(connectionId);
          
//           config.setter({
//             data: Array.isArray(actualData) ? actualData : (actualData ? [actualData] : []),
//             isLoading: false,
//             error: null
//           });
//         } catch (err: any) {
//           console.error(`Error fetching data for ${config.title}:`, err);
//           config.setter({ data: null, isLoading: false, error: err.message || "Failed to fetch data" });
//         }
//       };

//       // Get the API calls relevant to the current connectionId
//       const apiCallsForService = serviceApiMap[connectionId];

//       if (apiCallsForService) {
//         // Invoke all relevant API calls concurrently
//         await Promise.all(apiCallsForService.map(fetchApiData));
//       } else {
//         console.warn(`No API calls defined for connectionId: ${connectionId}`);
//         allSetters.forEach(setter => setter({ data: null, isLoading: false, error: "No data available for this connection." }));
//       }
//     };

//     fetchData();
//   }, [connectionId]); // Re-run effect when connectionId changes

//   if (!connectionId) {
//     return (
//       <div className="flex justify-center items-center h-40 text-gray-600 text-lg">
//         Select a connection to view its details.
//       </div>
//     );
//   }

//   // Dynamically render ConnectionDetailTable components based on the available API calls for the service
//   const renderedTables = serviceApiMap[connectionId]?.map((config) => {
//     let stateProps: ApiDataState = { data: null, isLoading: false, error: null };
//     switch (config.title) {
//       case "Journal Entries": stateProps = journalEntries; break;
//       case "Ledger Accounts": stateProps = ledgerAccounts; break;
//       case "Profit and Loss": stateProps = profitAndLoss; break;
//       case "Balance Sheet": stateProps = balanceSheet; break;
//       case "Aged Receivables": stateProps = agedReceivables; break;
//       case "Aged Payables": stateProps = agedPayables; break;
//       case "Customers": stateProps = customers; break;
//       case "Suppliers": stateProps = suppliers; break;
//       case "Bill Payments": stateProps = billPayments; break;
//       case "Bills": stateProps = bills; break;
//       case "Expenses": stateProps = expenses; break;
//       case "Payments": stateProps = payments; break;
//       case "Bank Feed": stateProps = bankFeed; break;
//       case "Bank Statements": stateProps = bankStatements; break;
//       default: break;
//     }
//     return <ConnectionDetailTable key={config.title} title={config.title} {...stateProps} />;
//   }) || [];


//   if (renderedTables.length === 0) {
//     return (
//       <div className="flex justify-center items-center h-40 text-gray-600 text-lg">
//         No data sources configured for "{connectionId}".
//       </div>
//     );
//   }

//   return (
//     <div className="w-full grid grid-cols-1 gap-5">
//       {renderedTables}
//     </div>
//   );
// }






// ######################################################################################################




// src\features\engagements\components\ApideckDataDisplay.tsx

import React, { useState, useEffect } from "react";
import { ConnectionDetailTable } from "./ConnectionDetailTable";
import {
  getJournalEntries,
  getLedgerAccountsData,
  getProfitAndLoss,
  getBalanceSheet,
  getAgedReceivables,
  getAgedPayables,
  getCustomers,
  getSuppliers,
  getBillPayments,
  getBills,
  getExpenses,
  getPayments,
  getBankFeed,
  getBankStatements,
} from "@/api/apideck.api"; // Adjust this path if necessary

interface ApideckDataDisplayProps {
  connectionId: string | null;
}

interface ApiDataState {
  data: any[] | null;
  isLoading: boolean;
  error: string | null;
}

// Define the structure for an API call configuration
interface ApiCallConfig {
  apiCall: (id: string) => Promise<any>;
  setter: React.Dispatch<React.SetStateAction<ApiDataState>>;
  title: string;
  priority?: number; // Optional priority for ordering
}

// Helper function to safely process API response data
const processApiData = (rawData: any): any[] => {
  if (!rawData) return [];
  
  // If it's already an array, return it
  if (Array.isArray(rawData)) {
    return rawData;
  }
  
  // If it's an object, wrap it in an array
  if (typeof rawData === 'object') {
    return [rawData];
  }
  
  // For primitive values, wrap in an object and then array
  return [{ value: rawData }];
};

// Helper function to clean and flatten nested data structures
const cleanDataForTable = (data: any[]): any[] => {
  return data.map(item => {
    const cleanedItem: any = {};
    
    Object.keys(item).forEach(key => {
      const value = item[key];
      
      // Keep the original structure but ensure we handle edge cases
      if (value === null || value === undefined) {
        cleanedItem[key] = null;
      } else if (typeof value === 'string' && value.trim() === '') {
        cleanedItem[key] = null; // Convert empty strings to null for better display
      } else {
        cleanedItem[key] = value;
      }
    });
    
    return cleanedItem;
  });
};

export function ApideckDataDisplay({ connectionId }: ApideckDataDisplayProps) {
  // Initialize all possible states
  const [journalEntries, setJournalEntries] = useState<ApiDataState>({ data: null, isLoading: false, error: null });
  const [ledgerAccounts, setLedgerAccounts] = useState<ApiDataState>({ data: null, isLoading: false, error: null });
  const [profitAndLoss, setProfitAndLoss] = useState<ApiDataState>({ data: null, isLoading: false, error: null });
  const [balanceSheet, setBalanceSheet] = useState<ApiDataState>({ data: null, isLoading: false, error: null });
  const [agedReceivables, setAgedReceivables] = useState<ApiDataState>({ data: null, isLoading: false, error: null });
  const [agedPayables, setAgedPayables] = useState<ApiDataState>({ data: null, isLoading: false, error: null });
  const [customers, setCustomers] = useState<ApiDataState>({ data: null, isLoading: false, error: null });
  const [suppliers, setSuppliers] = useState<ApiDataState>({ data: null, isLoading: false, error: null });
  const [billPayments, setBillPayments] = useState<ApiDataState>({ data: null, isLoading: false, error: null });
  const [bills, setBills] = useState<ApiDataState>({ data: null, isLoading: false, error: null });
  const [expenses, setExpenses] = useState<ApiDataState>({ data: null, isLoading: false, error: null });
  const [payments, setPayments] = useState<ApiDataState>({ data: null, isLoading: false, error: null });
  const [bankFeed, setBankFeed] = useState<ApiDataState>({ data: null, isLoading: false, error: null });
  const [bankStatements, setBankStatements] = useState<ApiDataState>({ data: null, isLoading: false, error: null });

  // Mapping of service names (connectionId) to their available API calls
  const serviceApiMap: { [key: string]: ApiCallConfig[] } = {
    "acumatica": [
      { apiCall: getCustomers, setter: setCustomers, title: "Customers", priority: 1 },
      { apiCall: getSuppliers, setter: setSuppliers, title: "Suppliers", priority: 2 },
      { apiCall: getJournalEntries, setter: setJournalEntries, title: "Journal Entries", priority: 3 },
      { apiCall: getLedgerAccountsData, setter: setLedgerAccounts, title: "Ledger Accounts", priority: 4 },
      { apiCall: getBills, setter: setBills, title: "Bills", priority: 5 },
      { apiCall: getPayments, setter: setPayments, title: "Payments", priority: 6 },
    ],
    "banqup": [
      { apiCall: getCustomers, setter: setCustomers, title: "Customers", priority: 1 },
      { apiCall: getPayments, setter: setPayments, title: "Payments", priority: 2 },
    ],
    "clear-books": [
      { apiCall: getCustomers, setter: setCustomers, title: "Customers", priority: 1 },
      { apiCall: getLedgerAccountsData, setter: setLedgerAccounts, title: "Ledger Accounts", priority: 2 },
      { apiCall: getBills, setter: setBills, title: "Bills", priority: 3 },
    ],
    "dualentry": [
      { apiCall: getJournalEntries, setter: setJournalEntries, title: "Journal Entries", priority: 1 },
      { apiCall: getLedgerAccountsData, setter: setLedgerAccounts, title: "Ledger Accounts", priority: 2 },
    ],
    "exact-online": [
      { apiCall: getCustomers, setter: setCustomers, title: "Customers", priority: 1 },
      { apiCall: getJournalEntries, setter: setJournalEntries, title: "Journal Entries", priority: 2 },
      { apiCall: getLedgerAccountsData, setter: setLedgerAccounts, title: "Ledger Accounts", priority: 3 },
      { apiCall: getBills, setter: setBills, title: "Bills", priority: 4 },
      { apiCall: getBalanceSheet, setter: setBalanceSheet, title: "Balance Sheet", priority: 5 },
      { apiCall: getProfitAndLoss, setter: setProfitAndLoss, title: "Profit and Loss", priority: 6 },
      { apiCall: getPayments, setter: setPayments, title: "Payments", priority: 7 },
    ],
    "exact-online-nl": [
      { apiCall: getCustomers, setter: setCustomers, title: "Customers", priority: 1 },
      { apiCall: getJournalEntries, setter: setJournalEntries, title: "Journal Entries", priority: 2 },
      { apiCall: getLedgerAccountsData, setter: setLedgerAccounts, title: "Ledger Accounts", priority: 3 },
      { apiCall: getBills, setter: setBills, title: "Bills", priority: 4 },
      { apiCall: getBalanceSheet, setter: setBalanceSheet, title: "Balance Sheet", priority: 5 },
      { apiCall: getPayments, setter: setPayments, title: "Payments", priority: 6 },
    ],
    "exact-online-uk": [
      { apiCall: getCustomers, setter: setCustomers, title: "Customers", priority: 1 },
      { apiCall: getJournalEntries, setter: setJournalEntries, title: "Journal Entries", priority: 2 },
      { apiCall: getLedgerAccountsData, setter: setLedgerAccounts, title: "Ledger Accounts", priority: 3 },
      { apiCall: getBills, setter: setBills, title: "Bills", priority: 4 },
      { apiCall: getBalanceSheet, setter: setBalanceSheet, title: "Balance Sheet", priority: 5 },
      { apiCall: getProfitAndLoss, setter: setProfitAndLoss, title: "Profit and Loss", priority: 6 },
      { apiCall: getPayments, setter: setPayments, title: "Payments", priority: 7 },
    ],
    "freeagent": [
      { apiCall: getCustomers, setter: setCustomers, title: "Customers", priority: 1 },
      { apiCall: getJournalEntries, setter: setJournalEntries, title: "Journal Entries", priority: 2 },
      { apiCall: getLedgerAccountsData, setter: setLedgerAccounts, title: "Ledger Accounts", priority: 3 },
      { apiCall: getBills, setter: setBills, title: "Bills", priority: 4 },
      { apiCall: getBalanceSheet, setter: setBalanceSheet, title: "Balance Sheet", priority: 5 },
      { apiCall: getProfitAndLoss, setter: setProfitAndLoss, title: "Profit and Loss", priority: 6 },
    ],
    "freshbooks": [
      { apiCall: getCustomers, setter: setCustomers, title: "Customers", priority: 1 },
      { apiCall: getSuppliers, setter: setSuppliers, title: "Suppliers", priority: 2 },
      { apiCall: getJournalEntries, setter: setJournalEntries, title: "Journal Entries", priority: 3 },
      { apiCall: getLedgerAccountsData, setter: setLedgerAccounts, title: "Ledger Accounts", priority: 4 },
      { apiCall: getBalanceSheet, setter: setBalanceSheet, title: "Balance Sheet", priority: 5 },
      { apiCall: getBillPayments, setter: setBillPayments, title: "Bill Payments", priority: 6 },
      { apiCall: getBills, setter: setBills, title: "Bills", priority: 7 },
      { apiCall: getProfitAndLoss, setter: setProfitAndLoss, title: "Profit and Loss", priority: 8 },
      { apiCall: getPayments, setter: setPayments, title: "Payments", priority: 9 },
    ],
    "kashflow": [
      { apiCall: getCustomers, setter: setCustomers, title: "Customers", priority: 1 },
      { apiCall: getJournalEntries, setter: setJournalEntries, title: "Journal Entries", priority: 2 },
      { apiCall: getLedgerAccountsData, setter: setLedgerAccounts, title: "Ledger Accounts", priority: 3 },
      { apiCall: getPayments, setter: setPayments, title: "Payments", priority: 4 },
    ],
    "microsoft-dynamics-365-business-central": [
      { apiCall: getCustomers, setter: setCustomers, title: "Customers", priority: 1 },
      { apiCall: getSuppliers, setter: setSuppliers, title: "Suppliers", priority: 2 },
      { apiCall: getJournalEntries, setter: setJournalEntries, title: "Journal Entries", priority: 3 },
      { apiCall: getLedgerAccountsData, setter: setLedgerAccounts, title: "Ledger Accounts", priority: 4 },
      { apiCall: getBills, setter: setBills, title: "Bills", priority: 5 },
      { apiCall: getExpenses, setter: setExpenses, title: "Expenses", priority: 6 },
      { apiCall: getPayments, setter: setPayments, title: "Payments", priority: 7 },
    ],
    "mri-software": [
      { apiCall: getCustomers, setter: setCustomers, title: "Customers", priority: 1 },
      { apiCall: getJournalEntries, setter: setJournalEntries, title: "Journal Entries", priority: 2 },
      { apiCall: getLedgerAccountsData, setter: setLedgerAccounts, title: "Ledger Accounts", priority: 3 },
      { apiCall: getBills, setter: setBills, title: "Bills", priority: 4 },
    ],
    "myob": [
      { apiCall: getCustomers, setter: setCustomers, title: "Customers", priority: 1 },
      { apiCall: getLedgerAccountsData, setter: setLedgerAccounts, title: "Ledger Accounts", priority: 2 },
      { apiCall: getPayments, setter: setPayments, title: "Payments", priority: 3 },
    ],
    "myob-acumatica": [
      { apiCall: getCustomers, setter: setCustomers, title: "Customers", priority: 1 },
      { apiCall: getSuppliers, setter: setSuppliers, title: "Suppliers", priority: 2 },
      { apiCall: getJournalEntries, setter: setJournalEntries, title: "Journal Entries", priority: 3 },
      { apiCall: getLedgerAccountsData, setter: setLedgerAccounts, title: "Ledger Accounts", priority: 4 },
      { apiCall: getBills, setter: setBills, title: "Bills", priority: 5 },
      { apiCall: getPayments, setter: setPayments, title: "Payments", priority: 6 },
    ],
    "netsuite": [
      { apiCall: getCustomers, setter: setCustomers, title: "Customers", priority: 1 },
      { apiCall: getSuppliers, setter: setSuppliers, title: "Suppliers", priority: 2 },
      { apiCall: getJournalEntries, setter: setJournalEntries, title: "Journal Entries", priority: 3 },
      { apiCall: getLedgerAccountsData, setter: setLedgerAccounts, title: "Ledger Accounts", priority: 4 },
      { apiCall: getBillPayments, setter: setBillPayments, title: "Bill Payments", priority: 5 },
      { apiCall: getBills, setter: setBills, title: "Bills", priority: 6 },
      { apiCall: getExpenses, setter: setExpenses, title: "Expenses", priority: 7 },
      { apiCall: getPayments, setter: setPayments, title: "Payments", priority: 8 },
    ],
    "procountor": [
      { apiCall: getCustomers, setter: setCustomers, title: "Customers", priority: 1 },
      { apiCall: getJournalEntries, setter: setJournalEntries, title: "Journal Entries", priority: 2 },
      { apiCall: getLedgerAccountsData, setter: setLedgerAccounts, title: "Ledger Accounts", priority: 3 },
      { apiCall: getBills, setter: setBills, title: "Bills", priority: 4 },
      { apiCall: getPayments, setter: setPayments, title: "Payments", priority: 5 },
    ],
    "quickbooks": [
      { apiCall: getCustomers, setter: setCustomers, title: "Customers", priority: 1 },
      { apiCall: getSuppliers, setter: setSuppliers, title: "Suppliers", priority: 2 },
      { apiCall: getJournalEntries, setter: setJournalEntries, title: "Journal Entries", priority: 3 },
      { apiCall: getLedgerAccountsData, setter: setLedgerAccounts, title: "Ledger Accounts", priority: 4 },
      { apiCall: getBalanceSheet, setter: setBalanceSheet, title: "Balance Sheet", priority: 5 },
      { apiCall: getBillPayments, setter: setBillPayments, title: "Bill Payments", priority: 6 },
      { apiCall: getBills, setter: setBills, title: "Bills", priority: 7 },
      { apiCall: getExpenses, setter: setExpenses, title: "Expenses", priority: 8 },
      { apiCall: getPayments, setter: setPayments, title: "Payments", priority: 9 },
      { apiCall: getAgedReceivables, setter: setAgedReceivables, title: "Aged Receivables", priority: 10 },
      { apiCall: getAgedPayables, setter: setAgedPayables, title: "Aged Payables", priority: 11 },
      { apiCall: getProfitAndLoss, setter: setProfitAndLoss, title: "Profit and Loss", priority: 12 },
    ],
    "sage-business-cloud-accounting": [
      { apiCall: getCustomers, setter: setCustomers, title: "Customers", priority: 1 },
      { apiCall: getJournalEntries, setter: setJournalEntries, title: "Journal Entries", priority: 2 },
      { apiCall: getLedgerAccountsData, setter: setLedgerAccounts, title: "Ledger Accounts", priority: 3 },
      { apiCall: getBillPayments, setter: setBillPayments, title: "Bill Payments", priority: 4 },
      { apiCall: getBills, setter: setBills, title: "Bills", priority: 5 },
      { apiCall: getPayments, setter: setPayments, title: "Payments", priority: 6 },
    ],
    "sage-intacct": [
      { apiCall: getCustomers, setter: setCustomers, title: "Customers", priority: 1 },
      { apiCall: getSuppliers, setter: setSuppliers, title: "Suppliers", priority: 2 },
      { apiCall: getJournalEntries, setter: setJournalEntries, title: "Journal Entries", priority: 3 },
      { apiCall: getLedgerAccountsData, setter: setLedgerAccounts, title: "Ledger Accounts", priority: 4 },
      { apiCall: getBalanceSheet, setter: setBalanceSheet, title: "Balance Sheet", priority: 5 },
      { apiCall: getBillPayments, setter: setBillPayments, title: "Bill Payments", priority: 6 },
      { apiCall: getBills, setter: setBills, title: "Bills", priority: 7 },
      { apiCall: getExpenses, setter: setExpenses, title: "Expenses", priority: 8 },
      { apiCall: getPayments, setter: setPayments, title: "Payments", priority: 9 },
      { apiCall: getProfitAndLoss, setter: setProfitAndLoss, title: "Profit and Loss", priority: 10 },
    ],
    "visma-netvisor": [
      { apiCall: getCustomers, setter: setCustomers, title: "Customers", priority: 1 },
      { apiCall: getJournalEntries, setter: setJournalEntries, title: "Journal Entries", priority: 2 },
      { apiCall: getBills, setter: setBills, title: "Bills", priority: 3 },
      { apiCall: getPayments, setter: setPayments, title: "Payments", priority: 4 },
    ],
    "workday": [
      { apiCall: getBills, setter: setBills, title: "Bills", priority: 1 },
    ],
    "xero": [
      { apiCall: getCustomers, setter: setCustomers, title: "Customers", priority: 1 },
      { apiCall: getSuppliers, setter: setSuppliers, title: "Suppliers", priority: 2 },
      { apiCall: getJournalEntries, setter: setJournalEntries, title: "Journal Entries", priority: 3 },
      { apiCall: getLedgerAccountsData, setter: setLedgerAccounts, title: "Ledger Accounts", priority: 4 },
      { apiCall: getBalanceSheet, setter: setBalanceSheet, title: "Balance Sheet", priority: 5 },
      { apiCall: getBillPayments, setter: setBillPayments, title: "Bill Payments", priority: 6 },
      { apiCall: getBills, setter: setBills, title: "Bills", priority: 7 },
      { apiCall: getExpenses, setter: setExpenses, title: "Expenses", priority: 8 },
      { apiCall: getPayments, setter: setPayments, title: "Payments", priority: 9 },
      { apiCall: getAgedReceivables, setter: setAgedReceivables, title: "Aged Receivables", priority: 10 },
      { apiCall: getAgedPayables, setter: setAgedPayables, title: "Aged Payables", priority: 11 },
      { apiCall: getBankFeed, setter: setBankFeed, title: "Bank Feed", priority: 12 },
      { apiCall: getBankStatements, setter: setBankStatements, title: "Bank Statements", priority: 13 },
      { apiCall: getProfitAndLoss, setter: setProfitAndLoss, title: "Profit and Loss", priority: 14 },
    ],
    "zoho-books": [
      { apiCall: getCustomers, setter: setCustomers, title: "Customers", priority: 1 },
      { apiCall: getSuppliers, setter: setSuppliers, title: "Suppliers", priority: 2 },
      { apiCall: getJournalEntries, setter: setJournalEntries, title: "Journal Entries", priority: 3 },
      { apiCall: getLedgerAccountsData, setter: setLedgerAccounts, title: "Ledger Accounts", priority: 4 },
      { apiCall: getBills, setter: setBills, title: "Bills", priority: 5 },
      { apiCall: getPayments, setter: setPayments, title: "Payments", priority: 6 },
    ],
  };

  // An array of all possible setters for resetting state
  const allSetters = [
    setJournalEntries, setLedgerAccounts, setProfitAndLoss, setBalanceSheet,
    setAgedReceivables, setAgedPayables, setCustomers, setSuppliers,
    setBillPayments, setBills, setExpenses, setPayments,
    setBankFeed, setBankStatements
  ];

  useEffect(() => {
    if (!connectionId) {
      // Reset all data states when no connectionId is selected
      allSetters.forEach(setter => setter({ data: null, isLoading: false, error: null }));
      return;
    }

    const fetchData = async () => {
      // Helper to fetch data for a specific API endpoint
      const fetchApiData = async (config: ApiCallConfig) => {
        config.setter({ data: null, isLoading: true, error: null });
        try {
          // The API call itself is now responsible for returning the actual data array
          const rawData = await config.apiCall(connectionId);
          console.log(`Raw data for ${config.title}:`, rawData);
          
          // Process and clean the data
          const processedData = processApiData(rawData);
          const cleanedData = cleanDataForTable(processedData);
          
          config.setter({
            data: cleanedData,
            isLoading: false,
            error: null
          });
        } catch (err: any) {
          console.error(`Error fetching data for ${config.title}:`, err);
          config.setter({ 
            data: null, 
            isLoading: false, 
            error: err.message || "Failed to fetch data" 
          });
        }
      };

      // Get the API calls relevant to the current connectionId
      const apiCallsForService = serviceApiMap[connectionId];

      if (apiCallsForService) {
        // Sort by priority if available, then invoke all relevant API calls concurrently
        const sortedApiCalls = [...apiCallsForService].sort((a, b) => 
          (a.priority || 999) - (b.priority || 999)
        );
        
        // For better UX, we can stagger the API calls slightly
        sortedApiCalls.forEach((config, index) => {
          setTimeout(() => fetchApiData(config), index * 100);
        });
      } else {
        console.warn(`No API calls defined for connectionId: ${connectionId}`);
        allSetters.forEach(setter => 
          setter({ data: null, isLoading: false, error: "No data available for this connection." })
        );
      }
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

  // Dynamically render ConnectionDetailTable components based on the available API calls for the service
  const apiCallsForCurrentService = serviceApiMap[connectionId];
  
  if (!apiCallsForCurrentService) {
    return (
      <div className="flex justify-center items-center h-40 text-gray-600 text-lg">
        No data sources configured for "{connectionId}".
      </div>
    );
  }

  // Sort by priority and create the rendered tables
  const sortedConfigs = [...apiCallsForCurrentService].sort((a, b) => 
    (a.priority || 999) - (b.priority || 999)
  );

  const renderedTables = sortedConfigs.map((config) => {
    let stateProps: ApiDataState = { data: null, isLoading: false, error: null };
    
    switch (config.title) {
      case "Journal Entries": stateProps = journalEntries; break;
      case "Ledger Accounts": stateProps = ledgerAccounts; break;
      case "Profit and Loss": stateProps = profitAndLoss; break;
      case "Balance Sheet": stateProps = balanceSheet; break;
      case "Aged Receivables": stateProps = agedReceivables; break;
      case "Aged Payables": stateProps = agedPayables; break;
      case "Customers": stateProps = customers; break;
      case "Suppliers": stateProps = suppliers; break;
      case "Bill Payments": stateProps = billPayments; break;
      case "Bills": stateProps = bills; break;
      case "Expenses": stateProps = expenses; break;
      case "Payments": stateProps = payments; break;
      case "Bank Feed": stateProps = bankFeed; break;
      case "Bank Statements": stateProps = bankStatements; break;
      default: 
        console.warn(`Unknown config title: ${config.title}`);
        break;
    }
    
    return (
      <ConnectionDetailTable 
        key={config.title} 
        title={config.title} 
        {...stateProps} 
      />
    );
  });

  if (renderedTables.length === 0) {
    return (
      <div className="flex justify-center items-center h-40 text-gray-600 text-lg">
        No data tables available for "{connectionId}".
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="text-sm text-gray-500 mb-4">
        Showing {renderedTables.length} data source{renderedTables.length !== 1 ? 's' : ''} for {connectionId}
      </div>
      <div className="grid grid-cols-1 gap-6">
        {renderedTables}
      </div>
    </div>
  );
}