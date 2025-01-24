export interface FormData {
  hasDrivingLicense: string;
  hasCarLicense: string;
  name: string;
}

export interface FormErrors {
  name?: string;
  hasDrivingLicense?: string;
  hasCarLicense?: string;
}