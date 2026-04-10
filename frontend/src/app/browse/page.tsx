"use client";

import React, { useState } from 'react';
import { Input } from '../components/Input';
import { Dropdown } from '../components/Dropdown';
import { ClinicCard } from '../components/ClinicCard';
import { mockClinics } from '../../data/mockClinics';

export default function BrowsePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [sortBy, setSortBy] = useState('');

  const areas = [
    { value: 'powai', label: 'Powai' },
    { value: 'malad', label: 'Malad' },
    { value: 'bandra', label: 'Bandra' },
    { value: 'andheri', label: 'Andheri' },
    { value: 'dadar', label: 'Dadar' },
    { value: 'worli', label: 'Worli' }
  ];

  const specializations = [
    { value: 'pediatrician', label: 'Pediatrician' },
    { value: 'ent', label: 'ENT Specialist' },
    { value: 'dermatologist', label: 'Dermatologist' },
    { value: 'general', label: 'General Physician' },
    { value: 'orthopedic', label: 'Orthopedic' },
    { value: 'dentist', label: 'Dentist' }
  ];

  const sortOptions = [
    { value: 'shortest', label: 'Shortest wait' },
    { value: 'rating', label: 'Highest rated' },
    { value: 'reviews', label: 'Most reviewed' }
  ];

  // Filter and sort clinics
  let filteredClinics = mockClinics.filter(clinic => {
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
          {filteredClinics.length} clinics found
        </p>

        {/* Clinic Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredClinics.map((clinic) => (
            <ClinicCard key={clinic.id} {...clinic} />
          ))}
        </div>

        {/* No Results */}
        {filteredClinics.length === 0 && (
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
