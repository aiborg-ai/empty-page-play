import { useState } from 'react';
import {
  DollarSign,
  Filter,
  Download,
  Eye,
  Users,
  ShoppingCart,
  CreditCard,
  PieChart,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Wallet,
  Target,
  FileText,
  RefreshCw
} from 'lucide-react';
import { Transaction, RevenueMetrics, PayoutRequest } from '../types/marketplace';
import PageHeader from './PageHeader';

// Mock data for revenue analytics
const mockRevenueMetrics: RevenueMetrics[] = [
  {
    period: 'month',
    startDate: '2024-07-01',
    endDate: '2024-07-31',
    totalRevenue: 485000,
    patentRevenue: 325000,
    dataRevenue: 95000,
    servicesRevenue: 65000,
    totalTransactions: 147,
    averageTransactionValue: 3299,
    growthRate: 23.5,
    previousPeriodRevenue: 393000,
    platformCommission: 48500,
    processingFees: 14550,
    netRevenue: 421950,
    activeUsers: 1247,
    newUsers: 89,
    returningUsers: 1158
  },
  {
    period: 'month',
    startDate: '2024-06-01',
    endDate: '2024-06-30',
    totalRevenue: 393000,
    patentRevenue: 245000,
    dataRevenue: 89000,
    servicesRevenue: 59000,
    totalTransactions: 125,
    averageTransactionValue: 3144,
    growthRate: 15.2,
    previousPeriodRevenue: 341000,
    platformCommission: 39300,
    processingFees: 11790,
    netRevenue: 341910,
    activeUsers: 1158,
    newUsers: 76,
    returningUsers: 1082
  }
];

const mockTransactions: Transaction[] = [
  {
    id: 'txn-001',
    type: 'patent_sale',
    amount: 2500000,
    currency: 'USD',
    payer: {
      id: 'u-101',
      name: 'TechGiant Corp',
      email: 'licensing@techgiant.com',
      avatar: '/api/placeholder/40/40',
      type: 'company',
      verified: true,
      joinDate: '2023-03-15',
      location: 'San Francisco, CA'
    },
    payee: {
      id: 'u-001',
      name: 'TechInnovate Corp',
      email: 'licensing@techinnovate.com',
      avatar: '/api/placeholder/40/40',
      type: 'company',
      verified: true,
      joinDate: '2019-01-15',
      location: 'Silicon Valley, CA'
    },
    description: 'Purchase of AI Patent US10,123,456',
    status: 'completed',
    date: '2024-08-10T14:30:00Z',
    patentId: 'pt-001',
    paymentMethod: 'Wire Transfer',
    processingFee: 2500,
    platformFee: 250000,
    netAmount: 2247500,
    taxAmount: 125000,
    taxRegion: 'California',
    invoiceNumber: 'INV-2024-001',
    externalTransactionId: 'wire-789456123',
    receiptUrl: '/receipts/txn-001'
  },
  {
    id: 'txn-002',
    type: 'data_purchase',
    amount: 999,
    currency: 'USD',
    payer: {
      id: 'u-102',
      name: 'Research Labs Inc',
      email: 'data@researchlabs.com',
      avatar: '/api/placeholder/40/40',
      type: 'company',
      verified: true,
      joinDate: '2022-08-20',
      location: 'Boston, MA'
    },
    payee: {
      id: 'u-003',
      name: 'PatentScope Analytics',
      email: 'data@patentscope.com',
      avatar: '/api/placeholder/40/40',
      type: 'company',
      verified: true,
      joinDate: '2020-03-15',
      location: 'London, UK'
    },
    description: 'Monthly subscription - Professional Plan',
    status: 'completed',
    date: '2024-08-11T09:15:00Z',
    datasetId: 'ds-001',
    paymentMethod: 'Credit Card',
    processingFee: 30,
    platformFee: 100,
    netAmount: 869,
    invoiceNumber: 'INV-2024-002',
    externalTransactionId: 'stripe-ch_789456',
    receiptUrl: '/receipts/txn-002'
  },
  {
    id: 'txn-003',
    type: 'service_payment',
    amount: 25000,
    currency: 'USD',
    payer: {
      id: 'u-103',
      name: 'Innovation Labs Inc',
      email: 'projects@innovationlabs.com',
      avatar: '/api/placeholder/40/40',
      type: 'company',
      verified: true,
      joinDate: '2023-11-05',
      location: 'Austin, TX'
    },
    payee: {
      id: 'p-001',
      name: 'Dr. Elena Martinez',
      email: 'elena@ipstrategypartners.com',
      avatar: '/api/placeholder/40/40',
      type: 'individual',
      verified: true,
      joinDate: '2021-06-10',
      location: 'Washington, DC'
    },
    description: 'Patent Landscape Analysis - Final Payment',
    status: 'completed',
    date: '2024-08-12T16:45:00Z',
    serviceId: 'svc-001',
    projectId: 'proj-001',
    paymentMethod: 'ACH Transfer',
    processingFee: 25,
    platformFee: 2500,
    netAmount: 22475,
    invoiceNumber: 'INV-2024-003',
    externalTransactionId: 'ach-456789123',
    receiptUrl: '/receipts/txn-003'
  }
];

