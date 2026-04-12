"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/Button';
import { ArrowLeft, Clock, User, CheckCircle, XCircle, Search, Trash2 } from 'lucide-react';
import { Tag } from '../../components/Tag';
import { toast } from 'sonner';
import Link from 'next/link';

export default function StaffHistoryPage() {
  const router = useRouter();
  const { user, token, isAuthenticated, loading: authLoading } = useAuth();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated || !['staff', 'ngo'].includes(user?.role?.toLowerCase() || '')) {
      router.push('/staff-login');
      return;
    }

    const fetchHistory = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/queue/history/${user?.clinicId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (response.ok) {
          setHistory(data.history || []);
        }
      } catch (error) {
        toast.error("Failed to fetch visit history");
      } finally {
        setLoading(false);
      }
    };

    if (user?.clinicId) fetchHistory();
  }, [user, isAuthenticated, authLoading, router, token]);

  const handleDeleteEntry = async (id: number) => {
    if (!window.confirm("Are you sure you want to permanently delete this record?")) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/queue/entry/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        toast.success("Record deleted successfully");
        setHistory(prev => prev.filter(item => item.id !== id));
      } else {
        toast.error("Failed to delete record");
      }
    } catch (error) {
      toast.error("Error deleting record");
    }
  };

  const filteredHistory = history.filter(item => {
    const matchesSearch = item.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tokenNumber.toString().includes(searchTerm);
    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
    const matchesDate = !dateFilter || new Date(item.joinedAt).toLocaleDateString() === new Date(dateFilter).toLocaleDateString();
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  if (loading) return <div className="p-12 text-center font-['Outfit']">Loading history...</div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12">
      <header className="bg-white border-b border-[#E5E5E5] px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/staff-management/dashboard">
              <button className="p-2 hover:bg-gray-100 rounded-full text-[#717182] transition-colors">
                <ArrowLeft size={20} />
              </button>
            </Link>
            <h1 className="text-2xl font-['Outfit'] font-semibold text-[#1A1924]">Visit History</h1>
          </div>
          <p className="text-sm text-[#717182] font-['Outfit'] hidden md:block">
            Found {history.length} total visits
          </p>
        </div>
      </header>

      <main className="p-8 max-w-7xl mx-auto">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 items-end">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8] group-focus-within:text-[#1A6B7C] transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search by name or token..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-[#E5E5E5] focus:outline-none focus:ring-2 focus:ring-[#1A6B7C] transition-all font-['Outfit'] bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="w-full md:w-48">
            <label className="block text-xs font-bold text-[#717182] mb-2 uppercase tracking-wider font-['Outfit']">Status</label>
            <select 
              className="w-full px-4 py-3 rounded-xl border border-[#E5E5E5] focus:outline-none focus:ring-2 focus:ring-[#1A6B7C] transition-all font-['Outfit'] bg-white"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Status</option>
              <option value="COMPLETED">Completed</option>
              <option value="SKIPPED">Skipped</option>
              <option value="WAITING">Waiting</option>
            </select>
          </div>

          <div className="w-full md:w-48">
            <label className="block text-xs font-bold text-[#717182] mb-2 uppercase tracking-wider font-['Outfit']">Date</label>
            <input 
              type="date" 
              className="w-full px-4 py-3 rounded-xl border border-[#E5E5E5] focus:outline-none focus:ring-2 focus:ring-[#1A6B7C] transition-all font-['Outfit'] bg-white"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>

          {(searchTerm || statusFilter !== 'ALL' || dateFilter) && (
            <Button 
              variant="outline" 
              className="h-[50px] px-6"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('ALL');
                setDateFilter('');
              }}
            >
              Clear
            </Button>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-['Outfit']">
              <thead>
                <tr className="bg-gray-50 border-b border-[#E5E5E5] text-[#717182] text-xs uppercase tracking-wider">
                  <th className="px-8 py-4 font-semibold">Token</th>
                  <th className="px-8 py-4 font-semibold">Patient Name</th>
                  <th className="px-8 py-4 font-semibold">Join Date & Time</th>
                  <th className="px-8 py-4 font-semibold text-right">Status</th>
                  <th className="px-8 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {filteredHistory.length > 0 ? (
                  filteredHistory.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-8 py-5 font-bold text-[#1A6B7C]">#{item.tokenNumber}</td>
                      <td className="px-8 py-5 font-medium text-[#1A1924]">{item.patientName}</td>
                      <td className="px-8 py-5">
                        <p className="text-sm text-[#1A1924]">{new Date(item.joinedAt).toLocaleDateString()}</p>
                        <p className="text-xs text-[#717182]">{new Date(item.joinedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <Tag variant={item.status === 'COMPLETED' ? 'success' : 'warning'}>
                          {item.status}
                        </Tag>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button 
                          onClick={() => handleDeleteEntry(item.id)}
                          className="p-2 text-[#717182] hover:text-red-500 transition-colors"
                          title="Delete Record"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-20 text-center text-[#717182]">
                      <div className="flex flex-col items-center gap-3">
                        <User size={40} className="text-gray-200" />
                        <p>No records found matching your search.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
