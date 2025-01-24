import { useState } from 'react';
import { toast } from 'react-hot-toast';
// import Layout from '../components/Layout';

// const drivingLicense = JSON.parse(localStorage.getItem('user')).hasDrivingLicense;

function DrivingLicenseData() {
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    drivingLicenseUnit: '',
    drivingLicenseType: 'A',
    government: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    toast.success('Application submitted successfully!');

    if (JSON.parse(localStorage.getItem('user')).hasCarLicense) {
      window.location.href = '/car-license-data';
    }
    else {
      window.location.href = '/dashboard';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      {/* <Layout
        navigation={[
          { name: 'Dashboard', href: '/dashboard' },
          drivingLicense ? null : { name: 'Driving License', href: '/driving-license' },
          { name: 'Car License', href: '/car-license' },
          { name: 'Violations', href: '/violations' },
          drivingLicense ? null : { name: 'Online Exam', href: '/online-exam' },
          { name: 'Digital Sticker', href: '/digital-sticker' },
        ]}
      /> */}
      <div className="max-w-2xl mx-auto py-5 px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Driving License Application</h1>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
              Start Date
            </label>
            <input
              type="date"
              name="startDate"
              id="startDate"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              value={formData.startDate}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
              End Date
            </label>
            <input
              type="date"
              name="endDate"
              id="endDate"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              value={formData.endDate}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="government" className="block text-sm font-medium text-gray-700">
              Government
            </label>
            <select
              name="government"
              id="government"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              value={formData.government}
              onChange={handleChange}
            >
              <option value="">Select a Government</option>
              <option value="cairo">Cairo</option>
              <option value="giza">Giza</option>
              <option value="alexandria">Alexandria</option>
              <option value="aswan">Aswan</option>
              <option value="luxor">Luxor</option>
              <option value="port-said">Port Said</option>
            </select>
          </div>

          <div>
            <label htmlFor="drivingLicenseUnit" className="block text-sm font-medium text-gray-700">
              Driving License Unit
            </label>
            <input
              type="text"
              name="drivingLicenseUnit"
              id="drivingLicenseUnit"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              value={formData.drivingLicenseUnit}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="drivingLicenseType" className="block text-sm font-medium text-gray-700">
              Driving License Type
            </label>
            <select
              name="drivingLicenseType"
              id="drivingLicenseType"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              value={formData.drivingLicenseType}
              onChange={handleChange}
            >
              <option value="A">A - Motorcycle</option>
              <option value="B">B - Private Vehicle</option>
              <option value="C">C - Commercial Vehicle</option>
              <option value="D">D - Heavy Equipment</option>
              <option value="A1">A1 - Light Motorcycle</option>
            </select>
          </div>

          
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Submit Application
          </button>
        </form>
      </div>
    </>
  );
}

export default DrivingLicenseData;
