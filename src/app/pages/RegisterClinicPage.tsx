import React, { useState } from 'react';
import { Input } from '../components/Input';
import { Dropdown } from '../components/Dropdown';
import { Button } from '../components/Button';

export function RegisterClinicPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    clinicName: '',
    doctorName: '',
    specialization: ''
  });

  const specializations = [
    { value: 'general', label: 'General Physician' },
    { value: 'pediatrician', label: 'Pediatrician' },
    { value: 'ent', label: 'ENT Specialist' },
    { value: 'dermatologist', label: 'Dermatologist' },
    { value: 'orthopedic', label: 'Orthopedic' },
    { value: 'dentist', label: 'Dentist' }
  ];

  const steps = [
    { number: 1, label: 'Clinic Details' },
    { number: 2, label: 'Location & Contact' },
    { number: 3, label: 'Staff Login' },
    { number: 4, label: 'Working Hours' }
  ];

  const handleContinue = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12">
          {steps.map((step, index) => (
            <React.Fragment key={step.number}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    step.number === currentStep
                      ? 'bg-[#1A6B7C] text-white'
                      : step.number < currentStep
                      ? 'bg-[#D1FAE5] text-[#065F46]'
                      : 'bg-[#E5E7EB] text-[#9CA3AF]'
                  }`}
                >
                  <span className="font-['Outfit']">{step.number}</span>
                </div>
                <p
                  className={`mt-2 text-sm font-['Outfit'] ${
                    step.number === currentStep
                      ? 'text-[#1A6B7C]'
                      : 'text-[#9CA3AF]'
                  }`}
                >
                  {step.label}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-24 h-0.5 mx-4 mb-6 ${
                    step.number < currentStep ? 'bg-[#1A6B7C]' : 'bg-[#E5E7EB]'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-8 max-w-2xl mx-auto">
          <h2 className="text-3xl text-[#1A1924] mb-2">Clinic Details</h2>
          <p className="text-[#717182] mb-8 font-['Outfit']">Step 1 of 4</p>

          {currentStep === 1 && (
            <div className="space-y-6">
              <Input
                label="CLINIC NAME"
                placeholder="e.g. Sharma General Clinic"
                value={formData.clinicName}
                onChange={(e) =>
                  setFormData({ ...formData, clinicName: e.target.value })
                }
                required
              />

              <Input
                label="DOCTOR NAME"
                placeholder="e.g. Dr. Ramesh Sharma"
                value={formData.doctorName}
                onChange={(e) =>
                  setFormData({ ...formData, doctorName: e.target.value })
                }
                required
              />

              <Dropdown
                label="SPECIALIZATION"
                options={specializations}
                placeholder="General Physician"
                value={formData.specialization}
                onChange={(e) =>
                  setFormData({ ...formData, specialization: e.target.value })
                }
                required
              />
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <Input
                label="ADDRESS"
                placeholder="Clinic address"
                required
              />
              <Input
                label="AREA"
                placeholder="e.g. Andheri"
                required
              />
              <Input
                label="PHONE NUMBER"
                type="tel"
                placeholder="Contact number"
                required
              />
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <Input
                label="CREATE USERNAME"
                placeholder="Choose a username for staff login"
                required
              />
              <Input
                label="CREATE PASSWORD"
                type="password"
                placeholder="Choose a strong password"
                showPasswordToggle
                required
              />
              <Input
                label="CONFIRM PASSWORD"
                type="password"
                placeholder="Re-enter password"
                showPasswordToggle
                required
              />
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <Dropdown
                label="WORKING DAYS"
                options={[
                  { value: 'mon-sat', label: 'Monday - Saturday' },
                  { value: 'mon-fri', label: 'Monday - Friday' },
                  { value: 'tue-sun', label: 'Tuesday - Sunday' },
                  { value: 'all', label: 'All days' }
                ]}
                placeholder="Select working days"
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="OPENING TIME"
                  type="time"
                  required
                />
                <Input
                  label="CLOSING TIME"
                  type="time"
                  required
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8">
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="flex-1"
              >
                Back
              </Button>
            )}
            <Button
              variant="accent"
              onClick={handleContinue}
              className="flex-1"
            >
              {currentStep === 4 ? 'Submit Registration' : 'Continue →'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
