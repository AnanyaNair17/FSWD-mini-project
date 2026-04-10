import React from 'react';
import Link from 'next/link';
import { Button } from '../components/Button';

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen">
      {/* How It Works Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl text-center text-[#1A1924] mb-16">
            How WaitLess works
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {/* For Patients */}
            <div>
              <p className="text-sm uppercase tracking-wider text-[#9CA3AF] mb-8 font-['Outfit']">
                FOR PATIENTS
              </p>

              <div className="space-y-8">
                <div className="flex gap-6">
                  <span className="text-5xl text-[#1A6B7C] flex-shrink-0">01</span>
                  <div>
                    <h3 className="text-2xl text-[#1A1924] mb-2">Find your clinic</h3>
                    <p className="text-[#717182] font-['Outfit'] leading-relaxed">
                      Browse clinics near you, filter by specialization and area, and sort by
                      shortest wait time.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <span className="text-5xl text-[#1A6B7C] flex-shrink-0">02</span>
                  <div>
                    <h3 className="text-2xl text-[#1A1924] mb-2">Compare queues</h3>
                    <p className="text-[#717182] font-['Outfit'] leading-relaxed">
                      See live patient counts and colour-coded wait estimates across all
                      clinics before deciding.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <span className="text-5xl text-[#1A6B7C] flex-shrink-0">03</span>
                  <div>
                    <h3 className="text-2xl text-[#1A1924] mb-2">Take your token</h3>
                    <p className="text-[#717182] font-['Outfit'] leading-relaxed">
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
                  <span className="text-5xl text-[#C94F1E] flex-shrink-0">01</span>
                  <div>
                    <h3 className="text-2xl text-[#1A1924] mb-2">Register for free</h3>
                    <p className="text-[#717182] font-['Outfit'] leading-relaxed">
                      Add your clinic profile with doctor details, specialization, working
                      hours, and location in 3 steps.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <span className="text-5xl text-[#C94F1E] flex-shrink-0">02</span>
                  <div>
                    <h3 className="text-2xl text-[#1A1924] mb-2">Get discovered</h3>
                    <p className="text-[#717182] font-['Outfit'] leading-relaxed">
                      Your clinic appears in the WaitLess directory immediately, visible to
                      every patient nearby.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <span className="text-5xl text-[#C94F1E] flex-shrink-0">03</span>
                  <div>
                    <h3 className="text-2xl text-[#1A1924] mb-2">Manage your queue</h3>
                    <p className="text-[#717182] font-['Outfit'] leading-relaxed">
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
      <section className="py-20 px-6 bg-[#F0F9FA]">
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
