import React, { useState, useEffect } from 'react';
import { BankingData } from '../types/engagement-types';
import { arrayToCSV, csvToArray, downloadCSV } from '../utils/csv-utils';
import { Download, Upload, Search } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/utils/formatCurrency';

interface BankingDataTabProps {
  data: BankingData[];
}

const BankingDataTab: React.FC<BankingDataTabProps> = ({ data }) => {
  const [filteredData, setFilteredData] = useState(data);
  // Sync filteredData with data prop
  useEffect(() => {
    setFilteredData(data);
  }, [data]);
  const [filters, setFilters] = useState({
    search: '',
    dateFrom: '',
    dateTo: '',
    category: ''
  });
  const [selectedAccountId, setSelectedAccountId] = useState<string>('');

  useEffect(() => {
    let filtered = data;
    if (filters.search) {
      filtered = filtered.filter(item =>
        item.accountName.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    if (filters.dateFrom) {
      filtered = filtered.filter(item => new Date(item.date) >= new Date(filters.dateFrom));
    }
    if (filters.dateTo) {
      filtered = filtered.filter(item => new Date(item.date) <= new Date(filters.dateTo));
    }
    if (filters.category) {
      filtered = filtered.filter(item => item.category === filters.category);
    }
    setFilteredData(filtered);
  }, [data, filters]);

  const accounts = Array.from(
    new Map(data.map(item => [item.accountId, { accountId: item.accountId, accountName: item.accountName }])).values()
  );
  const accountBalances = accounts.map(acc => {
    const accTxs = data.filter(item => item.accountId === acc.accountId);
    const latest = accTxs.reduce((a, b) => new Date(a.date) > new Date(b.date) ? a : b, accTxs[0]);
    return { ...acc, balance: latest ? latest.balance : 0 };
  });
  const chartAccountId = selectedAccountId || (accounts[0]?.accountId || '');
  const chartData = data
    .filter(item => item.accountId === chartAccountId)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const categories = Array.from(new Set(data.map(item => item.category)));

  return (
    <div className="space-y-6">
      <div className="bg-card dark:bg-card border border-border rounded-lg p-6 transition-colors mb-4">
        <h3 className="text-lg font-semibold mb-2">Bank Accounts Linked</h3>
        <div className="flex flex-wrap gap-4">
          {accountBalances.map(acc => (
            <div key={acc.accountId} className={`p-4 rounded-lg border border-border bg-background cursor-pointer transition-colors ${chartAccountId === acc.accountId ? 'ring-2 ring-blue-500' : ''}`}
              onClick={() => setSelectedAccountId(acc.accountId)}
            >
              <div className="font-medium text-foreground">{acc.accountName}</div>
              <div className="text-sm text-muted-foreground">ID: {acc.accountId}</div>
              <div className="text-lg font-bold text-blue-600 dark:text-blue-400 mt-1">{formatCurrency(acc.balance)}</div>
            </div>
          ))}
        </div>
      </div>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Balance Chart</CardTitle>
          <CardDescription>Balance over time for the selected account</CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          {chartData.length > 1 ? (
            <ChartContainer config={{ balance: { label: 'Balance', color: 'var(--primary)' } }} className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis tickLine={false} axisLine={false} tickMargin={8} width={80} />
                  <Line type="monotone" dataKey="balance" stroke="var(--primary)" strokeWidth={2} dot={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <div className="text-muted-foreground">Not enough data for chart.</div>
          )}
        </CardContent>
      </Card>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Banking Data (Plaid)</h2>
        <div className="flex items-center gap-2">
          <button
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
            onClick={() => downloadCSV('banking-data.csv', arrayToCSV(filteredData))}
          >
            <Download className="h-4 w-4" />
            Export Data
          </button>
          <label className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg transition-colors text-sm font-medium cursor-pointer">
            <Upload className="h-4 w-4" />
            Import Data
            <input
              type="file"
              accept=".csv"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const text = await file.text();
                const imported = csvToArray<BankingData>(text);
                setFilteredData(imported);
                localStorage.setItem('bankingData', JSON.stringify(imported));
                window.location.reload();
              }}
            />
          </label>
        </div>
      </div>
      <div className="bg-card dark:bg-card border border-border rounded-lg p-6 transition-colors">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search accounts or description..."
              value={filters.search}
              onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-background text-foreground placeholder-muted-foreground"
            />
          </div>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={e => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
            className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="date"
            value={filters.dateTo}
            onChange={e => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
            className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={filters.category}
            onChange={e => setFilters(prev => ({ ...prev, category: e.target.value }))}
            className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="bg-card dark:bg-card border border-border rounded-lg overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground bg-background border-b border-border uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground bg-background border-b border-border uppercase tracking-wider">Account</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground bg-background border-b border-border uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground bg-background border-b border-border uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground bg-background border-b border-border uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground bg-background border-b border-border uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground bg-background border-b border-border uppercase tracking-wider">Balance</th>
              </tr>
            </thead>
            <tbody className="bg-card dark:bg-card divide-y divide-border">
              {filteredData.map(item => (
                <tr key={item.id} className="hover:bg-muted dark:hover:bg-card/80">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground bg-card dark:bg-card border-b border-border">
                    {new Date(item.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground bg-card dark:bg-card border-b border-border">
                    {item.accountName}
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground bg-card dark:bg-card border-b border-border">
                    {item.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-foreground bg-card dark:bg-card border-b border-border">
                    {item.type === 'debit' ? '-' : '+'}{formatCurrency(item.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      item.type === 'credit'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                    }`}>
                      {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground bg-card dark:bg-card border-b border-border">
                    {item.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-foreground bg-card dark:bg-card border-b border-border">
                    {formatCurrency(item.balance)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BankingDataTab; 