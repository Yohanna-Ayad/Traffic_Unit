import React from 'react';
import { AlertCircle, DollarSign, CheckCircle } from 'lucide-react';
import Layout from '../components/Layout';

const drivingLicense = JSON.parse(localStorage.getItem('user')).hasDrivingLicense;

const violations = [
  {
    id: 'V001',
    date: '2024-03-15',
    type: 'Speeding',
    location: 'Main Street',
    fine: 150,
    status: 'pending'
  },
  {
    id: 'V002',
    date: '2024-03-10',
    type: 'Red Light',
    location: 'Central Avenue',
    fine: 200,
    status: 'paid'
  },
  {
    id: 'V003',
    date: '2024-03-05',
    type: 'Illegal Parking',
    location: 'Market Square',
    fine: 100,
    status: 'pending'
  }
];

export default function TrafficViolations() {
  return (
    <>
      <Layout navigation={[
        { name: 'Dashboard', href: '/dashboard' },
        drivingLicense ? null : { name: 'Driving License', href: '/driving-license' },
        { name: 'Car License', href: '/car-license' },
        { name: 'Violations', href: '/violations' },
        drivingLicense ? null : { name: 'Online Exam', href: '/online-exam' },
        { name: 'Digital Sticker', href: '/digital-sticker' },
      ]} />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Traffic Violations</h1>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Your Violations</h2>
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                Pay Selected
              </button>
            </div>

            <div className="space-y-4">
              {violations.map((violation) => (
                <div
                  key={violation.id}
                  className="border rounded-lg p-4 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full ${violation.status === 'pending' ? 'bg-red-100' : 'bg-green-100'
                      }`}>
                      {violation.status === 'pending' ? (
                        <AlertCircle className="h-6 w-6 text-red-600" />
                      ) : (
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{violation.type}</h3>
                      <p className="text-sm text-gray-500">
                        {violation.date} - {violation.location}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-gray-900">
                      <DollarSign className="h-5 w-5 text-gray-400" />
                      <span className="font-medium">{violation.fine}</span>
                    </div>
                    {violation.status === 'pending' && (
                      <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                        Pay Now
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 px-6 py-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Total Pending Fines</span>
              <span className="font-medium text-gray-900">$250.00</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

