import { useState, useEffect, useRef, useMemo } from 'react';
import axios from 'axios';
import { Search, Filter, Plus, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

export function CarLicenses() {
  const [showForm, setShowForm] = useState(false);
  const [licenses, setLicenses] = useState([]);
  const [selectedLicense, setSelectedLicense] = useState(null);
  const [showEditPopup, setShowEditPopup] = useState(false);

  // Filter states
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const filterPanelRef = useRef(null);

  const [vehicleType, setVehicleType] = useState('used');
  const [vehicleCategory, setVehicleCategory] = useState('car');
  const [brandLoading, setBrandLoading] = useState(true);
  const [brandError, setBrandError] = useState(null);
  const [modelLoading, setModelLoading] = useState(true);
  const [modelError, setModelError] = useState(null);
  const [yearLoading, setYearLoading] = useState(true);
  const [yearError, setYearError] = useState(null);
  const [carBrands, setCarBrands] = useState([]);
  const [carModels, setCarModels] = useState([]);
  const [carYears, setCarYears] = useState([]);
  const [carEngineSizes, setCarEngineSizes] = useState([]);
  const [carEngineTypes, setCarEngineTypes] = useState([]);
  const [carEngineCylinders, setCarEngineCylinders] = useState([]);
  const [carBodyTypes, setCarBodyTypes] = useState([]);
  const [carDataLoading, setCarDataLoading] = useState(true);
  const [carDataError, setCarDataError] = useState(null);

  // import { useState, useEffect } from 'react';
  // import axios from 'axios';
  // import { Search, Filter, Plus, X } from 'lucide-react';
  // import { toast } from 'react-hot-toast';

  // export function CarLicenses() {
  //   const [showForm, setShowForm] = useState(false);
  //   const [licenses, setLicenses] = useState([]);

  //   const filterPanelRef = useRef(null);

  //   const [vehicleType, setVehicleType] = useState('used');
  //   const [vehicleCategory, setVehicleCategory] = useState('car');
  //   const [brandLoading, setBrandLoading] = useState(true);
  //   const [brandError, setBrandError] = useState(null);
  //   const [modelLoading, setModelLoading] = useState(true);
  //   const [modelError, setModelError] = useState(null);
  //   const [yearLoading, setYearLoading] = useState(true);
  //   const [yearError, setYearError] = useState(null);
  //   const [carBrands, setCarBrands] = useState([]);
  //   const [carModels, setCarModels] = useState([]);
  //   const [carYears, setCarYears] = useState([]);
  //   const [carEngineSizes, setCarEngineSizes] = useState([]);
  //   const [carEngineTypes, setCarEngineTypes] = useState([]);
  //   const [carEngineCylinders, setCarEngineCylinders] = useState([]);
  //   const [carBodyTypes, setCarBodyTypes] = useState([]);
  //   const [carDataLoading, setCarDataLoading] = useState(true);
  //   const [carDataError, setCarDataError] = useState(null);

  //   // const [selectedCar, setSelectedCar] = useState('');
  //   const [selectedPlate, setSelectedPlate] = useState('');
  //   const [cars, setCars] = useState([]);
  //   const [loading, setLoading] = useState(true);

  // {
  //   id: '1',
  //   userId: 'U123',
  //   userName: 'John Smith',
  //   plateNumber: 'CL-2024-001',
  //   brand: 'Toyota',
  //   model: 'Camry',
  //   year: '2023',
  //   engineSize: '2.5L',
  //   color: 'Silver',
  //   engineType: 'Petrol',
  //   engineCylinder: '4',
  //   bodyType: 'Sedan',
  //   checkDate: '2024-03-15',
  //   chassisNumber: 'ABC123XYZ456789',
  //   licenseEndDate: '2025-03-15',
  //   engineNumber: 'ENG123456789',
  //   status: 'Active',
  // },

  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: '',
    engineSize: '',
    color: '',
    engineType: '',
    engineCylinder: '',
    bodyType: '',
    checkDate: '',
    chassisNumber: '',
    licenseEndDate: '',
    engineNumber: '',
    userName: '',
    plateNumber: '',
    nationalId: '',
  });


  // Filtered licenses calculation
  const filteredLicenses = useMemo(() => {
    return licenses.filter(license => {
      const statusMatch = !selectedStatus || license.status === selectedStatus;
      return statusMatch;
    });
  }, [licenses, selectedStatus]);

  // const getStatus = (startDate, endDate) => {
  //   if (new Date(startDate) <= new Date() && new Date() <= new Date(endDate)) {
  //     return 'Active';
  //   } else if (new Date() > new Date(endDate)) {
  //     return 'Expired';
  //   } else {
  //     return 'Pending';
  //   }
  // }


  // const getStatus = (startDate, endDate) => {
  //   // Implement logic to calculate license status based on start and end dates
  //   // Return 'Active', 'Expired', or 'Revoked'
  //   if (new Date(startDate) <= new Date() && new Date() <= new Date(endDate)) {
  //     return 'Active';
  //   } else if (new Date() > new Date(endDate)) {
  //     return 'Expired';
  //   } else {
  //     return 'pending';
  //   }
  // }
  useEffect(() => {
    const fetchVehicleData = async () => {
      try {
        const response = await axios.get('http://localhost:8626/admin/getAllCarLicenses', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        console.log(response.data)
        const formattedData = response.data.map(data => ({
          id: data.carLicense.plateNumber,
          userId: data.carLicense.userId,
          userName: data.carLicense.userName,
          nationalId: data.carLicense.nationalId,
          plateNumber: data.carLicense.plateNumber,
          brand: data.vehicle.maker,
          model: data.vehicle.model,
          year: data.vehicle.year,
          engineSize: data.vehicle.engineSize,
          color: data.carLicense.carColor,
          engineType: data.vehicle.engineType,
          engineCylinder: data.vehicle.engineCylinders,
          bodyType: data.vehicle.bodyType,
          checkDate: data.carLicense.checkDate.split('T')[0],
          chassisNumber: data.carLicense.chassisNumber,
          licenseEndDate: data.carLicense.endDate.split('T')[0],
          engineNumber: data.carLicense.motorNumber,
          status: data.carLicense.status,
          // status: getStatus(data.carLicense.startDate, data.carLicense.endDate),
        }));

        setLicenses(formattedData);

        if (response.status === 200) {
          console.log('Vehicle data fetched successfully:', formattedData);
        }
      } catch (error) {
        console.error('Error fetching vehicle data:', error);
      }
    };

    fetchVehicleData();
  }, []);

  useEffect(() => {
    const source = axios.CancelToken.source();

    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8626/cars/brands/${vehicleCategory}`, {
          cancelToken: source.token,
        });
        await setCarBrands(response.data);
      } catch (err) {
        if (!axios.isCancel(err)) setBrandError(err.message);
      } finally {
        setBrandLoading(false);
      }
    };

    fetchData();
    return () => source.cancel('Component unmounted'); // Cleanup on unmount
  }, [vehicleCategory]);


  useEffect(() => {
    const source = axios.CancelToken.source();

    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8626/cars/models/${formData.brand}/${vehicleCategory}`, {
          cancelToken: source.token,
        });
        await setCarModels(response.data);
      } catch (err) {
        if (!axios.isCancel(err) && formData.brand == null) setModelError(err.message);
      } finally {
        setModelLoading(false);
      }
    };

    fetchData();
    return () => source.cancel('Component unmounted'); // Cleanup on unmount
  }, [formData.brand, vehicleCategory]);

  useEffect(() => {
    const source = axios.CancelToken.source();

    const fetchData = async () => {
      try {
        const encodedModel = encodeURIComponent(formData.model); // Fix: Encode the model name
        const response = await axios.get(`http://localhost:8626/cars/years/${formData.brand}/${encodedModel}/${vehicleCategory}`, {
          cancelToken: source.token,
        });
        await setCarYears(response.data);
      } catch (err) {
        if (!axios.isCancel(err) && formData.brand == null && formData.model == null) setYearError(err.message);
      } finally {
        setYearLoading(false);
      }
    };
    fetchData();
    return () => source.cancel('Component unmounted'); // Cleanup on unmount
  }, [formData.brand, formData.model, vehicleCategory]);


  useEffect(() => {
    const source = axios.CancelToken.source();

    // Reset arrays when dependencies change
    setCarEngineSizes([]);
    setCarEngineTypes([]);
    setCarBodyTypes([]);
    setCarEngineCylinders([]);

    const fetchData = async () => {
      try {
        const encodedModel = encodeURIComponent(formData.model); // Fix: Encode the model name
        const response = await axios.get(
          `http://localhost:8626/cars/${formData.brand}/${encodedModel}/${formData.year}/${vehicleCategory}`,
          { cancelToken: source.token }
        );

        // Extract unique values from the response
        const engineSizes = [...new Set(response.data.map(item => item.engineSize))];
        const engineTypes = [...new Set(response.data.map(item => item.engineType))];
        const bodyTypes = [...new Set(response.data.map(item => item.bodyType))];
        const engineCylinders = [...new Set(response.data.map(item => item.engineCylinders))];

        // Update state with unique values
        setCarEngineSizes(engineSizes);
        setCarEngineTypes(engineTypes);
        setCarBodyTypes(bodyTypes);
        setCarEngineCylinders(engineCylinders);

      } catch (err) {
        if (!axios.isCancel(err) && formData.brand && formData.model && formData.year) {
          setCarDataError(err.message);
        }
      } finally {
        setCarDataLoading(false);
      }
    };

    if (formData.brand && formData.model && formData.year) {
      fetchData();
    }

    return () => source.cancel('Component unmounted');
  }, [formData.brand, formData.model, formData.year]); // Re-run when these change



  ////////////////////////////////////////
  // Function to handle keydown event
  const handleKeyDown = (event) => {
    if (event.keyCode === 27) { // Escape key
      if (showForm) setShowForm(false);
      if (showEditPopup) setShowEditPopup(false);
    }
  };

  const handleClickOutside = (event) => {
    const isOutsideForm = event.target === document.querySelector('.fixed') && showForm;
    const isOutsideEditPopup = event.target === document.querySelector('.fixed') && showEditPopup;

    if (isOutsideForm) setShowForm(false);
    if (isOutsideEditPopup) setShowEditPopup(false);
  };

  // Add event listener when component mounts
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('click', handleClickOutside);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('click', handleClickOutside);
    };
  }, [showForm, showEditPopup]);
  /////////////////////////////////////////

  // Click outside detection for filter panel
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showFilters && filterPanelRef.current && !filterPanelRef.current.contains(e.target)) {
        setShowFilters(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showFilters]);

  // ESC key handler for filter panel
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && showFilters) {
        setShowFilters(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showFilters]);

  // Handle edit license
  const handleEditLicense = async () => {
    try {
      const response = await axios.patch(
        `http://localhost:8626/admin/updateCarLicense/${selectedLicense.plateNumber}`,
        selectedLicense,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );

      toast.success('License updated successfully!');
      setLicenses(licenses.map(license =>
        license.id === selectedLicense.id ? selectedLicense : license
      ));
      setShowEditPopup(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update license');
    }
  };

  // Handle delete license
  const handleDeleteLicense = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:8626/admin/deleteCarLicense/${selectedLicense.plateNumber}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );

      toast.success('License deleted successfully!');
      setLicenses(licenses.filter(license => license.id !== selectedLicense.id));
      setShowEditPopup(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete license');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.licenseStartDate > formData.licenseEndDate || formData.licenseStartDate === formData.licenseEndDate) {
      toast.error('License start date cannot be later than or equal to end date.',
        {
          duration: 3000,
          position: 'top-right',
        }
      );
      return;
    }
    if (formData.checkDate < Date.now()) {
      toast.error('Check date cannot be in the past.',
        {
          duration: 3000,
          position: 'top-right',
        }
      );
      return;
    }
    // If all checks pass, display a success message and clear the form
    sendData();
  };

  const sendData = async () => {
    try {
      const licenseStartDate = new Date().toISOString().split('T')[0];
      console.log('License Start Date:', licenseStartDate);
      const carCheck = await axios.post('http://localhost:8626/admin/checkVehicleLicense', {
        plateNumber: formData.plateNumber,
        motorNumber: formData.engineNumber,
        chassisNumber: formData.chassisNumber,
        checkDate: formData.checkDate,
        startDate: licenseStartDate,
        endDate: formData.licenseEndDate
      },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
        }
    );
      console.log('Response:', carCheck.data);
      if (carCheck.status === 200 && carCheck.data.result === false) {
        // localStorage.setItem("carLicense", JSON.stringify({
        //   ...formData,
        // }))
        // }
        // if (localStorage.getItem("carLicense")) {
        // const carLicense = localStorage.getItem("carLicense")
        const carLicense = JSON.stringify({
          ...formData,
        })
        console.log(JSON.parse(carLicense))
        const addCarLicense = await axios.post('http://localhost:8626/admin/addCarLicense', {
          carLicense: JSON.parse(carLicense)
        },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            },
          }
        )
        if (addCarLicense.status === 200) {
          setShowForm(false);
          toast.success('Car added successfully!');
          window.location.reload();
        }


      }
      return;
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to add car license',);
    }
  };


  return (
    <div>
      <div className="flex justify-between items-center space-y-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Car Licenses</h1>
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
                    <option value="Suspended">Suspended</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <button
                  onClick={() => setSelectedStatus('')}
                  className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            <Plus className="w-5 h-5" />
            <span>Add License</span>
          </button>
        </div>
      </div>
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[95vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Register New Vehicle License</h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X className="w-7 h-7" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  {/* User Information */}
                  <div className="space-y-4 col-span-2 border-b pb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Owner Information</h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        value={formData.userName}
                        onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">National ID</label>
                      <input
                        type="number"
                        value={formData.nationalId}
                        // onChange={(e) => setFormData({ ...formData, nationalId: e.target.value })}
                        onChange={(e) => {
                          if (e.target.value.length <= 14) {
                            setFormData({ ...formData, nationalId: e.target.value });
                          }
                        }}
                        onInput={(e) => {
                          if (e.target.value.length > 14) {
                            e.target.value = e.target.value.slice(0, 14);
                          }
                        }}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        placeholder="29901011234567"
                        required
                      />
                    </div>
                  </div>

                  {/* Vehicle Details */}
                  <div className="space-y-4 col-span-2 border-b pb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Vehicle Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
                        <select
                          value={formData.vehicleCategory}
                          onChange={(e) => {
                            setFormData({ ...formData, vehicleCategory: e.target.value })
                            setCarBrands([]);
                            setCarModels([]);
                            setCarYears([]);
                            setCarEngineSizes([]);
                            setCarEngineTypes([]);
                            setCarBodyTypes([]);
                            setCarEngineCylinders([]);
                            setFormData({
                              ...formData,
                              brand: '',
                              model: '',
                              year: '',
                              engineSize: '',
                              engineType: '',
                              engineCylinder: '',
                              bodyType: '',
                              chassisNumber: '',
                              engineNumber: '',
                            });
                            setVehicleCategory(e.target.value);
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                          required
                        >
                          <option value="car">Car</option>
                          <option value="motorcycle">Motorcycle</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                        <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                          value={formData.brand}
                          onChange={(e) => {
                            setCarModels([]);
                            setCarYears([]);
                            setCarEngineSizes([]);
                            setCarEngineTypes([]);
                            setCarBodyTypes([]);
                            setCarEngineCylinders([]);
                            setFormData({
                              ...formData,
                              model: '',
                              year: '',
                              engineSize: '',
                              engineType: '',
                              engineCylinder: '',
                              bodyType: '',
                              chassisNumber: '',
                              engineNumber: '',
                            });
                            setFormData({ ...formData, brand: e.target.value })
                          }}
                          required
                        >
                          <option value="">Select a brand</option>
                          {carBrands.map((brand) => (
                            <option key={brand} value={brand}>{brand}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
                        <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                          value={formData.model}
                          onChange={(e) => {
                            setCarYears([]);
                            setCarEngineSizes([]);
                            setCarEngineTypes([]);
                            setCarBodyTypes([]);
                            setCarEngineCylinders([]);
                            setFormData({
                              ...formData,
                              year: '',
                              engineSize: '',
                              engineType: '',
                              engineCylinder: '',
                              bodyType: '',
                              chassisNumber: '',
                              engineNumber: '',
                            });
                            setFormData({ ...formData, model: e.target.value })
                          }}
                          required
                        >
                          <option value="">Select a model</option>
                          {carModels.map((model) => (
                            <option key={model} value={model}>{model}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                        <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                          value={formData.year}
                          onChange={(e) => {
                            setCarEngineSizes([]);
                            setCarEngineTypes([]);
                            setCarBodyTypes([]);
                            setCarEngineCylinders([]);
                            setFormData({
                              ...formData,
                              engineSize: '',
                              engineType: '',
                              engineCylinder: '',
                              bodyType: '',
                              chassisNumber: '',
                              engineNumber: '',
                            });
                            setFormData({ ...formData, year: e.target.value })
                          }}
                          required
                        >
                          <option value="">Select a year</option>
                          {carYears.map((year) => (
                            <option key={year} value={year}>{year}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Technical Specifications */}
                  <div className="space-y-4 col-span-2 border-b pb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Technical Specifications</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Engine Size</label>
                        <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                          value={formData.engineSize}
                          onChange={(e) => setFormData({ ...formData, engineSize: e.target.value })}
                          required
                        >
                          <option value="">Select an engine size</option>
                          {carEngineSizes.map((size) => (
                            <option key={size} value={size}>{size}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Engine Type</label>
                        <select
                          value={formData.engineType}
                          onChange={(e) => setFormData({ ...formData, engineType: e.target.value })}
                          className="w-full px-4 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                          required
                        >
                          <option value="">Select Engine Type</option>
                          {carEngineTypes.map((type) => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Cylinders</label>
                        <select className="w-full px-4 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                          value={formData.engineCylinder}
                          onChange={(e) => setFormData({ ...formData, engineCylinder: e.target.value })}
                          required
                        >
                          <option value="">Select Engine Cylinder</option>
                          {carEngineCylinders.map((engineCylinder) => (
                            <option key={engineCylinder} value={engineCylinder}>{engineCylinder}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Body Type</label>
                        <select
                          value={formData.bodyType}
                          onChange={(e) => setFormData({ ...formData, bodyType: e.target.value })}
                          className="w-full px-4 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                          required
                        >
                          <option value="">Select Body Type</option>
                          {carBodyTypes.map((bodyType) => (
                            <option key={bodyType} value={bodyType}>{bodyType}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Certification Details */}
                  <div className="space-y-4 col-span-2">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Certification Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Inspection Date</label>
                        <input
                          type="date"
                          value={formData.checkDate}
                          onChange={(e) => setFormData({ ...formData, checkDate: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                        <input
                          type="date"
                          value={formData.licenseEndDate}
                          onChange={(e) => setFormData({ ...formData, licenseEndDate: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Chassis Number</label>
                        <input
                          type="text"
                          value={formData.chassisNumber}
                          onChange={(e) => setFormData({ ...formData, chassisNumber: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Engine Number</label>
                        <input
                          type="text"
                          value={formData.engineNumber}
                          onChange={(e) => setFormData({ ...formData, engineNumber: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">License Plate</label>
                        <input
                          type="text"
                          value={formData.plateNumber}
                          onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                          placeholder="CL-2024-001"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Color</label>
                        <input
                          type="text"
                          value={formData.color}
                          onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                          required
                        />
                      </div>
                      <div className='col-span-2'>
                        <label className="block text-sm font-medium text-gray-700 mb-1">License Type</label>
                        <select
                          value={formData.licenseType}
                          onChange={(e) => setFormData({ ...formData, licenseType: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                          required
                        >
                          <option value="">Select License Type</option>
                          <option value="privateVehicles">private vehicles</option>
                          <option value="taxis">taxis</option>
                          <option value="policeCars">police cars</option>
                          <option value="truck_Tractors">trucks and tractors</option>
                          <option value="commercial">commercial</option>
                          <option value="customs">cars entered through customs</option>
                          <option value="diplomatic">diplomatic</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Register Vehicle
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit License Popup */}
      {showEditPopup && selectedLicense && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[95vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Edit Vehicle License</h2>
                <button
                  onClick={() => setShowEditPopup(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X className="w-7 h-7" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  {/* Owner Information */}
                  <div className="space-y-4 col-span-2 border-b pb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Owner Information</h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        value={selectedLicense.userName}
                        onChange={(e) => setSelectedLicense({ ...selectedLicense, userName: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Vehicle Details */}
                  <div className="space-y-4 col-span-2 border-b pb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Vehicle Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                        <input
                          type="text"
                          value={selectedLicense.brand}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-100"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
                        <input
                          type="text"
                          value={selectedLicense.model}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-100"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                        <input
                          type="text"
                          value={selectedLicense.year}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-100"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                        <input
                          type="text"
                          value={selectedLicense.color}
                          onChange={(e) => setSelectedLicense({ ...selectedLicense, color: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Technical Specifications */}
                  <div className="space-y-4 col-span-2 border-b pb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Technical Specifications</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Engine Size</label>
                        <input
                          type="text"
                          value={selectedLicense.engineSize}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-100"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Engine Type</label>
                        <input
                          type="text"
                          value={selectedLicense.engineType}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-100"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Cylinders</label>
                        <input
                          type="text"
                          value={selectedLicense.engineCylinder}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-100"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Body Type</label>
                        <input
                          type="text"
                          value={selectedLicense.bodyType}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-100"
                          readOnly
                        />
                      </div>
                    </div>
                  </div>

                  {/* Certification Details */}
                  <div className="space-y-4 col-span-2">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Certification Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Inspection Date</label>
                        <input
                          type="date"
                          value={selectedLicense.checkDate}
                          onChange={(e) => setSelectedLicense({ ...selectedLicense, checkDate: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                        <input
                          type="date"
                          value={selectedLicense.licenseEndDate}
                          onChange={(e) => setSelectedLicense({ ...selectedLicense, licenseEndDate: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Chassis Number</label>
                        <input
                          type="text"
                          value={selectedLicense.chassisNumber}
                          onChange={(e) => setSelectedLicense({ ...selectedLicense, chassisNumber: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Engine Number</label>
                        <input
                          type="text"
                          value={selectedLicense.engineNumber}
                          onChange={(e) => setSelectedLicense({ ...selectedLicense, engineNumber: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">License Plate</label>
                        <input
                          type="text"
                          value={selectedLicense.plateNumber}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-100"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">License Status</label>
                        <select
                          value={selectedLicense.status}
                          onChange={(e) => setSelectedLicense({ ...selectedLicense, status: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="Active">Active</option>
                          <option value="Suspended">Suspended</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </div>
                      <div className='col-span-2'>
                        <label className="block text-sm font-medium text-gray-700 mb-1">License Type</label>
                        <select
                          value={selectedLicense.licenseType}
                          onChange={(e) => setSelectedLicense({ ...selectedLicense, licenseType: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="privateVehicles">private vehicles</option>
                          <option value="taxis">taxis</option>
                          <option value="policeCars">police cars</option>
                          <option value="truck_Tractors">trucks and tractors</option>
                          <option value="commercial">commercial</option>
                          <option value="customs">cars entered through customs</option>
                          <option value="diplomatic">diplomatic</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowEditPopup(false)}
                    className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteLicense}
                    className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    onClick={handleEditLicense}
                    className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">License Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Car Details</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredLicenses.map((license) => (
              <tr key={license.id}>
                <td className="px-6 py-4">{license.userName}</td>
                <td className="px-6 py-4">{license.plateNumber}</td>
                <td className="px-6 py-4">
                  {license.brand} {license.model} ({license.year})
                </td>
                <td className="px-6 py-4">{license.checkDate}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${license.status === 'Active' ? 'bg-green-100 text-green-800' :
                    license.status === 'Inactive' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                    {license.status}
                  </span>
                </td>
                <td className="px-6 py-4">
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
          </tbody>
        </table>
      </div>

      {/* <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">License Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Car Details</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {licenses.map((license) => (
              <tr key={license.id}>
                <td className="px-6 py-4">{license.userName}</td>
                <td className="px-6 py-4">{license.plateNumber}</td>
                <td className="px-6 py-4">
                  {license.brand} {license.model} ({license.year})
                </td>
                <td className="px-6 py-4">{license.checkDate}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${license.status === 'Active' ? 'bg-green-100 text-green-800' :
                    license.status === 'Expired' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                    {license.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div> */}
    </div>
  );
}