import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import axios from 'axios';
import { Search, Filter, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

export function DrivingLicenses() {
  const [licenses, setLicenses] = useState([]);

  const [showPopup, setShowPopup] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [government, setGovernment] = useState('');
  const [trafficUnit, setTrafficUnit] = useState('');
  const [licenseType, setLicenseType] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [userName, setUserName] = useState('');
  const [nationalId, setNationalId] = useState('');
  // Add these state variables at the top of your component
  const [selectedLicense, setSelectedLicense] = useState(null);
  const [showEditPopup, setShowEditPopup] = useState(false);
  // const [isNationalIdValid, setIsNationalIdValid] = useState(false);


  const [showFilters, setShowFilters] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedLicenseType, setSelectedLicenseType] = useState('');
  const [selectedGovernment, setSelectedGovernment] = useState('');
  const filterPanelRef = useRef(null);

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

  const checkNationalId = (nationalId) => {
    if (nationalId.substring(0, 1) !== "2" && nationalId.substring(0, 1) !== "3") {
      return false;
    }
    const calculateDOB = nationalId.substring(1, 7);
    const year = calculateDOB.substring(0, 2);
    const month = calculateDOB.substring(2, 4);
    const day = calculateDOB.substring(4, 6);

    var dob = new Date(
      `${nationalId[0] === "2" ? "19" : "20"
      }${year}-${month}-${day}`
    );
    // console.log({ dob: dob, year: year, month: month, day: day });
    console.log(dob)
    // const dob = new Date(`20${year}-${month}-${day}`);

    if (dob.toString() === "Invalid Date") {
      console.log(dob);
      return false;
    }
    const age = new Date().getFullYear() - dob.getFullYear();
    // console.log(dob);
    // console.log(age);
    if (age < 18) {
      return false;
    }
    return true;
  }

  const togglePopup = useCallback(() => {
    setShowPopup(prev => !prev);
    if (showPopup) {
      // Reset form fields when closing
      setStartDate('');
      setEndDate('');
      setGovernment('');
      setTrafficUnit('');
      setLicenseType('');
      setLicenseNumber('');
      setUserName('');
      setNationalId('');
      setShowPopup(false);
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
        setLicenses(response.data);
        console.log(response.data)
      } catch (error) {
        console.error('Licenses fetch error:', error);
      }
    };

    fetchLicenses();

  }, []);

  // Add this useEffect for click outside detection
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showFilters && filterPanelRef.current && !filterPanelRef.current.contains(e.target)) {
        setShowFilters(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showFilters]);

  // Add this useEffect for ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && showFilters) {
        setShowFilters(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showFilters]);

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

  // // Enter key handler
  // useEffect(() => {
  //   const handleKeyDown = (e) => {
  //     if (e.key === 'Enter' && showPopup) {
  //       handleAddLicense();
  //     }
  //   };
  //   window.addEventListener('keydown', handleKeyDown);
  //   return () => window.removeEventListener('keydown', handleKeyDown);
  // }, [showPopup]);

  // Filtered licenses calculation
  const filteredLicenses = useMemo(() => {
    return licenses.filter(license => {
      const statusMatch = !selectedStatus ||
        getStatus(license.startDate, license.endDate) === selectedStatus;
      const licenseTypeMatch = !selectedLicenseType ||
        license.licenseType === selectedLicenseType;
      const governmentMatch = !selectedGovernment ||
        license.government === selectedGovernment;

      return statusMatch && licenseTypeMatch && governmentMatch;
    });
  }, [licenses, selectedStatus, selectedLicenseType, selectedGovernment]);


  const handleAddLicense = (e) => {
    if (e) e.preventDefault(); // 👈 Prevent default if called from form submit
    if (!startDate || !endDate || !government || !trafficUnit || !licenseType || !licenseNumber || !userName || !nationalId) {
      toast.error('Please fill in all fields.', { position: "top-right", duration: 4000 });
      return;
    }
    // if (nationalId.length !== 14 && (!checkNationalId(nationalId) || nationalId.substring(0, 1) !== "2" && nationalId.substring(0, 1) !== "3")
    // ) {
    //   toast.error('Invalid National ID',
    //     {
    //       position: 'top-center',
    //       duration: 4000,
    //     }
    //   );
    //   return;
    // }
    var newLicense = {
      startDate,
      endDate,
      government,
      trafficUnit,
      licenseType,
      licenseNumber,
      userName,
      nationalId,
    }
    axios.post('http://localhost:8626/admin/addDrivingLicense', newLicense,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      .then((response) => {
        console.log(response.data.message);
        toast.success(response.data.message,
          {
            position: 'top-center',
            duration: 4000,
          }
        );
        newLicense = { ...newLicense, id: response.data.result.id }
        setLicenses([...licenses, newLicense]);

        togglePopup();
      })
      .catch((error) => {
        console.error(error);
        toast.error(error.response.data.message,
          {
            position: 'top-center',
            duration: 4000,
          });
      })
  };

  // Add these functions for edit/delete operations
  const handleEditLicense = () => {
    axios.patch(`http://localhost:8626/admin/updateDrivingLicense/${selectedLicense.id}`, selectedLicense, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then((response) => {
        toast.success(response.data.message, {
          position: 'top-center',
          duration: 4000,
        });
        setLicenses(licenses.map(license =>
          license.id === selectedLicense.id ? selectedLicense : license
        ));
        setShowEditPopup(false);
      })
      .catch((error) => {
        toast.error(error.response?.data?.error || "An error occurred", {
          position: 'top-center',
          duration: 4000,
        });
      });
  };

  const handleDeleteLicense = () => {
    axios.delete(`http://localhost:8626/admin/deleteDrivingLicense/${selectedLicense.id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then((response) => {
        toast.success(response.data.message, {
          position: 'top-center',
          duration: 4000,
        });
        setLicenses(licenses.filter(license => license.id !== selectedLicense.id));
        setShowEditPopup(false);
      })
      .catch((error) => {
        toast.error(error.response?.data?.error || "An error occurred", {
          position: 'top-center',
          duration: 4000,
        });
      });
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
          <div className="relative" ref={filterPanelRef}>
            <button
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              onClick={() => setShowFilters(prev => !prev)}
            >
              <Filter className="w-5 h-5" />
              <span>Filter</span>
            </button>

            {showFilters && (
              <div className="absolute top-full right-0 mt-2 bg-white border rounded-lg shadow-lg p-4 w-64 z-50 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="">All Statuses</option>
                    <option value="Active">Active</option>
                    <option value="Expired">Expired</option>
                    <option value="Revoked">Revoked</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">License Type</label>
                  <select
                    value={selectedLicenseType}
                    onChange={(e) => setSelectedLicenseType(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="">All Types</option>
                    <option value="A">A - Motorcycle</option>
                    <option value="A1">A1 - Light Motorcycle</option>
                    <option value="B">B - Private Vehicle</option>
                    <option value="BE">BE - Bus</option>
                    <option value="C1">C1 - Taxi</option>
                    <option value="C1E">C1E - Light lorry and tow a trailer</option>
                    <option value="C">C - Commercial Vehicle</option>
                    <option value="D1">D1 - Car</option>
                    <option value="D1E">D1E - Light lorry</option>
                    <option value="D">D - Heavy Equipment</option>
                    <option value="DE">DE - Vehicle</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Government</label>
                  <select
                    value={selectedGovernment}
                    onChange={(e) => setSelectedGovernment(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="">All Governments</option>
                    <option value="Alexandria">Alexandria</option>
                    <option value="Aswan">Aswan</option>
                    <option value="Assiut">Assiut</option>
                    <option value="Beheira">Beheira</option>
                    <option value="Beni Suef">Beni Suef</option>
                    <option value="Cairo">Cairo</option>
                    <option value="Dakahlia">Dakahlia</option>
                    <option value="Damietta">Damietta</option>
                    <option value="Fayoum">Fayoum</option>
                    <option value="Gharbia">Gharbia</option>
                    <option value="Giza">Giza</option>
                    <option value="Ismailia">Ismailia</option>
                    <option value="Kafr el-Sheikh">Kafr el-Sheikh</option>
                    <option value="Matrouh">Matrouh</option>
                    <option value="Minya">Minya</option>
                    <option value="Menofia">Menofia</option>
                    <option value="New Valley">New Valley</option>
                    <option value="North Sinai">North Sinai</option>
                    <option value="Port Said">Port Said</option>
                    <option value="Qualyubia">Qualyubia</option>
                    <option value="Qena">Qena</option>
                    <option value="Red Sea">Red Sea</option>
                    <option value="Al-Sharqia">Al-Sharqia</option>
                    <option value="Soha">Soha</option>
                    <option value="South Sinai">South Sinai</option>
                    <option value="Suez">Suez</option>
                    <option value="Luxor">Luxor</option>
                  </select>
                </div>

                <button
                  onClick={() => {
                    setSelectedStatus('');
                    setSelectedLicenseType('');
                    setSelectedGovernment('');
                  }}
                  className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
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
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">National Number</label>
                  <input
                    type="text"
                    minLength={14}
                    maxLength={14}
                    // value={nationalId}
                    onChange={(e) => {
                      if (e.target.value.length === 14) {
                        // setIsNationalIdValid(checkNationalId(e.target.value));
                        if (checkNationalId(e.target.value)) {
                          setNationalId(e.target.value);
                        } else {
                          toast.error('Invalid National ID',
                            {
                              position: 'top-center',
                              duration: 4000,
                            }
                          );
                        }
                      }
                    }}
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
                  <select
                    name="government"
                    id="government"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    value={government}
                    onChange={(e) => setGovernment(e.target.value)}
                  >
                    <option value="">Select a Government</option>
                    <option value="Alexandria">Alexandria</option>
                    <option value="Aswan">Aswan</option>
                    <option value="Assiut">Assiut</option>
                    <option value="Beheira">Beheira</option>
                    <option value="Beni Suef">Beni Suef</option>
                    <option value="Cairo">Cairo</option>
                    <option value="Dakahlia">Dakahlia</option>
                    <option value="Damietta">Damietta</option>
                    <option value="Fayoum">Fayoum</option>
                    <option value="Gharbia">Gharbia</option>
                    <option value="Giza">Giza</option>
                    <option value="Ismailia">Ismailia</option>
                    <option value="Kafr el-Sheikh">Kafr el-Sheikh</option>
                    <option value="Matrouh">Matrouh</option>
                    <option value="Minya">Minya</option>
                    <option value="Menofia">Menofia</option>
                    <option value="New Valley">New Valley</option>
                    <option value="North Sinai">North Sinai</option>
                    <option value="Port Said">Port Said</option>
                    <option value="Qualyubia">Qualyubia</option>
                    <option value="Qena">Qena</option>
                    <option value="Red Sea">Red Sea</option>
                    <option value="Al-Sharqia">Al-Sharqia</option>
                    <option value="Soha">Soha</option>
                    <option value="South Sinai">South Sinai</option>
                    <option value="Suez">Suez</option>
                    <option value="Luxor">Luxor</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Driving License Unit</label>
                  <input
                    type="text"
                    value={trafficUnit}
                    onChange={(e) => setTrafficUnit(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Driving License Type</label>
                  <select
                    name="drivingLicenseType"
                    id="drivingLicenseType"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    value={licenseType}
                    onChange={(e) => setLicenseType(e.target.value)}
                  >
                    <option value="">Select a License Type</option>
                    <option value="A">A - Motorcycle</option>
                    <option value="A1">A1 - Light Motorcycle</option>
                    <option value="B">B - Private Vehicle</option>
                    <option value="BE">BE - Bus</option>
                    <option value="C1">C1 - Taxi</option>
                    <option value="C1E">C1E - Light lorry and tow a trailer</option>
                    <option value="C">C - Commercial Vehicle</option>
                    <option value="D1">D1 - Car</option>
                    <option value="D1E">D1E - Light lorry</option>
                    <option value="D">D - Heavy Equipment</option>
                    <option value="DE">DE - Vehicle</option>
                  </select>
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
                  type="submit"
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

      {showEditPopup && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && setShowEditPopup(false)}
        >
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl p-8 space-y-6">
            <div className="float-end">
              <button onClick={() => setShowEditPopup(false)}>
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

            <h1 className="text-3xl font-bold text-gray-900 text-center">Edit Driving License</h1>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={selectedLicense?.userName || ''}
                    onChange={(e) => setSelectedLicense({ ...selectedLicense, userName: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">National Number</label>
                  <input
                    type="text"
                    value={selectedLicense?.nationalId || ''}
                    onChange={(e) => setSelectedLicense({ ...selectedLicense, nationalId: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Start Date</label>
                  <input
                    type="date"
                    value={selectedLicense?.startDate?.split('T')[0] || ''}
                    onChange={(e) => setSelectedLicense({ ...selectedLicense, startDate: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">End Date</label>
                  <input
                    type="date"
                    value={selectedLicense?.endDate?.split('T')[0] || ''}
                    onChange={(e) => setSelectedLicense({ ...selectedLicense, endDate: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Government</label>
                  <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    value={selectedLicense?.government || ''}
                    onChange={(e) => setSelectedLicense({ ...selectedLicense, government: e.target.value })}
                  >
                    <option value="">Select a Government</option>
                    <option value="Alexandria">Alexandria</option>
                    <option value="Aswan">Aswan</option>
                    <option value="Assiut">Assiut</option>
                    <option value="Beheira">Beheira</option>
                    <option value="Beni Suef">Beni Suef</option>
                    <option value="Cairo">Cairo</option>
                    <option value="Dakahlia">Dakahlia</option>
                    <option value="Damietta">Damietta</option>
                    <option value="Fayoum">Fayoum</option>
                    <option value="Gharbia">Gharbia</option>
                    <option value="Giza">Giza</option>
                    <option value="Ismailia">Ismailia</option>
                    <option value="Kafr el-Sheikh">Kafr el-Sheikh</option>
                    <option value="Matrouh">Matrouh</option>
                    <option value="Minya">Minya</option>
                    <option value="Menofia">Menofia</option>
                    <option value="New Valley">New Valley</option>
                    <option value="North Sinai">North Sinai</option>
                    <option value="Port Said">Port Said</option>
                    <option value="Qualyubia">Qualyubia</option>
                    <option value="Qena">Qena</option>
                    <option value="Red Sea">Red Sea</option>
                    <option value="Al-Sharqia">Al-Sharqia</option>
                    <option value="Soha">Soha</option>
                    <option value="South Sinai">South Sinai</option>
                    <option value="Suez">Suez</option>
                    <option value="Luxor">Luxor</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Traffic Unit</label>
                  <input
                    type="text"
                    value={selectedLicense?.trafficUnit || ''}
                    onChange={(e) => setSelectedLicense({ ...selectedLicense, trafficUnit: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">License Type</label>
                  <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    value={selectedLicense?.licenseType || ''}
                    onChange={(e) => setSelectedLicense({ ...selectedLicense, licenseType: e.target.value })}
                  >
                    <option value="A">A - Motorcycle</option>
                    <option value="A1">A1 - Light Motorcycle</option>
                    <option value="B">B - Private Vehicle</option>
                    <option value="BE">BE - Bus</option>
                    <option value="C1">C1 - Taxi</option>
                    <option value="C1E">C1E - Light lorry and tow a trailer</option>
                    <option value="C">C - Commercial Vehicle</option>
                    <option value="D1">D1 - Car</option>
                    <option value="D1E">D1E - Light lorry</option>
                    <option value="D">D - Heavy Equipment</option>
                    <option value="DE">DE - Vehicle</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">License Number</label>
                  <input
                    type="text"
                    value={selectedLicense?.licenseNumber || ''}
                    onChange={(e) => setSelectedLicense({ ...selectedLicense, licenseNumber: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditPopup(false)}
                  className="px-6 py-2 rounded-lg font-medium text-gray-700 border border-gray-300 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteLicense}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700"
                >
                  Delete License
                </button>
                <button
                  type="button"
                  onClick={handleEditLicense}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">License</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start Date</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">End Date</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredLicenses.map((license) => (
              <tr key={license.nationalId}>
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
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => {
                      setSelectedLicense(license);
                      setShowEditPopup(true);
                    }}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
            {/* {licenses.map((license) => (
              <tr key={license.id}>
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
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => {
                      setSelectedLicense(license);
                      setShowEditPopup(true);
                    }}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))} */}
          </tbody>
        </table>
      </div>
    </div>
  );
}