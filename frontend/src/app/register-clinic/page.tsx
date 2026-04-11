"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '../components/Input';
import { Dropdown } from '../components/Dropdown';
import { Button } from '../components/Button';
import { toast } from 'sonner';

export default function RegisterClinicPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    clinicName: '',
    doctorName: '',
    specialization: '',
    address: '',
    area: '',
    phone: '',
    username: '',
    password: '',
    confirmPassword: '',
    workingDays: '',
    openingTime: '',
    closingTime: ''
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      console.log("Submitting formData:", { ...formData }); // Log shallow copy to avoid circular issues in devtools
      
      const response = await fetch('http://localhost:5000/api/clinics/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      toast.success("Clinic registered successfully!");
      router.push('/staff-login?registered=true');
    } catch (error: any) {
      console.error("Submission Error:", error);
      toast.error(error.message || "Failed to submit registration. Please check the console.");
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
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
          <h2 className="text-3xl text-[#1A1924] mb-2">{steps[currentStep-1].label}</h2>
          <p className="text-[#717182] mb-8 font-['Outfit']">Step {currentStep} of 4</p>

          {currentStep === 1 && (
            <div className="space-y-6">
              <Input
                label="CLINIC NAME"
                name="clinicName"
                placeholder="e.g. Sharma General Clinic"
                value={formData.clinicName}
                onChange={handleChange}
                required
              />
              <Input
                label="DOCTOR NAME"
                name="doctorName"
                placeholder="e.g. Dr. Ramesh Sharma"
                value={formData.doctorName}
                onChange={handleChange}
                required
              />
              <Dropdown
                label="SPECIALIZATION"
                name="specialization"
                options={specializations}
                placeholder="General Physician"
                value={formData.specialization}
                onChange={handleChange}
                required
              />
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <Input
                label="ADDRESS"
                name="address"
                placeholder="Clinic address"
                value={formData.address}
                onChange={handleChange}
                required
              />
              <Input
                label="AREA"
                name="area"
                placeholder="e.g. Andheri"
                value={formData.area}
                onChange={handleChange}
                required
              />
              <Input
                label="PHONE NUMBER"
                name="phone"
                type="tel"
                placeholder="Contact number"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <Input
                label="CREATE USERNAME"
                name="username"
                placeholder="Choose a username for staff login"
                value={formData.username}
                onChange={handleChange}
                required
              />
              <Input
                label="CREATE PASSWORD"
                name="password"
                type="password"
                placeholder="Choose a strong password"
                showPasswordToggle
                value={formData.password}
                onChange={handleChange}
                required
              />
              <Input
                label="CONFIRM PASSWORD"
                name="confirmPassword"
                type="password"
                placeholder="Re-enter password"
                showPasswordToggle
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <Dropdown
                label="WORKING DAYS"
                name="workingDays"
                options={[
                  { value: 'mon-sat', label: 'Monday - Saturday' },
                  { value: 'mon-fri', label: 'Monday - Friday' },
                  { value: 'tue-sun', label: 'Tuesday - Sunday' },
                  { value: 'all', label: 'All days' }
                ]}
                placeholder="Select working days"
                value={formData.workingDays}
                onChange={handleChange}
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="OPENING TIME"
                  name="openingTime"
                  type="time"
                  value={formData.openingTime}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="CLOSING TIME"
                  name="closingTime"
                  type="time"
                  value={formData.closingTime}
                  onChange={handleChange}
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
                disabled={loading}
              >
                Back
              </Button>
            )}
            <Button
              variant="accent"
              onClick={handleContinue}
              className="flex-1"
              disabled={loading}
            >
              {loading ? 'Processing...' : currentStep === 4 ? 'Submit Registration' : 'Continue →'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
