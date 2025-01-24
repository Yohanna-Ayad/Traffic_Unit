import { FormData, FormErrors } from './types';

export function validateForm(data: FormData): FormErrors {
  const errors: FormErrors = {};

  if (!data.name.trim()) {
    errors.name = 'Name is required';
  }

  if (!data.hasDrivingLicense) {
    errors.hasDrivingLicense = 'Please select your driving license status';
  }

  if (!data.hasCarLicense) {
    errors.hasCarLicense = 'Please select your car license status';
  }

  return errors;
}