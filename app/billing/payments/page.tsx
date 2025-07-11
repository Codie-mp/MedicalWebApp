'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/store';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CreditCard, 
  Search, 
  Filter,
  Download,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  XCircle,
  ArrowUpRight,
  Receipt
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Payment {
  id: string;
  billId: string;
  amount: number;
  method: 'cash' | 'card' | 'insurance' | 'transfer';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionDate: Date;
  transactionId?: string;
  reference?: string;
  description: string;
}

export default function PaymentsPage() {
  const { user, isAuthenticated } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push('/');
      return;
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || !user) {
    return null;
  }

  // Mock payments data
  const mockPayments: Payment[] = [
    {
      id: 'pay_1',
      billId: 'bill_001',
      amount: 250.00,
      method: 'card',
      status: 'completed',
      transactionDate: new Date(Date.now() - 86400000), // Yesterday
      transactionId: 'txn_abc123',
      reference: 'Annual Checkup',
      description: 'Consultation with Dr. Sarah Wilson'
    },
    {
      id: 'pay_2',
      billId: 'bill_002',
      amount: 75.50,
      method: 'insurance',
      status: 'completed',
      transactionDate: new Date(Date.now() - 172800000), // 2 days ago
      transactionId: 'ins_def456',
      reference: 'Prescription Medication',
      description: 'Amoxicillin 500mg - 30 tablets'
    },
    {
      id: 'pay_3',
      billId: 'bill_003',
      amount: 150.00,
      method: 'card',
      status: 'pending',
      transactionDate: new Date(),
      transactionId: 'txn_ghi789',
      reference: 'Lab Tests',
      description: 'Blood work and urinalysis'
    },
    {
      id: 'pay_4',
      billId: 'bill_004',
      amount: 45.00,
      method: 'cash',
      status: 'completed',
      transactionDate: new Date(Date.now() - 259200000), // 3 days ago
      reference: 'Copay',
      description: 'Video consultation copay'
    },
    {
      id: 'pay_5',
      billId: 'bill_005',
      amount: 320.00,
      method: 'transfer',
      status: 'failed',
      transactionDate: new Date(Date.now() - 345600000), // 4 days ago
      transactionId: 'txn_jkl012',
      reference: 'Emergency Visit',
      description: 'Emergency room visit and treatment'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'refunded':
        return <ArrowUpRight className="w-4 h-4 text-blue-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'failed':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      case 'refunded':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'card':
        return <CreditCard className="w-4 h-4 text-blue-600" />;
      case 'insurance':
        return <Receipt className="w-4 h-4 text-green-600" />;
      case 'cash':
        return <DollarSign className="w-4 h-4 text-emerald-600" />;
      case 'transfer':
        return <ArrowUpRight className="w-4 h-4 text-purple-600" />;
      default:
        return <DollarSign className="w-4 h-4 text-gray-600" />;
    }
  };

  const filteredPayments = mockPayments.filter(payment => {
    const matchesSearch = payment.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         payment.reference?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         payment.transactionId?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || payment.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const recentPayments = filteredPayments.filter(payment => 
    payment.transactionDate > new Date(Date.now() - 2592000000) // Last 30 days
  );

  const olderPayments = filteredPayments.filter(payment => 
    payment.transactionDate <= new Date(Date.now() - 2592000000)
  );

  const totalPaid = mockPayments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingAmount = mockPayments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  const PaymentCard = ({ payment }: { payment: Payment }) => (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              {getMethodIcon(payment.method)}
              <h3 className="font-semibold text-gray-900">{payment.description}</h3>
              <Badge className={getStatusColor(payment.status)}>
                {getStatusIcon(payment.status)}
                <span className="ml-1">{payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}</span>
              </Badge>
            </div>
            
            <p className="text-sm text-gray-600 mb-3">
              {payment.reference}
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>{payment.transactionDate.toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4" />
                <span className="font-medium">${payment.amount.toFixed(2)}</span>
              </div>
              {payment.transactionId && (
                <div className="flex items-center space-x-2 col-span-2">
                  <Receipt className="w-4 h-4" />
                  <span className="font-mono text-xs">{payment.transactionId}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex flex-col space-y-2 ml-4">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-1" />
              Receipt
            </Button>
            {payment.status === 'failed' && (
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                Retry Payment
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="lg:ml-64">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="p-6 space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-inter font-bold text-gray-900">
                Payment History
              </h1>
              <p className="text-gray-600 mt-1">
                View and manage your payment transactions
              </p>
            </div>
            <Button className="flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export History</span>
            </Button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total Paid
                </CardTitle>
                <CheckCircle className="w-4 h-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  ${totalPaid.toFixed(2)}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  All completed payments
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Pending Payments
                </CardTitle>
                <Clock className="w-4 h-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  ${pendingAmount.toFixed(2)}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Awaiting processing
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  This Month
                </CardTitle>
                <Calendar className="w-4 h-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {recentPayments.length}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Payment transactions
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search payments..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payments Tabs */}
          <Tabs defaultValue="recent" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="recent">Recent ({recentPayments.length})</TabsTrigger>
              <TabsTrigger value="older">Older ({olderPayments.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="recent" className="space-y-4">
              {recentPayments.length > 0 ? (
                recentPayments.map((payment) => (
                  <PaymentCard key={payment.id} payment={payment} />
                ))
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No recent payments
                    </h3>
                    <p className="text-gray-600">
                      Your recent payment history will appear here.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="older" className="space-y-4">
              {olderPayments.length > 0 ? (
                olderPayments.map((payment) => (
                  <PaymentCard key={payment.id} payment={payment} />
                ))
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No older payments
                    </h3>
                    <p className="text-gray-600">
                      Your older payment history will appear here.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}