import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Search, Filter, Plus } from 'lucide-react';

export function DrivingLicenses() {
  const [licenses, setLicenses] = useState([]);

  const [showPopup, setShowPopup] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [government, setGovernment] = useState('');
  const [unit, setUnit] = useState('');
  const [licenseType, setLicenseType] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [name, setName] = useState('');
  const [nationalNumber, setNationalNumber] = useState('');

  const getStatus = (startDate, endDate) => {
    // Implement logic to calculate license status based on start and end dates
    // Return 'Active', 'Expired', or 'Revoked'
    if (new Date(startDate) <= new Date() && new Date() <= new Date(endDate)) {
      return 'Active';
    } else if (new Date() > new Date(endDate)) {
      return 'Expired';
    } else {
      return 'Revoked';
    }
  }

  const togglePopup = useCallback(() => {
    setShowPopup(prev => !prev);
    if (showPopup) {
      // Reset form fields when closing
      setStartDate('');
      setEndDate('');
      setGovernment('');
      setUnit('');
      setLicenseType('');
      setLicenseNumber('');
    }
  }, [showPopup]);


  useEffect(() => {
    const fetchLicenses = async () => {
      try {
        const response = await axios.get('http://localhost:8626/admin/getAllDrivingLicenses',
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          }
        );
        // Example data:
        // {
        //   id: '1',
        //   userId: 'U123',
        //   userName: 'John Smith',
        //   licenseNumber: 'DL-2024-001',
        //   issueDate: '2024-01-01',
        //   expiryDate: '2029-01-01',
        //   status: 'Active',
        // },

        setLicenses(response.data);
        console.log(response.data)
      } catch (error) {
        console.error('Licenses fetch error:', error);
      }
    };

    fetchLicenses();

  }, []);


  // ESC key handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && showPopup) {
        togglePopup();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showPopup, togglePopup]);




  const handleAddLicense = () => {
    
    setLicenses([...licenses, newLicense]);
    togglePopup();
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Driving Licenses</h1>
        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search licenses..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="w-5 h-5" />
            <span>Filter</span>
          </button>
          <button
            className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            onClick={togglePopup}
          >
            <Plus className="w-5 h-5" />
            <span>Add License</span>
          </button>
        </div>
      </div>

      {/* License Popup */}
      {showPopup && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && togglePopup()}
        >
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl p-8 space-y-6">
            <div className="float-end">
              <button onClick={togglePopup}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-700 hover:text-gray-900"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 text-center">Add Driving License</h1>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">National Number</label>
                  <input
                    type="text"
                    value={nationalNumber}
                    onChange={(e) => setNationalNumber(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Government</label>
                  <input
                    type="text"
                    value={government}
                    onChange={(e) => setGovernment(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Driving License Unit</label>
                  <input
                    type="text"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Driving License Type</label>
                  <input
                    type="text"
                    value={licenseType}
                    onChange={(e) => setLicenseType(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">License Number</label>
                  <input
                    type="text"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={togglePopup}
                  className="px-6 py-2 rounded-lg font-medium text-gray-700 border border-gray-300 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddLicense}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                >
                  Submit Application
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          {/* ... existing table content ... */}
          <tbody className="divide-y divide-gray-200">
            {licenses.map((license) => (
              <tr key={license.userId}>
                <td className="px-6 py-4 whitespace-nowrap">{license.userName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{license.licenseType}-{license.licenseNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap">{license.startDate.split('T')[0]}</td>
                <td className="px-6 py-4 whitespace-nowrap">{license.endDate.split('T')[0]}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatus(license.startDate, license.endDate) === 'Active' ? 'bg-green-100 text-green-800' :
                    getStatus(license.startDate, license.endDate) === 'Expired' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                    {getStatus(license.startDate, license.endDate)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}