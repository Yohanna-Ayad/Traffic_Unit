import { useState } from 'react';
import { FileCheck, Car } from 'lucide-react';
import { FormSection } from './FormSection';
import { RadioOption } from './RadioOption';
import { NameInput } from './NameInput';
import { SubmitButton } from './SubmitButton';
import { FormHeader } from './FormHeader';

export default function LicenseForm() {
  const [formData, setFormData] = useState({
    hasDrivingLicense: '',
    hasCarLicense: '',
    name: '',
  });

  const [errors, setErrors] = useState({});

  const validateForm = (data) => {
    const newErrors = {};
    
    if (!data.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!data.hasDrivingLicense) {
      newErrors.hasDrivingLicense = 'Please select your driving license status';
    }
    
    if (!data.hasCarLicense) {
      newErrors.hasCarLicense = 'Please select your car license status';
    }
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validateForm(formData);
    
    if (Object.keys(formErrors).length === 0) {
      console.log('Form submitted:', formData);
      // Handle successful form submission here
      alert('Form submitted successfully!');
    } else {
      setErrors(formErrors);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <FormHeader />

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <NameInput
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <FormSection icon={FileCheck} title="Driving License Status">
                <div className="space-y-3">
                  <RadioOption
                    name="drivingLicense"
                    value="yes"
                    checked={formData.hasDrivingLicense === 'yes'}
                    onChange={(e) => setFormData({ ...formData, hasDrivingLicense: e.target.value })}
                    label="Yes, I have a driving license"
                  />
                  <RadioOption
                    name="drivingLicense"
                    value="no"
                    checked={formData.hasDrivingLicense === 'no'}
                    onChange={(e) => setFormData({ ...formData, hasDrivingLicense: e.target.value })}
                    label="No, I don't have a driving license"
                  />
                </div>
                {errors.hasDrivingLicense && (
                  <p className="mt-2 text-sm text-red-600">{errors.hasDrivingLicense}</p>
                )}
              </FormSection>

              <FormSection icon={Car} title="Car License Status">
                <div className="space-y-3">
                  <RadioOption
                    name="carLicense"
                    value="yes"
                    checked={formData.hasCarLicense === 'yes'}
                    onChange={(e) => setFormData({ ...formData, hasCarLicense: e.target.value })}
                    label="Yes, I have a car license"
                  />
                  <RadioOption
                    name="carLicense"
                    value="no"
                    checked={formData.hasCarLicense === 'no'}
                    onChange={(e) => setFormData({ ...formData, hasCarLicense: e.target.value })}
                    label="No, I don't have a car license"
                  />
                </div>
                {errors.hasCarLicense && (
                  <p className="mt-2 text-sm text-red-600">{errors.hasCarLicense}</p>
                )}
              </FormSection>
            </div>

            <SubmitButton />
          </form>
        </div>
      </div>
    </div>
  );
}