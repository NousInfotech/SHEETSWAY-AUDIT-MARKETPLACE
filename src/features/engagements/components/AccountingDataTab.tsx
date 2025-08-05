import React, { useState, useEffect } from 'react';
import { AccountingData } from '../types/engagement-types';
import { arrayToCSV, csvToArray, downloadCSV } from '../utils/csv-utils';
import { TrendingUp, BarChart3, Download, Upload, Search } from 'lucide-react';
import ApideckIntegrationList, {
  ApideckIntegration
} from '@/features/business-profiles/components/apideck-integration-list';
import PlaidIntegrationList, {
  PlaidIntegration
} from '@/features/business-profiles/components/plaid-integration-list';
import { getAccountingIntegrations } from '@/api/user.api';
import { getPlaidBankAccounts } from '@/api/user.api';
import { useAuth } from '@/components/layout/providers';
import { Spinner } from '@/components/ui/spinner';
import { formatCurrency } from '@/utils/formatCurrency';

interface AccountingDataTabProps {
  data: AccountingData[];
}

const AccountingDataTab: React.FC<AccountingDataTabProps> = ({ data }) => {
  const { appUser } = useAuth();
  const [apideckIntegrations, setApideckIntegrations] = useState<
    ApideckIntegration[]
  >([]);
  const [plaidIntegrations, setPlaidIntegrations] = useState<
    PlaidIntegration[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadIntegrations() {
      setLoading(true);
      setError(null);
      try {
        if (!appUser) return;
        const [apideck, plaid] = await Promise.all([
          getAccountingIntegrations({ userId: appUser.id }),
          getPlaidBankAccounts({ userId: appUser.id })
        ]);
        setApideckIntegrations(apideck);
        setPlaidIntegrations(plaid);
      } catch (err) {
        setError('Failed to load integrations');
      } finally {
        setLoading(false);
      }
    }
    loadIntegrations();
  }, [appUser]);

  function handleDeleteApideck(id: string) {
    setApideckIntegrations((prev) => prev.filter((i) => i.id !== id));
    // TODO: Call backend to revoke integration
  }
  function handleDeletePlaid(id: string) {
    setPlaidIntegrations((prev) => prev.filter((i) => i.id !== id));
    // TODO: Call backend to revoke integration
  }
  const [activeTab, setActiveTab] = useState<
    'generalLedger' | 'trialBalance' | 'journalEntries'
  >('generalLedger');
  const [filteredData, setFilteredData] = useState(data);
  // Sync filteredData with data prop
  useEffect(() => {
    setFilteredData(data);
  }, [data]);
  const [filters, setFilters] = useState({
    search: '',
    dateFrom: '',
    dateTo: '',
    type: '',
    category: ''
  });

  useEffect(() => {
    let filtered = data;
    if (filters.search) {
      filtered = filtered.filter(
        (item) =>
          item.account.toLowerCase().includes(filters.search.toLowerCase()) ||
          item.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    if (filters.dateFrom) {
      filtered = filtered.filter(
        (item) => new Date(item.date) >= new Date(filters.dateFrom)
      );
    }
    if (filters.dateTo) {
      filtered = filtered.filter(
        (item) => new Date(item.date) <= new Date(filters.dateTo)
      );
    }
    if (filters.type) {
      filtered = filtered.filter((item) => item.type === filters.type);
    }
    if (filters.category) {
      filtered = filtered.filter((item) => item.category === filters.category);
    }
    setFilteredData(filtered);
  }, [data, filters]);

  const totalDebit = filteredData.reduce((sum, item) => sum + item.debit, 0);
  const totalCredit = filteredData.reduce((sum, item) => sum + item.credit, 0);
  const trialBalance = Object.entries(
    filteredData.reduce(
      (acc, item) => {
        acc[item.type] = (acc[item.type] || 0) + (item.debit - item.credit);
        return acc;
      },
      {} as Record<string, number>
    )
  );

  const StatCard = ({
    title,
    value,
    icon: Icon,
    color
  }: {
    title: string;
    value: string;
    icon: any;
    color: string;
  }) => (
    <div className='bg-card dark:bg-card border-border rounded-lg border p-6 transition-colors'>
      <div className='flex items-center justify-between'>
        <div>
          <p className='text-sm text-gray-600 dark:text-gray-300'>{title}</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
        </div>
        <Icon className={`h-8 w-8 ${color}`} />
      </div>
    </div>
  );

  return (
    <div className='space-y-6'>
      {/* Connected Integrations Section */}
      <div>
        <h2 className='text-foreground mb-4 text-xl font-semibold'>
          Connected Integrations
        </h2>
        {loading ? (
          <div className='flex flex-col items-center justify-center py-6'>
            <Spinner size={32} className='text-primary' />
          </div>
        ) : error ? (
          <div className='text-red-500'>{error}</div>
        ) : (
          <>
            <ApideckIntegrationList
              integrations={apideckIntegrations}
              onDelete={handleDeleteApideck}
            />
            <PlaidIntegrationList
              integrations={plaidIntegrations}
              onDelete={handleDeletePlaid}
            />
          </>
        )}
      </div>
      <div className='flex items-center justify-between'>
        <h2 className='text-foreground text-xl font-semibold'>
          Accounting Data (Apideck)
        </h2>
        <div className='flex items-center gap-2'>
          <button
            className='inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700'
            onClick={() =>
              downloadCSV('accounting-data.csv', arrayToCSV(filteredData))
            }
          >
            <Download className='h-4 w-4' />
            Export Data
          </button>
          <label className='inline-flex cursor-pointer items-center gap-2 rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'>
            <Upload className='h-4 w-4' />
            Import Data
            <input
              type='file'
              accept='.csv'
              className='hidden'
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const text = await file.text();
                const imported = csvToArray<AccountingData>(text);
                setFilteredData(imported);
                localStorage.setItem(
                  'accountingData',
                  JSON.stringify(imported)
                );
                window.location.reload();
              }}
            />
          </label>
        </div>
      </div>
      {/* Tab Navigation */}
      <div className='border-border mb-4 flex gap-4 border-b'>
        <button
          className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'generalLedger' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
          onClick={() => setActiveTab('generalLedger')}
        >
          General Ledger
        </button>
        <button
          className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'trialBalance' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
          onClick={() => setActiveTab('trialBalance')}
        >
          Trial Balance
        </button>
        <button
          className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'journalEntries' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
          onClick={() => setActiveTab('journalEntries')}
        >
          Journal Entries
        </button>
      </div>
      {/* Summary Cards */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
        <StatCard
          title='Total Debits'
          value={formatCurrency(totalDebit)}
          icon={TrendingUp}
          color='text-green-600 dark:text-green-400'
        />
        <StatCard
          title='Total Credits'
          value={formatCurrency(totalCredit)}
          icon={TrendingUp}
          color='text-blue-600 dark:text-blue-400'
        />
        <StatCard
          title='Net Balance'
          value={formatCurrency(totalDebit - totalCredit)}
          icon={BarChart3}
          color='text-purple-600 dark:text-purple-400'
        />
      </div>
      {/* Filters */}
      <div className='bg-card dark:bg-card border-border rounded-lg border p-6 transition-colors'>
        <div className='flex flex-wrap items-center gap-4'>
          <div className='relative'>
            <Search className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400' />
            <input
              type='text'
              placeholder='Search accounts...'
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value }))
              }
              className='border-border bg-background text-foreground placeholder-muted-foreground rounded-lg border py-2 pr-4 pl-10 focus:border-transparent focus:ring-2 focus:ring-blue-500'
            />
          </div>
          <input
            type='date'
            value={filters.dateFrom}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, dateFrom: e.target.value }))
            }
            className='border-border bg-background text-foreground rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500'
          />
          <input
            type='date'
            value={filters.dateTo}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, dateTo: e.target.value }))
            }
            className='border-border bg-background text-foreground rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500'
          />
          <select
            value={filters.type}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, type: e.target.value }))
            }
            className='border-border bg-background text-foreground rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500'
          >
            <option value=''>All Types</option>
            <option value='Asset'>Asset</option>
            <option value='Liability'>Liability</option>
            <option value='Equity'>Equity</option>
            <option value='Revenue'>Revenue</option>
            <option value='Expense'>Expense</option>
          </select>
        </div>
      </div>
      {/* Tab Content */}
      {activeTab === 'generalLedger' && (
        <div className='bg-card dark:bg-card border-border overflow-hidden rounded-lg border transition-colors'>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-gray-50 dark:bg-gray-700'>
                <tr>
                  <th className='text-muted-foreground bg-background border-border border-b px-6 py-3 text-left text-xs font-medium tracking-wider uppercase'>
                    Date
                  </th>
                  <th className='text-muted-foreground bg-background border-border border-b px-6 py-3 text-left text-xs font-medium tracking-wider uppercase'>
                    Account
                  </th>
                  <th className='text-muted-foreground bg-background border-border border-b px-6 py-3 text-left text-xs font-medium tracking-wider uppercase'>
                    Description
                  </th>
                  <th className='text-muted-foreground bg-background border-border border-b px-6 py-3 text-left text-xs font-medium tracking-wider uppercase'>
                    Type
                  </th>
                  <th className='text-muted-foreground bg-background border-border border-b px-6 py-3 text-right text-xs font-medium tracking-wider uppercase'>
                    Debit
                  </th>
                  <th className='text-muted-foreground bg-background border-border border-b px-6 py-3 text-right text-xs font-medium tracking-wider uppercase'>
                    Credit
                  </th>
                  <th className='text-muted-foreground bg-background border-border border-b px-6 py-3 text-right text-xs font-medium tracking-wider uppercase'>
                    Balance
                  </th>
                </tr>
              </thead>
              <tbody className='bg-card dark:bg-card divide-border divide-y'>
                {filteredData.map((item) => (
                  <tr
                    key={item.id}
                    className='hover:bg-muted dark:hover:bg-card/80'
                  >
                    <td className='text-foreground bg-card dark:bg-card border-border border-b px-6 py-4 text-sm whitespace-nowrap'>
                      {new Date(item.date).toLocaleDateString()}
                    </td>
                    <td className='text-foreground bg-card dark:bg-card border-border border-b px-6 py-4 text-sm whitespace-nowrap'>
                      {item.account}
                    </td>
                    <td className='text-foreground bg-card dark:bg-card border-border border-b px-6 py-4 text-sm'>
                      {item.description}
                    </td>
                    <td className='px-6 py-4 text-sm whitespace-nowrap'>
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                          item.type === 'Asset'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                            : item.type === 'Liability'
                              ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                              : item.type === 'Equity'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                                : item.type === 'Revenue'
                                  ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
                                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                        }`}
                      >
                        {item.type}
                      </span>
                    </td>
                    <td className='text-foreground bg-card dark:bg-card border-border border-b px-6 py-4 text-right text-sm whitespace-nowrap'>
                      {formatCurrency(item.debit)}
                    </td>
                    <td className='text-foreground bg-card dark:bg-card border-border border-b px-6 py-4 text-right text-sm whitespace-nowrap'>
                      {formatCurrency(item.credit)}
                    </td>
                    <td className='text-foreground bg-card dark:bg-card border-border border-b px-6 py-4 text-right text-sm whitespace-nowrap'>
                      {formatCurrency(item.balance)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {activeTab === 'trialBalance' && (
        <div className='bg-card dark:bg-card border-border overflow-hidden rounded-lg border p-6 transition-colors'>
          <h3 className='mb-4 text-lg font-semibold'>Trial Balance</h3>
          <table className='w-full'>
            <thead className='bg-gray-50 dark:bg-gray-700'>
              <tr>
                <th className='text-muted-foreground bg-background border-border border-b px-6 py-3 text-left text-xs font-medium tracking-wider uppercase'>
                  Account Type
                </th>
                <th className='text-muted-foreground bg-background border-border border-b px-6 py-3 text-right text-xs font-medium tracking-wider uppercase'>
                  Balance
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800'>
              {trialBalance.map(([type, balance]) => (
                <tr key={type} className='hover:bg-muted dark:hover:bg-card/80'>
                  <td className='text-foreground bg-background border-border border-b px-6 py-4 text-sm'>
                    {type}
                  </td>
                  <td className='text-foreground bg-background border-border border-b px-6 py-4 text-right text-sm'>
                    {formatCurrency(balance)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {activeTab === 'journalEntries' && (
        <div className='bg-card dark:bg-card border-border overflow-hidden rounded-lg border p-6 transition-colors'>
          <h3 className='mb-4 text-lg font-semibold'>Journal Entries</h3>
          <table className='w-full'>
            <thead className='bg-gray-50 dark:bg-gray-700'>
              <tr>
                <th className='text-muted-foreground bg-background border-border border-b px-6 py-3 text-left text-xs font-medium tracking-wider uppercase'>
                  Date
                </th>
                <th className='text-muted-foreground bg-background border-border border-b px-6 py-3 text-left text-xs font-medium tracking-wider uppercase'>
                  Account
                </th>
                <th className='text-muted-foreground bg-background border-border border-b px-6 py-3 text-left text-xs font-medium tracking-wider uppercase'>
                  Description
                </th>
                <th className='text-muted-foreground bg-background border-border border-b px-6 py-3 text-right text-xs font-medium tracking-wider uppercase'>
                  Debit
                </th>
                <th className='text-muted-foreground bg-background border-border border-b px-6 py-3 text-right text-xs font-medium tracking-wider uppercase'>
                  Credit
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800'>
              {filteredData.map((item) => (
                <tr
                  key={item.id}
                  className='hover:bg-muted dark:hover:bg-card/80'
                >
                  <td className='text-foreground bg-card dark:bg-card border-border border-b px-6 py-4 text-sm whitespace-nowrap'>
                    {new Date(item.date).toLocaleDateString()}
                  </td>
                  <td className='text-foreground bg-card dark:bg-card border-border border-b px-6 py-4 text-sm whitespace-nowrap'>
                    {item.account}
                  </td>
                  <td className='text-foreground bg-card dark:bg-card border-border border-b px-6 py-4 text-sm'>
                    {item.description}
                  </td>
                  <td className='text-foreground bg-card dark:bg-card border-border border-b px-6 py-4 text-right text-sm whitespace-nowrap'>
                    {formatCurrency(item.debit)}
                  </td>
                  <td className='text-foreground bg-card dark:bg-card border-border border-b px-6 py-4 text-right text-sm whitespace-nowrap'>
                    {formatCurrency(item.credit)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AccountingDataTab;
