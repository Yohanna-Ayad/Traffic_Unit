import React, { useState } from 'react';
import { CreditCard, Car, Calendar } from 'lucide-react';
import Layout from '../components/Layout'

const drivingLicense = JSON.parse(localStorage.getItem('user')).hasDrivingLicense;

export default function DigitalSticker() {
  const [vehicleInfo, setVehicleInfo] = useState({
    plateNumber: '',
    model: '',
    year: '',
    color: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Digital sticker application submitted successfully!');
  };
  
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Digital Vehicle Sticker</h1>

        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <Car className="h-6 w-6 text-blue-600" />
                <h3 className="font-medium text-blue-900">Vehicle Details</h3>
              </div>
              <p className="mt-2 text-sm text-blue-600">Enter your vehicle information</p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <Calendar className="h-6 w-6 text-green-600" />
                <h3 className="font-medium text-green-900">Validity Period</h3>
              </div>
              <p className="mt-2 text-sm text-green-600">12 months from issue date</p>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <CreditCard className="h-6 w-6 text-purple-600" />
                <h3 className="font-medium text-purple-900">Digital Format</h3>
              </div>
              <p className="mt-2 text-sm text-purple-600">Accessible via mobile app</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  License Plate Number
                </label>
                <input
                  type="text"
                  value={vehicleInfo.plateNumber}
                  onChange={(e) => setVehicleInfo({ ...vehicleInfo, plateNumber: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Vehicle Model
                </label>
                <input
                  type="text"
                  value={vehicleInfo.model}
                  onChange={(e) => setVehicleInfo({ ...vehicleInfo, model: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Manufacturing Year
                </label>
                <input
                  type="number"
                  value={vehicleInfo.year}
                  onChange={(e) => setVehicleInfo({ ...vehicleInfo, year: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Vehicle Color
                </label>
                <input
                  type="text"
                  value={vehicleInfo.color}
                  onChange={(e) => setVehicleInfo({ ...vehicleInfo, color: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-medium text-gray-900">Digital Sticker Fee</h4>
                  <p className="text-sm text-gray-500">Annual registration fee includes digital sticker</p>
                </div>
                <span className="text-2xl font-bold text-gray-900">$75.00</span>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                Apply for Digital Sticker
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}