import { FileCheck } from 'lucide-react';

export function FormHeader() {
  return (
    <div className="flex items-center justify-center space-x-3 mb-8">
      <FileCheck className="w-8 h-8 text-indigo-600" />
      <h1 className="text-3xl font-bold text-gray-800">License Questionnaire</h1>
    </div>
  );
}