"use client";

import React, { useState, useEffect } from 'react';
import { Input } from '../components/Input';
import { Dropdown } from '../components/Dropdown';
import { ClinicCard } from '../components/ClinicCard';

interface Clinic {
  id: string;
  name: string;
  doctor: string;
  specialty: string;
  location: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  waiting: number;
  queueStatus: 'open' | 'closed';
  workingDays?: string;
}

export default function BrowsePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch clinics from API
  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/clinics');
        if (response.ok) {
          const data = await response.json();
          setClinics(data);
        }
      } catch (error) {
        console.error('Failed to fetch clinics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClinics();
  }, []);

  const areas = [
    { value: '', label: 'All Areas' },
    ...Array.from(new Set(clinics.map(c => c.location)))
      .map(area => ({ value: area.toLowerCase(), label: area }))
  ];

  const specializations = [
    { value: '', label: 'All Specializations' },
    ...Array.from(new Set(clinics.map(c => c.specialty)))
      .map(spec => ({ value: spec.toLowerCase(), label: spec }))
  ];

  const sortOptions = [
    { value: 'shortest', label: 'Shortest wait' },
    { value: 'rating', label: 'Highest rated' },
    { value: 'reviews', label: 'Most reviewed' }
  ];

  // Filter and sort clinics
  let filteredClinics = clinics.filter(clinic => {
    const matchesSearch = searchQuery === '' || 
      clinic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      clinic.doctor.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesArea = selectedArea === '' || 
      clinic.location.toLowerCase() === selectedArea.toLowerCase();
    
    const matchesSpecialty = selectedSpecialization === '' || 
      clinic.specialty.toLowerCase().includes(selectedSpecialization.toLowerCase());

    return matchesSearch && matchesArea && matchesSpecialty;
  });

  // Sort clinics
  if (sortBy === 'shortest') {
    filteredClinics = [...filteredClinics].sort((a, b) => a.waiting - b.waiting);
  } else if (sortBy === 'rating') {
    filteredClinics = [...filteredClinics].sort((a, b) => b.rating - a.rating);
  } else if (sortBy === 'reviews') {
    filteredClinics = [...filteredClinics].sort((a, b) => b.reviewCount - a.reviewCount);
  }

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-4xl text-[#1A1924] mb-8">Find a clinic</h1>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Input
            placeholder="Search clinic or doctor name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Dropdown
            options={areas}
            placeholder="All Areas"
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
          />
          <Dropdown
            options={specializations}
            placeholder="All Specializations"
            value={selectedSpecialization}
            onChange={(e) => setSelectedSpecialization(e.target.value)}
          />
          <Dropdown
            options={sortOptions}
            placeholder="Shortest wait"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          />
        </div>

        {/* Results Count */}
        <p className="text-[#717182] mb-6 font-['Outfit']">
          {loading ? 'Loading clinics...' : `${filteredClinics.length} clinics found`}
        </p>

        {/* Clinic Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white rounded-xl border border-[#E5E5E5] p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="flex gap-2 mb-4">
                  <div className="h-6 bg-gray-200 rounded-full w-24"></div>
                  <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                </div>
                <div className="h-12 bg-gray-200 rounded mt-4"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredClinics.map((clinic) => (
              <ClinicCard key={clinic.id} {...clinic} />
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && filteredClinics.length === 0 && (
          <div className="text-center py-16">
            <p className="text-[#717182] text-lg font-['Outfit']">
              No clinics found matching your criteria. Try adjusting your filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
