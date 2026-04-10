"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from './components/Button';
import { Dropdown } from './components/Dropdown';

export default function HomePage() {
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');

  const areas = [
    { value: 'powai', label: 'Powai' },
    { value: 'malad', label: 'Malad' },
    { value: 'bandra', label: 'Bandra' },
    { value: 'andheri', label: 'Andheri' },
    { value: 'dadar', label: 'Dadar' }
  ];

  const specializations = [
    { value: 'pediatrician', label: 'Pediatrician' },
    { value: 'ent', label: 'ENT Specialist' },
    { value: 'dermatologist', label: 'Dermatologist' },
    { value: 'general', label: 'General Physician' },
    { value: 'orthopedic', label: 'Orthopedic' }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-[#1A6B7C] py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Live Queue Badge */}
          <div className="inline-flex items-center gap-2 bg-[#155661] text-white px-4 py-2 rounded-full mb-8">
            <div className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse"></div>
            <span className="text-sm font-['Outfit']">Live Queue Data · Mumbai Clinics</span>
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-6xl text-white mb-4">
            Skip the wait,
          </h1>
          <h1 className="text-5xl md:text-6xl text-white italic mb-8">
            not the doctor.
          </h1>

          {/* Subheading */}
          <p className="text-lg text-white/90 mb-12 max-w-2xl mx-auto font-['Outfit']">
            Browse real clinics, compare live queue lengths, and grab a digital
            token — before you even leave your home.
          </p>

          {/* Search Box */}
          <div className="bg-white p-6 rounded-2xl shadow-xl max-w-3xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <Link href="/browse" className="w-full">
                <Button variant="accent" className="w-full">
                  Find Clinics
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl text-center text-[#1A1924] mb-16">
            How WaitLess works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {/* For Patients */}
            <div>
              <p className="text-sm uppercase tracking-wider text-[#9CA3AF] mb-8 font-['Outfit']">
                FOR PATIENTS
              </p>

              <div className="space-y-8">
                <div className="flex gap-6">
                  <span className="text-4xl text-[#1A6B7C] flex-shrink-0">01</span>
                  <div>
                    <h3 className="text-xl text-[#1A1924] mb-2">Find your clinic</h3>
                    <p className="text-[#717182] font-['Outfit']">
                      Browse clinics near you, filter by specialization and area, and sort by
                      shortest wait time.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <span className="text-4xl text-[#1A6B7C] flex-shrink-0">02</span>
                  <div>
                    <h3 className="text-xl text-[#1A1924] mb-2">Compare queues</h3>
                    <p className="text-[#717182] font-['Outfit']">
                      See live patient counts and colour-coded wait estimates across all
                      clinics before deciding.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <span className="text-4xl text-[#1A6B7C] flex-shrink-0">03</span>
                  <div>
                    <h3 className="text-xl text-[#1A1924] mb-2">Take your token</h3>
                    <p className="text-[#717182] font-['Outfit']">
                      Enter your name, get a digital token, and relax — the clinic screen
                      will show your number.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* For Clinics */}
            <div>
              <p className="text-sm uppercase tracking-wider text-[#9CA3AF] mb-8 font-['Outfit']">
                FOR CLINICS
              </p>

              <div className="space-y-8">
                <div className="flex gap-6">
                  <span className="text-4xl text-[#C94F1E] flex-shrink-0">01</span>
                  <div>
                    <h3 className="text-xl text-[#1A1924] mb-2">Register for free</h3>
                    <p className="text-[#717182] font-['Outfit']">
                      Add your clinic profile with doctor details, specialization, working
                      hours, and location in 3 steps.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <span className="text-4xl text-[#C94F1E] flex-shrink-0">02</span>
                  <div>
                    <h3 className="text-xl text-[#1A1924] mb-2">Get discovered</h3>
                    <p className="text-[#717182] font-['Outfit']">
                      Your clinic appears in the WaitLess directory immediately, visible to
                      every patient nearby.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <span className="text-4xl text-[#C94F1E] flex-shrink-0">03</span>
                  <div>
                    <h3 className="text-xl text-[#1A1924] mb-2">Manage your queue</h3>
                    <p className="text-[#717182] font-['Outfit']">
                      Use the staff dashboard to call the next patient, skip tokens, or add
                      walk-ins — all in one place.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-[#F6F5F0]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl text-[#1A1924] mb-4">Own a clinic?</h2>
          <p className="text-lg text-[#717182] mb-8 font-['Outfit']">
            List it on WaitLess for free. Let patients see your queue before they
            arrive — less crowding, happier patients.
          </p>
          <Link href="/register-clinic">
            <Button variant="accent" size="lg">
              Register Your Clinic →
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-6 px-6 border-t border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-[#9CA3AF] font-['Outfit']">
            WaitLess · Multi-Clinic Digital Queue Platform · Mumbai
          </p>
        </div>
      </footer>
    </div>
  );
}
