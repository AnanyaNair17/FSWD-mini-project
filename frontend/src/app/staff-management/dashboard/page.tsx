"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '../../components/Button';
import { toast } from 'sonner';
import { Users, Timer, Hash, Play, Pause, XCircle, CheckCircle, SkipForward, History } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface QueueStatus {
  status: 'OPEN' | 'CLOSED' | 'PAUSED';
  lastToken: number;
  currentToken: number;
  totalWaiting: number;
  completedToday: number;
  estimatedWaitTime: number;
  activePatient: any | null;
  waitlist: any[];
}

export default function StaffDashboard() {
  const router = useRouter();
  const { user, token, isAuthenticated, loading: authLoading } = useAuth();
  const [queueData, setQueueData] = useState<QueueStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchQueueStatus = useCallback(async (clinicId: number) => {
    try {
      const response = await fetch(`http://localhost:5000/api/queue/status/${clinicId}`);
      if (!response.ok) throw new Error('Failed to fetch status');
      const data = await response.json();
      setQueueData(data);
    } catch (error) {
      console.error(error);
      // toast.error("Failed to refresh queue data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      router.push('/staff-login');
      return;
    }

    if (user?.clinicId) {
      fetchQueueStatus(user.clinicId);
      const interval = setInterval(() => fetchQueueStatus(user.clinicId), 5000);
      return () => clearInterval(interval);
    } else {
      toast.error("No clinic associated with this account");
      setLoading(false);
    }
  }, [router, fetchQueueStatus, isAuthenticated, authLoading, user]);

  const handleQueueControl = async (newStatus: string) => {
    try {
      const response = await fetch('http://localhost:5000/api/queue/control', {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ clinicId: user.clinicId, status: newStatus }),
      });
      if (!response.ok) throw new Error('Action failed');
      toast.success(`Queue is now ${newStatus.toLowerCase()}`);
      fetchQueueStatus(user.clinicId);
    } catch (error) {
      toast.error("Failed to update queue status");
    }
  };

  const handleCallNext = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/queue/next', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ clinicId: user.clinicId }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to call next');
      toast.success(`Calling Token #${data.entry.tokenNumber}`);
      fetchQueueStatus(user.clinicId);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleUpdateEntry = async (id: number, status: 'COMPLETED' | 'SKIPPED') => {
    try {
      const response = await fetch(`http://localhost:5000/api/queue/entry/${id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error('Action failed');
      toast.success(status === 'COMPLETED' ? "Visit completed" : "Patient skipped");
      fetchQueueStatus(user.clinicId);
    } catch (error) {
      toast.error("Failed to update patient status");
    }
  };

  const handleAddWalkin = async () => {
    const name = prompt("Enter Patient Name:");
    if (!name) return;

    try {
      const response = await fetch('http://localhost:5000/api/queue/join', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ clinicId: user.clinicId, patientName: name }),
      });
      if (!response.ok) throw new Error('Failed to add patient');
      toast.success("Patient added to waitlist");
      setTimeout(() => fetchQueueStatus(user.clinicId), 500); // Small delay to ensure DB consistency
    } catch (error) {
      toast.error("Error adding walk-in patient");
    }
  };

  if (loading) return <div className="p-12 text-center font-['Outfit']">Loading Dashboard...</div>;
  if (!user || !user.clinicId) return <div className="p-12 text-center font-['Outfit'] text-red-500">Error: Clinic not found.</div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <header className="bg-white border-b border-[#E5E5E5] px-8 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-['Outfit'] font-semibold text-[#1A1924]">Staff Dashboard</h1>
          <p className="text-sm text-[#717182] font-['Outfit']">{user.name} • Clinic Management</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white rounded-full border border-[#E5E5E5] p-1 pr-4">
            <div className={`w-3 h-3 rounded-full ml-3 ${queueData?.status === 'OPEN' ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm font-medium text-[#1A1924] font-['Outfit'] uppercase">
              {queueData?.status}
            </span>
          </div>
          <Link href="/staff-management/history">
            <Button
              variant="outline"
              className="h-10 px-4 flex items-center gap-2"
            >
              <History size={18} />
              Visit History
            </Button>
          </Link>
          <Button
            variant="outline"
            className="h-10 px-4"
            onClick={() => handleQueueControl(queueData?.status === 'OPEN' ? 'CLOSED' : 'OPEN')}
          >
            {queueData?.status === 'OPEN' ? 'Close Clinic' : 'Open Clinic'}
          </Button>
        </div>
      </header>

      <main className="p-8 max-w-7xl mx-auto">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard icon={<Hash className="text-[#1A6B7C]" />} label="Current Token" value={queueData?.currentToken || '--'} color="bg-white" />
          <StatCard icon={<Users className="text-blue-500" />} label="Total Waiting" value={queueData?.totalWaiting || 0} color="bg-white" />
          <StatCard icon={<CheckCircle className="text-green-500" />} label="Completed Today" value={queueData?.completedToday || 0} color="bg-white" />
          <StatCard icon={<Timer className="text-orange-500" />} label="Est. Wait Time" value={`${queueData?.estimatedWaitTime} min`} color="bg-white" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Patient Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 sticky top-8">
              <h2 className="text-lg font-['Outfit'] font-bold text-[#1A1924] mb-6 flex items-center gap-2">
                <Play size={20} className="text-[#1A6B7C]" />
                In Progress
              </h2>

              {queueData?.activePatient ? (
                <div className="space-y-6">
                  <div className="text-center p-8 bg-[#F0F9FA] rounded-xl border border-[#CCF0F5]">
                    <div className="text-5xl font-['Outfit'] font-black text-[#1A6B7C] mb-2">#{queueData.activePatient.tokenNumber}</div>
                    <div className="text-xl font-semibold text-[#1A1924]">{queueData.activePatient.patientName}</div>
                  </div>
                  <div className="flex gap-2 mb-3">
                    <Button
                      variant="outline"
                      className="flex-1 text-[#1A6B7C] border-[#1A6B7C]/20 hover:bg-[#1A6B7C]/5"
                      onClick={() => {
                        toast.info("Added 5 minutes to current session");
                        // In a real app, this would update estimatedWaitTime in DB
                      }}
                    >
                      + 5 Mins
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 text-[#1A6B7C] border-[#1A6B7C]/20 hover:bg-[#1A6B7C]/5"
                      onClick={() => {
                        toast.info("Added 10 minutes to current session");
                      }}
                    >
                      + 10 Mins
                    </Button>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="primary"
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      onClick={() => handleUpdateEntry(queueData.activePatient.id, 'COMPLETED')}
                    >
                      Mark Done
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                      onClick={() => handleUpdateEntry(queueData.activePatient.id, 'SKIPPED')}
                    >
                      Skip
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-[#717182] mb-6 font-['Outfit']">No patient currently active</p>
                  <Button
                    variant="accent"
                    className="w-full"
                    onClick={handleCallNext}
                    disabled={queueData?.status !== 'OPEN' || queueData?.totalWaiting === 0}
                  >
                    Call Next Patient →
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Waitlist Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-['Outfit'] font-bold text-[#1A1924]">Patient Waitlist</h2>
                  <Button
                    variant="outline"
                    className="h-8 px-3 text-xs"
                    onClick={handleAddWalkin}
                    disabled={queueData?.status !== 'OPEN'}
                  >
                    + Add Walk-in
                  </Button>
                </div>
                <span className="text-xs font-['Outfit'] px-2 py-1 bg-gray-100 rounded text-gray-500 uppercase tracking-widest font-bold">Live</span>
              </div>

              {queueData?.waitlist && queueData.waitlist.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left border-b border-[#F1F5F9]">
                        <th className="pb-4 font-['Outfit'] text-xs text-[#717182] uppercase tracking-wider">Token</th>
                        <th className="pb-4 font-['Outfit'] text-xs text-[#717182] uppercase tracking-wider">Patient Name</th>
                        <th className="pb-4 font-['Outfit'] text-xs text-[#717182] uppercase tracking-wider">Joined At</th>
                        <th className="pb-4 font-['Outfit'] text-xs text-[#717182] uppercase tracking-wider">Status</th>
                        <th className="pb-4 font-['Outfit'] text-xs text-[#717182] uppercase tracking-wider text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F1F5F9]">
                      {queueData.waitlist.map((entry) => (
                        <tr key={entry.id} className="group">
                          <td className="py-4 font-['Outfit'] font-bold text-[#1A6B7C]">#{entry.tokenNumber}</td>
                          <td className="py-4 font-['Outfit'] text-[#1A1924]">{entry.patientName}</td>
                          <td className="py-4 font-['Outfit'] text-[#717182] text-sm">
                            {new Date(entry.joinedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="py-4">
                            <span className="px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full uppercase tracking-tighter">
                              {entry.status}
                            </span>
                          </td>
                          <td className="py-4 text-right">
                            <button
                              onClick={() => handleUpdateEntry(entry.id, 'SKIPPED')}
                              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                              title="Remove from queue"
                            >
                              <XCircle size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-24 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  <div className="mx-auto w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
                    <Users size={24} className="text-gray-300" />
                  </div>
                  <h3 className="text-gray-900 font-medium font-['Outfit']">No patients waiting</h3>
                  <p className="text-gray-500 text-sm font-['Outfit']">The queue list will appear here once patients join.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: string | number, color: string }) {
  return (
    <div className={`${color} p-6 rounded-2xl border border-[#E5E5E5] flex items-center gap-4`}>
      <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-xs text-[#717182] uppercase tracking-wide font-['Outfit'] mb-1">{label}</p>
        <p className="text-2xl font-['Outfit'] font-bold text-[#1A1924]">{value}</p>
      </div>
    </div>
  );
}
