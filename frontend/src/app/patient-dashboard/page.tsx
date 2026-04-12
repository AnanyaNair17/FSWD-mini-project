"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Clock, 
  MapPin, 
  User, 
  Bell, 
  LogOut, 
  ArrowRight, 
  History, 
  Calendar,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  XCircle
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '../components/Button';
import { Tag } from '../components/Tag';

export default function PatientDashboard() {
  const { user, token, isAuthenticated, loading: authLoading } = useAuth();
  const [activeEntry, setActiveEntry] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [lastVisitClinic, setLastVisitClinic] = useState<string | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const fetchStatus = async () => {
    if (!token) return;
    try {
      setRefreshing(true);
      const response = await fetch('http://localhost:5000/api/queue/patient-status', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        if (activeEntry && (!data.entry || data.entry.status === 'COMPLETED')) {
          setLastVisitClinic(activeEntry.queue.clinic.name);
          setShowRatingModal(true);
          fetchHistory(); // Refresh history when a visit completes
        }
        setActiveEntry(data.entry);
      }
    } catch (error) {
      console.error("Error fetching status:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleLeaveQueue = async () => {
    if (!token || !window.confirm("Are you sure you want to leave the queue?")) return;
    
    try {
      setRefreshing(true);
      const response = await fetch('http://localhost:5000/api/queue/leave', {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        toast.success("Successfully left the queue");
        setActiveEntry(null);
        fetchHistory();
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to leave queue");
      }
    } catch (error) {
      toast.error("An error occurred while leaving the queue");
    } finally {
      setRefreshing(false);
    }
  };

  const fetchHistory = async () => {
    if (!token) return;
    try {
      const response = await fetch('http://localhost:5000/api/queue/history', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) setHistory(data.history || []);
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchStatus();
      fetchHistory();
      const interval = setInterval(fetchStatus, 15000); 
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, token]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="w-10 h-10 text-[#1A6B7C] animate-spin" />
          <p className="text-[#717182] font-['Outfit']">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100 max-w-md">
          <AlertCircle className="w-12 h-12 text-[#C94F1E] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#1A1924] mb-2">Access Denied</h2>
          <p className="text-[#717182] mb-6">Please log in to view your dashboard.</p>
          <Link href="/login">
            <Button variant="primary" className="w-full">Go to Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12">
      {/* Header Overlay */}
      <div className="bg-[#1A6B7C] pt-12 pb-24 px-6 md:px-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white font-['Outfit'] mb-2">
              Hello, {user?.name}
            </h1>
            <p className="text-white/80 font-['Outfit']">Track your clinic visits and active tokens</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={fetchStatus}
              className={`p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all ${refreshing ? 'animate-spin' : ''}`}
              title="Refresh status"
            >
              <RefreshCw size={20} />
            </button>
            <div className="p-3 rounded-xl bg-white/10 text-white relative cursor-pointer" onClick={() => setShowNotifications(!showNotifications)}>
              <Bell size={20} />
              {activeEntry && activeEntry.queue?.entries && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#C94F1E] rounded-full border-2 border-[#1A6B7C] flex items-center justify-center text-[10px] font-bold">
                  {Math.max(0, activeEntry.tokenNumber - (activeEntry.queue.lastToken - (activeEntry.queue.entries?.length || 0) + 1))}
                </div>
              )}
              
              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-4 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 z-50 text-[#1A1924]">
                  <h4 className="font-bold mb-4 border-b pb-2">Notifications</h4>
                  <div className="space-y-4 max-h-60 overflow-y-auto">
                    {activeEntry ? (
                      <div className="text-sm p-3 bg-blue-50 rounded-lg border border-blue-100">
                        Your token <span className="font-bold">#{activeEntry.tokenNumber}</span> is {activeEntry.status.toLowerCase()}.
                      </div>
                    ) : (
                      <div className="text-sm text-[#717182] text-center py-4">No new notifications</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 -mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Active Token Section */}
          <div className="lg:col-span-2 space-y-8">
            {activeEntry ? (
              <div className="bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden">
                <div className="bg-orange-50 px-8 py-4 border-b border-orange-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                    <span className="text-orange-700 font-semibold text-sm uppercase tracking-wider">Active Token</span>
                  </div>
                  <Tag variant="success">{activeEntry.status}</Tag>
                </div>
                
                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="text-center md:text-left flex flex-col justify-center">
                      <h3 className="text-2xl font-bold text-[#1A1924] mb-2">{activeEntry.queue.clinic.name}</h3>
                      <div className="flex items-center justify-center md:justify-start gap-2 text-[#717182] mb-6">
                        <MapPin size={18} />
                        <span className="text-sm">{activeEntry.queue.clinic.address}</span>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                          <Clock className="text-[#1A6B7C]" size={20} />
                          <div>
                            <p className="text-xs text-[#717182] uppercase">Est. Wait Time</p>
                            <p className="text-[#1A1924] font-semibold">~15-20 Mins</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                          <User className="text-[#1A6B7C]" size={20} />
                          <div>
                            <p className="text-xs text-[#717182] uppercase">Token Status</p>
                            <p className="text-[#1A1924] font-semibold">
                              {(activeEntry.tokenNumber - (activeEntry.queue.lastToken - (activeEntry.queue.entries?.length || 0) + 1)) || 0} patients ahead of you
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-gray-100 pt-8 md:pt-0 md:pl-12">
                      <p className="text-sm text-[#717182] uppercase tracking-[0.2em] mb-4">Your Token Number</p>
                      <div className="w-40 h-40 bg-[#1A6B7C] rounded-3xl flex items-center justify-center shadow-xl shadow-[#1A6B7C]/20 mb-6">
                        <span className="text-7xl font-bold text-white">{activeEntry.tokenNumber}</span>
                      </div>
                      <div className="text-center">
                        <p className="text-[#1A1924] font-medium mb-1">Current Token at Counter</p>
                        <p className="text-2xl font-bold text-[#1A6B7C]">#{activeEntry.queue.lastToken - (activeEntry.queue.entries?.length || 0) + 1}</p> 
                      </div>
                    </div>
                  </div>

                  <div className="mt-12 flex flex-col md:flex-row gap-4">
                    <Button 
                      variant="primary" 
                      className="flex-1 h-14 text-lg"
                      onClick={fetchStatus}
                    >
                      Refresh Status
                    </Button>
                    <Link href={`/clinic/${activeEntry.queue.clinic.id}`} className="flex-1">
                      <Button variant="outline" className="w-full h-14 text-lg border-[#1A6B7C] text-[#1A6B7C] hover:bg-[#1A6B7C]/5">
                        View Full Queue
                      </Button>
                    </Link>
                    <Button variant="outline" className="flex-1 h-14 text-lg border-red-200 text-red-600 hover:bg-red-50" onClick={handleLeaveQueue}>
                      Leave Queue
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Calendar className="w-10 h-10 text-gray-300" />
                </div>
                <h3 className="text-2xl font-bold text-[#1A1924] mb-3">No active visits</h3>
                <p className="text-[#717182] mb-8 max-w-xs mx-auto">
                  You are not currently in any queue. Find a clinic and join a queue to see it here.
                </p>
                <Link href="/browse">
                  <Button variant="accent" size="lg">Find a Clinic</Button>
                </Link>
              </div>
            )}

            {/* Notifications Feed */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-[#1A1924]">Updates</h3>
                <button className="text-sm text-[#1A6B7C] font-semibold hover:underline">Mark all as read</button>
              </div>
              <div className="space-y-6">
                {activeEntry && (
                  <div className="flex gap-4 p-4 rounded-xl bg-[#1A6B7C]/5 border border-[#1A6B7C]/10">
                    <div className="w-10 h-10 rounded-full bg-[#1A6B7C]/10 flex items-center justify-center text-[#1A6B7C]">
                      <RefreshCw size={20} />
                    </div>
                    <div>
                      <p className="text-[#1A1924] font-medium">Queue Update</p>
                      <p className="text-sm text-[#717182]">You are currently {activeEntry.status.toLowerCase()} at {activeEntry.queue.clinic.name}.</p>
                    </div>
                  </div>
                )}
                {!activeEntry && history.length === 0 && (
                  <p className="text-center text-sm text-[#717182] py-4">No recent updates</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h3 className="text-lg font-bold text-[#1A1924] mb-6">Quick Actions</h3>
              <div className="space-y-3">
                <Link href="/browse" className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-[#1A6B7C] hover:bg-[#1A6B7C]/5 transition-all group">
                  <span className="text-[#1A1924] font-medium group-hover:text-[#1A6B7C]">Browse Clinics</span>
                  <ArrowRight size={18} className="text-[#9CA3AF] group-hover:text-[#1A6B7C]" />
                </Link>
                <Link href="#" className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-[#1A6B7C] hover:bg-[#1A6B7C]/5 transition-all group">
                  <span className="text-[#1A1924] font-medium group-hover:text-[#1A6B7C]">Update Profile</span>
                  <ArrowRight size={18} className="text-[#9CA3AF] group-hover:text-[#1A6B7C]" />
                </Link>
              </div>
            </div>

            {/* Visit History - Placeholder removed as requested */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-[#1A1924]">Your Activity</h3>
                <History className="text-[#9CA3AF]" size={20} />
              </div>
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                {history.length > 0 ? (
                  history.map((visit, idx) => (
                    <div key={idx} className="p-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors rounded-lg">
                      <p className="text-sm font-bold text-[#1A1924]">{visit.queue.clinic.name}</p>
                      <div className="flex justify-between items-center mt-1">
                        <Tag variant={visit.status === 'COMPLETED' ? 'success' : 'warning'} className="text-[10px] scale-90 -ml-2">
                          {visit.status}
                        </Tag>
                        <span className="text-[10px] text-[#94A3B8]">
                          {new Date(visit.completedAt || visit.joinedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-[#717182] font-['Outfit']">No past visits yet.</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Health Tip */}
            <div className="bg-gradient-to-br from-[#1A6B7C] to-[#155661] rounded-2xl p-8 text-white">
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                <AlertCircle size={20} className="text-white/60" />
                Daily Tip
              </h3>
              <p className="text-white/80 text-sm italic font-['Outfit']">
                "Consistent sleep patterns help regulate your immune system and improve mental clarity."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Star className="w-10 h-10 text-orange-600 fill-orange-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#1A1924] mb-2">How was your visit?</h2>
            <p className="text-[#717182] mb-6 font-['Outfit']">
              Please rate your experience at <span className="font-semibold text-[#1A6B7C]">{lastVisitClinic}</span>
            </p>
            <div className="flex justify-center gap-2 mb-8">
              {[1, 2, 3, 4, 5].map((star) => (
                <button 
                  key={star} 
                  className="p-1 hover:scale-110 transition-transform"
                  onClick={() => setSelectedRating(star)}
                >
                  <Star 
                    className={`w-8 h-8 ${star <= selectedRating ? 'text-orange-500 fill-orange-500' : 'text-gray-200'}`} 
                  />
                </button>
              ))}
            </div>
            <div className="flex flex-col gap-3">
              <Button 
                variant="primary" 
                className="w-full h-12"
                onClick={() => setShowRatingModal(false)}
              >
                Submit Review
              </Button>
              <Button 
                variant="outline" 
                className="w-full h-12"
                onClick={() => setShowRatingModal(false)}
              >
                Maybe Later
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper Star icon for the modal because it wasn't imported
function Star({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