const mockPayoutRequests: PayoutRequest[] = [
  {
    id: 'payout-001',
    userId: 'u-001',
    amount: 2247500,
    currency: 'USD',
    method: 'wire',
    status: 'completed',
    requestDate: '2024-08-11T10:00:00Z',
    processedDate: '2024-08-12T14:30:00Z',
    fees: 50,
    netAmount: 2247450,
    reference: 'WIRE-789456123'
  },
  {
    id: 'payout-002',
    userId: 'u-003',
    amount: 869,
    currency: 'USD',
    method: 'paypal',
    status: 'processing',
    requestDate: '2024-08-12T11:30:00Z',
    fees: 26,
    netAmount: 843
  },
  {
    id: 'payout-003',
    userId: 'p-001',
    amount: 22475,
    currency: 'USD',
    method: 'bank_transfer',
    status: 'requested',
    requestDate: '2024-08-12T17:00:00Z',
    fees: 15,
    netAmount: 22460
  }
];

export default function RevenueAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month' | 'quarter' | 'year'>('month');
  const [selectedTab, setSelectedTab] = useState<'overview' | 'transactions' | 'payouts' | 'reports'>('overview');
  const [showFilters, setShowFilters] = useState(false);

  const currentMetrics = mockRevenueMetrics[0];
  const previousMetrics = mockRevenueMetrics[1];

  // Calculate period-over-period changes
  const revenueChange = ((currentMetrics.totalRevenue - previousMetrics.totalRevenue) / previousMetrics.totalRevenue) * 100;
  const transactionChange = ((currentMetrics.totalTransactions - previousMetrics.totalTransactions) / previousMetrics.totalTransactions) * 100;
  const userChange = ((currentMetrics.activeUsers - previousMetrics.activeUsers) / previousMetrics.activeUsers) * 100;

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'patent_sale': return ShoppingCart;
      case 'patent_license': return FileText;
      case 'data_purchase': return BarChart3;
      case 'service_payment': return Users;
      case 'commission': return Target;
      case 'refund': return RefreshCw;
      default: return CreditCard;
    }
  };

  const getTransactionTypeLabel = (type: string) => {
    return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'processing': return Clock;
      case 'pending': return AlertCircle;
      case 'failed': return XCircle;
      case 'refunded': return RefreshCw;
      default: return AlertCircle;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'processing': return 'text-blue-600';
      case 'pending': return 'text-yellow-600';
      case 'failed': return 'text-red-600';
      case 'refunded': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  return (
    <div className="h-full bg-gray-50">
      <PageHeader 
        title="Revenue Analytics" 
        subtitle="Track marketplace performance and financial metrics"
      />

      {/* Period Selector */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex bg-gray-100 rounded-lg p-1">
              {['day', 'week', 'month', 'quarter', 'year'].map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period as any)}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    selectedPeriod === period
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Filter className="h-4 w-4" />
              Filters
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-6">
        <div className="flex">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'transactions', label: 'Transactions', icon: CreditCard },
            { id: 'payouts', label: 'Payouts', icon: Wallet },
            { id: 'reports', label: 'Reports', icon: FileText }
          ].map((tab) => {
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm ${
                  selectedTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <TabIcon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {selectedTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(currentMetrics.totalRevenue)}
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  {revenueChange >= 0 ? (
                    <ArrowUpRight className="h-4 w-4 text-green-600" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-600" />
                  )}
                  <span className={`ml-1 text-sm font-medium ${
                    revenueChange >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatPercentage(revenueChange)}
                  </span>
                  <span className="ml-2 text-sm text-gray-600">vs last {selectedPeriod}</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Net Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(currentMetrics.netRevenue)}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Wallet className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <span className="text-sm text-gray-600">
                    After fees: {formatCurrency(currentMetrics.platformCommission + currentMetrics.processingFees)}
                  </span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Transactions</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {currentMetrics.totalTransactions.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <CreditCard className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  {transactionChange >= 0 ? (
                    <ArrowUpRight className="h-4 w-4 text-green-600" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-600" />
                  )}
                  <span className={`ml-1 text-sm font-medium ${
                    transactionChange >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatPercentage(transactionChange)}
                  </span>
                  <span className="ml-2 text-sm text-gray-600">vs last {selectedPeriod}</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Users</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {currentMetrics.activeUsers.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-full">
                    <Users className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  {userChange >= 0 ? (
                    <ArrowUpRight className="h-4 w-4 text-green-600" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-600" />
                  )}
                  <span className={`ml-1 text-sm font-medium ${
                    userChange >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatPercentage(userChange)}
                  </span>
                  <span className="ml-2 text-sm text-gray-600">vs last {selectedPeriod}</span>
                </div>
              </div>
            </div>

            {/* Revenue Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold mb-4">Revenue by Category</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-blue-500 rounded"></div>
                      <span className="text-sm font-medium">Patent Sales</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{formatCurrency(currentMetrics.patentRevenue)}</div>
                      <div className="text-sm text-gray-600">
                        {((currentMetrics.patentRevenue / currentMetrics.totalRevenue) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-green-500 rounded"></div>
                      <span className="text-sm font-medium">Data Sales</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{formatCurrency(currentMetrics.dataRevenue)}</div>
                      <div className="text-sm text-gray-600">
                        {((currentMetrics.dataRevenue / currentMetrics.totalRevenue) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-purple-500 rounded"></div>
                      <span className="text-sm font-medium">Services</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{formatCurrency(currentMetrics.servicesRevenue)}</div>
                      <div className="text-sm text-gray-600">
                        {((currentMetrics.servicesRevenue / currentMetrics.totalRevenue) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold mb-4">User Metrics</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {currentMetrics.activeUsers.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Active Users</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {currentMetrics.newUsers}
                    </div>
                    <div className="text-sm text-gray-600">New Users</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {currentMetrics.returningUsers.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Returning</div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Average Transaction Value</span>
                    <span className="font-semibold">
                      {formatCurrency(currentMetrics.averageTransactionValue)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Fee Breakdown */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Fee Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {formatCurrency(currentMetrics.platformCommission)}
                  </div>
                  <div className="text-sm text-gray-600">Platform Commission</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {((currentMetrics.platformCommission / currentMetrics.totalRevenue) * 100).toFixed(1)}% of revenue
                  </div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {formatCurrency(currentMetrics.processingFees)}
                  </div>
                  <div className="text-sm text-gray-600">Processing Fees</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {((currentMetrics.processingFees / currentMetrics.totalRevenue) * 100).toFixed(1)}% of revenue
                  </div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(currentMetrics.netRevenue)}
                  </div>
                  <div className="text-sm text-gray-600">Net Revenue</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {((currentMetrics.netRevenue / currentMetrics.totalRevenue) * 100).toFixed(1)}% of revenue
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'transactions' && (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Recent Transactions</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-4 font-medium text-gray-600">Transaction</th>
                    <th className="text-left p-4 font-medium text-gray-600">Type</th>
                    <th className="text-left p-4 font-medium text-gray-600">Amount</th>
                    <th className="text-left p-4 font-medium text-gray-600">Status</th>
                    <th className="text-left p-4 font-medium text-gray-600">Date</th>
                    <th className="text-left p-4 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockTransactions.map((transaction) => {
                    const TransactionIcon = getTransactionIcon(transaction.type);
                    const StatusIcon = getStatusIcon(transaction.status);
                    return (
                      <tr key={transaction.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-full">
                              <TransactionIcon className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <div className="font-medium">{transaction.description}</div>
                              <div className="text-sm text-gray-600">
                                {transaction.payer.name} → {transaction.payee.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">
                            {getTransactionTypeLabel(transaction.type)}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="font-semibold">{formatCurrency(transaction.amount)}</div>
                          <div className="text-sm text-gray-600">
                            Net: {formatCurrency(transaction.netAmount)}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className={`flex items-center gap-2 ${getStatusColor(transaction.status)}`}>
                            <StatusIcon className="h-4 w-4" />
                            <span className="text-sm font-medium capitalize">{transaction.status}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-sm">
                            {new Date(transaction.date).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-600">
                            {new Date(transaction.date).toLocaleTimeString()}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <button className="p-1 hover:bg-gray-100 rounded">
                              <Eye className="h-4 w-4 text-gray-600" />
                            </button>
                            <button className="p-1 hover:bg-gray-100 rounded">
                              <Download className="h-4 w-4 text-gray-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedTab === 'payouts' && (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Payout Requests</h3>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Request Payout
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-4 font-medium text-gray-600">Request ID</th>
                    <th className="text-left p-4 font-medium text-gray-600">Amount</th>
                    <th className="text-left p-4 font-medium text-gray-600">Method</th>
                    <th className="text-left p-4 font-medium text-gray-600">Status</th>
                    <th className="text-left p-4 font-medium text-gray-600">Requested</th>
                    <th className="text-left p-4 font-medium text-gray-600">Processed</th>
                  </tr>
                </thead>
                <tbody>
                  {mockPayoutRequests.map((payout) => {
                    const StatusIcon = getStatusIcon(payout.status);
                    return (
                      <tr key={payout.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="p-4">
                          <div className="font-medium">{payout.id}</div>
                          {payout.reference && (
                            <div className="text-sm text-gray-600">{payout.reference}</div>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="font-semibold">{formatCurrency(payout.amount)}</div>
                          <div className="text-sm text-gray-600">
                            Fees: {formatCurrency(payout.fees)}
                          </div>
                          <div className="text-sm font-medium text-green-600">
                            Net: {formatCurrency(payout.netAmount)}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded capitalize">
                            {payout.method.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className={`flex items-center gap-2 ${getStatusColor(payout.status)}`}>
                            <StatusIcon className="h-4 w-4" />
                            <span className="text-sm font-medium capitalize">{payout.status}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-sm">
                            {new Date(payout.requestDate).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-600">
                            {new Date(payout.requestDate).toLocaleTimeString()}
                          </div>
                        </td>
                        <td className="p-4">
                          {payout.processedDate ? (
                            <div>
                              <div className="text-sm">
                                {new Date(payout.processedDate).toLocaleDateString()}
                              </div>
                              <div className="text-xs text-gray-600">
                                {new Date(payout.processedDate).toLocaleTimeString()}
                              </div>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">Pending</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedTab === 'reports' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Available Reports</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="font-medium">Revenue Summary</div>
                      <div className="text-sm text-gray-600">Detailed revenue breakdown by category</div>
                    </div>
                  </div>
                  <button className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm hover:bg-blue-200">
                    Generate
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <PieChart className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="font-medium">Transaction Analysis</div>
                      <div className="text-sm text-gray-600">Transaction patterns and trends</div>
                    </div>
                  </div>
                  <button className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm hover:bg-green-200">
                    Generate
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-purple-600" />
                    <div>
                      <div className="font-medium">User Analytics</div>
                      <div className="text-sm text-gray-600">User behavior and engagement metrics</div>
                    </div>
                  </div>
                  <button className="px-3 py-1 bg-purple-100 text-purple-800 rounded text-sm hover:bg-purple-200">
                    Generate
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-orange-600" />
                    <div>
                      <div className="font-medium">Tax Report</div>
                      <div className="text-sm text-gray-600">Tax-ready financial statements</div>
                    </div>
                  </div>
                  <button className="px-3 py-1 bg-orange-100 text-orange-800 rounded text-sm hover:bg-orange-200">
                    Generate
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Recent Reports</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-gray-600" />
                    <div>
                      <div className="font-medium">July 2024 Revenue Report</div>
                      <div className="text-sm text-gray-600">Generated Aug 1, 2024</div>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-gray-200 rounded">
                    <Download className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-gray-600" />
                    <div>
                      <div className="font-medium">Q2 2024 Tax Report</div>
                      <div className="text-sm text-gray-600">Generated Jul 1, 2024</div>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-gray-200 rounded">
                    <Download className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-gray-600" />
                    <div>
                      <div className="font-medium">Transaction Analysis June</div>
                      <div className="text-sm text-gray-600">Generated Jun 30, 2024</div>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-gray-200 rounded">
                    <Download className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}