import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Layout from '../components/Layout';

function CarLicense() {
    // const [user] = useState(JSON.parse(localStorage.getItem('user')));
    const [showForm, setShowForm] = useState(false);
    const [showRemoveVehicle, setShowRemoveVehicle] = useState(false);
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

    // const [selectedCar, setSelectedCar] = useState('');
    const [selectedPlate, setSelectedPlate] = useState('');
    const [licenses, setLicenses] = useState([]);
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);

    const [overFlow, setOverFlow] = useState('overflow-y-auto');

    const [formData, setFormData] = useState({
        vehicleCategory: '',
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
        licenseStartDate: '',
        licenseEndDate: '',
        engineNumber: '',
        carPlateNumber: '',
        licenseType: '',
        trafficUnit: '',
    });

    useEffect(() => {
        const fetchVehicleData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    toast.error('Please login to view vehicle data');
                    window.location.href = '/login';
                    return;
                }

                const response = await axios.get('http://localhost:8626/users/me/cars', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCars(response.data.userCars);
                setLicenses(response.data.carLicenses);
                // localStorage.setItem('vehicleData', JSON.stringify(response.data));

            } catch (error) {
                console.error('Fetch error:', error);
                toast.error(error.response?.data?.message || 'Failed to load vehicle data');
            } finally {
                setLoading(false);
            }
        };
        // const storedData = localStorage.getItem('vehicleData');
        // if (storedData) {
        //     const parsedData = JSON.parse(storedData);
        //     setCars(parsedData.userCars);
        //     setLicenses(parsedData.carLicenses);
        //     setLoading(false);
        // } else {
        fetchVehicleData();
        // }
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
    }, [formData.brand]);

    useEffect(() => {
        const source = axios.CancelToken.source();

        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:8626/cars/years/${formData.brand}/${formData.model}/${vehicleCategory}`, {
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
    }, [formData.brand, formData.model]);


    useEffect(() => {
        const source = axios.CancelToken.source();

        // Reset arrays when dependencies change
        setCarEngineSizes([]);
        setCarEngineTypes([]);
        setCarBodyTypes([]);
        setCarEngineCylinders([]);

        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:8626/cars/${formData.brand}/${formData.model}/${formData.year}/${vehicleCategory}`,
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


    const combinedData = licenses.map(license => {
        const car = cars.find(c => c.id === license.vehicleId);
        return {
            ...license,
            carDetails: car || {}
        };
    });

    const handleRemoveVehicle = async () => {
        if (!selectedPlate) {
            toast.error('Please select a vehicle first!');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:8626/users/me/cars`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                data: {
                    plateNumber: selectedPlate
                }
            });

            // Find the license to get vehicleId
            const removedLicense = licenses.find(license => license.plateNumber === selectedPlate);
            const vehicleIdToRemove = removedLicense?.vehicleId;

            // Update local state
            const updatedCars = cars.filter(car => car.id !== vehicleIdToRemove);
            const updatedLicenses = licenses.filter(license => license.plateNumber !== selectedPlate);
            setCars(updatedCars);
            setLicenses(updatedLicenses);

            // localStorage.setItem('vehicleData', JSON.stringify({
            //     userCars: updatedCars,
            //     carLicenses: updatedLicenses
            // }));

            toast.success('Vehicle removed successfully!');
        } catch (error) {
            console.error('Delete error:', error);
            toast.error(error.response?.data?.message || 'Failed to remove vehicle');
        } finally {
            setShowRemoveVehicle(false);
            setSelectedPlate('');
        }
    };


    const handleKeyDown = (event) => {
        if (event.keyCode === 27) {
            setShowForm(false);
            setShowRemoveVehicle(false);
        }
    };

    const handleClickOutside = (event) => {
        if (event.target === document.querySelector('.fixed')) {
            setShowForm(false);
            setShowRemoveVehicle(false);
        }
    }

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('click', handleClickOutside);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const sendData = async () => {
        try {
            const carCheck = await axios.post('http://localhost:8626/users/carExists', {
                plateNumber: formData.carPlateNumber,
                motorNumber: formData.engineNumber,
                chassisNumber: formData.chassisNumber,
                checkDate: formData.checkDate,
                startDate: formData.licenseStartDate,
                endDate: formData.licenseEndDate
            });
            console.log('Response:', carCheck.data);
            if (carCheck.status === 200) {
                localStorage.setItem("carLicense", JSON.stringify({
                    ...formData,
                }))
            }
            if (localStorage.getItem("carLicense")) {
                const carLicense = localStorage.getItem("carLicense")
                console.log(JSON.parse(carLicense))
                const addCarLicense = await axios.post('http://localhost:8626/users/me/car', {
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
                    localStorage.removeItem("carLicense")
                }


            }
            return;
        } catch (error) {
            console.error('Error:', error.response?.data || error.message);
            toast.error('Car Already Exists');
        }
    };
    ////////////////////////////////////////////////////////////////////////////////////
    const handleRequest = async () => {
        try {
            const data = {
                "brand": formData.brand,
                "model": formData.model,
                "year": formData.year,
                "engineSize": formData.engineSize,
                "color": formData.color,
                "engineType": formData.engineType,
                "engineCylinder": formData.engineCylinder,
                "bodyType": formData.bodyType,
                "chassisNumber": formData.chassisNumber,
                "engineNumber": formData.engineNumber
            }
            console.log(data)
            const response = await axios.post('http://localhost:8626/users/me/car/request', data,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    },
                }
            )
            if (response.status === 200) {
                setShowForm(false);
                toast.success('Vehicle request sent successfully!');
                window.location.reload();
            }
        }
        catch (error) {
            console.error('Error:', error.response?.data || error.message);
            toast.error('Failed to request vehicle');
        }
        finally {
            setShowForm(false);
        }
    }


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

    // const handleChange = (e) => {
    //     const { name, value } = e.target;
    //     setFormData(prev => ({ ...prev, [name]: value }));
    // };

    const toggleButtons = (type) => {
        setVehicleType(type);
        if (type === 'used') {
            setOverFlow('overflow-y-auto');
        }
        else if (type === 'new') {
            setOverFlow('overflow-hidden');
        }
    };

    if (loading) return <div className="text-center p-8">Loading vehicle data...</div>;

    return (
        <>
            <Layout
                navigation={[
                    { name: 'Dashboard', href: '/dashboard' },
                    { name: 'Driving License', href: '/driving-license-public' },
                    { name: 'Car License', href: '/car-license' },
                    { name: 'Violations', href: '/violations' },
                ]}
            />

            <div className="max-w-6xl mx-auto py-5 px-4">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Vehicle Licenses</h1>
                    <div className="flex space-x-4">
                        <button
                            onClick={() => setShowRemoveVehicle(true)}
                            className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                        >
                            <span>Remove Vehicle</span>
                        </button>
                        <button
                            onClick={() => setShowForm(true)}
                            className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                        >
                            <Plus className="w-5 h-5" />
                            <span>Add Vehicle</span>
                        </button>
                    </div>
                </div>

                {showRemoveVehicle && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold text-gray-800">Remove Vehicle</h2>
                                    <button
                                        onClick={() => setShowRemoveVehicle(false)}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    <div className="prose">
                                        <h3 className="text-lg font-semibold mb-2">Select vehicle to remove</h3>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Select Vehicle
                                        </label>
                                        {/* <select
                                            value={selectedPlate}
                                            onChange={(e) => setSelectedPlate(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                                            required
                                        >
                                            <option value="">Select a Vehicle</option>
                                            {combinedData.map(({ carDetails, plateNumber, vehicleId }) => (
                                                <option key={plateNumber} value={plateNumber}>
                                                    {carDetails.maker} {carDetails.model} ({carDetails.year}) - {plateNumber}
                                                </option>
                                            ))}
                                        </select> */}
                                        <select
                                            value={selectedPlate}
                                            onChange={(e) => setSelectedPlate(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                                            required
                                        >
                                            <option value="">Select a Vehicle</option>
                                            {combinedData.map(({ carDetails, plateNumber }) => (
                                                <option key={plateNumber} value={plateNumber}>
                                                    {carDetails.maker} {carDetails.model} ({carDetails.year}) - {plateNumber}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="flex justify-end space-x-4">
                                        <button
                                            type="button"
                                            onClick={() => setShowRemoveVehicle(false)}
                                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleRemoveVehicle}
                                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                        >
                                            Remove Vehicle
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {showForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6">
                                <div className="flex gap-4 mb-5 justify-center">
                                    <button
                                        className={`${vehicleType === 'used' ? 'bg-[#65ff42]' : 'bg-[#ff4242]'} 
                         text-black rounded-3xl px-6 py-3 focus:outline-none transition-colors duration-300`}
                                        onClick={() => toggleButtons('used')}
                                    >
                                        Used vehicle
                                    </button>
                                    <button
                                        className={`${vehicleType === 'new' ? 'bg-[#65ff42]' : 'bg-[#ff4242]'} 
                         text-black rounded-3xl px-6 py-3 focus:outline-none transition-colors duration-300`}
                                        onClick={() => toggleButtons('new')}
                                    >
                                        New vehicle
                                    </button>
                                </div>

                                <div className={`relative min-h-[500px]  ${overFlow}`}>
                                    {/* Used Vehicle Form */}
                                    <div className={`absolute inset-0 transition-all duration-1000 ease-in-out ${vehicleType === 'used'
                                        ? 'opacity-100 translate-y-0'
                                        : 'opacity-0 translate-y-4 pointer-events-none'
                                        }`}>
                                        <form onSubmit={handleSubmit} className="space-y-5">
                                            <h2 className="text-xl font-bold text-gray-800 leading-7 text-center">
                                                Add Your Vehicle License
                                            </h2>
                                            <div className="grid grid-cols-2 gap-2.5">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
                                                    <select
                                                        value={formData.vehicleCategory}
                                                        onChange={(e) => {
                                                            setFormData({ ...formData, vehicleCategory: e.target.value })
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
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Car Brand</label>
                                                    <select className="
                                                    w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                                        value={formData.brand}
                                                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                                        required
                                                    >
                                                        <option value="">Select a brand</option>
                                                        {carBrands.map((brand) => (
                                                            <option key={brand} value={brand}>{brand}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                                                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg
                                                    focus:ring-2 focus:ring-indigo-500"
                                                        value={formData.model}
                                                        onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                                                        required
                                                    >
                                                        <option value="">Select a model</option>
                                                        {carModels.map((model) => (
                                                            <option key={model} value={model}>{model}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                                                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                                        value={formData.year}
                                                        onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                                        required
                                                    >
                                                        <option value="">Select a year</option>
                                                        {carYears.map((year) => (
                                                            <option key={year} value={year}>{year}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Engine Size</label>
                                                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                                                    focus:ring-2 focus:ring-indigo-500"
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
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Car Color</label>
                                                    <input
                                                        type="text"
                                                        value={formData.color}
                                                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                                        className="w-full px-4 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                                        required
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Engine Type</label>
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
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Engine Cylinder</label>
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
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Body Type</label>
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

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Check Date</label>
                                                    <input
                                                        type="date"
                                                        value={formData.checkDate}
                                                        onChange={(e) => setFormData({ ...formData, checkDate: e.target.value })}
                                                        className="w-full px-4 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                                        required
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Chassis Number</label>
                                                    <input
                                                        type="text"
                                                        value={formData.chassisNumber}
                                                        onChange={(e) => setFormData({ ...formData, chassisNumber: e.target.value })}
                                                        className="w-full px-4 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                                        required
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">License Start Date</label>
                                                    <input
                                                        type="date"
                                                        value={formData.licenseStartDate}
                                                        onChange={(e) => setFormData({ ...formData, licenseStartDate: e.target.value })}
                                                        className="w-full px-4 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                                        required
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">License End Date</label>
                                                    <input
                                                        type="date"
                                                        value={formData.licenseEndDate}
                                                        onChange={(e) => setFormData({ ...formData, licenseEndDate: e.target.value })}
                                                        className="w-full px-4 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                                        required
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Engine Number</label>
                                                    <input
                                                        type="text"
                                                        value={formData.engineNumber}
                                                        onChange={(e) => setFormData({ ...formData, engineNumber: e.target.value })}
                                                        className="w-full px-4 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Plate Number</label>
                                                    <input
                                                        type="text"
                                                        value={formData.carPlateNumber}
                                                        onChange={(e) => setFormData({ ...formData, carPlateNumber: e.target.value })}
                                                        className="w-full px-4 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                                        required
                                                    />
                                                </div>

                                                <div>
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
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Traffic Unit</label>
                                                    <input
                                                        type="text"
                                                        value={formData.trafficUnit}
                                                        onChange={(e) => setFormData({ ...formData, trafficUnit: e.target.value })}
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                                        required
                                                    />
                                                </div>
                                                <div className="justify-center  space-x-4 flex p-2.5 mt-3">
                                                    <button
                                                        type="button"
                                                        // onClick={() => setShowForm(false)}
                                                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                                                    >
                                                        Save License
                                                    </button>
                                                </div>
                                            </div>

                                            {/* <div className="flex justify-end space-x-4 mr-6">
                                                <button
                                                    type="button"
                                                    onClick={() => setShowForm(false)}
                                                    className="px-4 py-1 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                                                >
                                                    Save License
                                                </button>
                                            </div> */}
                                        </form>
                                    </div>

                                    {/* New Vehicle Form */}
                                    <div className={`absolute inset-0 transition-all duration-1000 ease-in-out  ${vehicleType === 'new'
                                        ? 'opacity-100 translate-y-0'
                                        : 'opacity-0 -translate-y-4 pointer-events-none'
                                        }`}>
                                        <div className="space-y-2">

                                            {/* Header */}
                                            <h2 className="text-xl font-bold text-gray-800 leading-7 text-center">
                                                Add Your New Vehicle Data
                                            </h2>

                                            {/* Form Fields */}
                                            <div className="grid grid-cols-2 gap-4">
                                                {/* Vehicle Brand */}
                                                <div className="space-y-1">
                                                    <label className="text-sm text-gray-600 tracking-tight">Vehicle Brand</label>
                                                    <select className="
                                                    w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                                        value={formData.brand}
                                                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                                        required
                                                    >
                                                        <option value="">Select a brand</option>
                                                        {carBrands.map((brand) => (
                                                            <option key={brand} value={brand}>{brand}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                {/* Model */}
                                                <div className="space-y-1">
                                                    <label className="text-sm text-gray-600 tracking-tight">Model</label>
                                                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                                        value={formData.model}
                                                        onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                                                        required
                                                    >
                                                        <option value="">Select a model</option>
                                                        {carModels.map((model) => (
                                                            <option key={model} value={model}>{model}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                {/* Year */}
                                                <div className="space-y-1">
                                                    <label className="text-sm text-gray-600 tracking-tight">Year</label>
                                                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                                        value={formData.year}
                                                        onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                                        required
                                                    >
                                                        <option value="">Select a year</option>
                                                        {carYears.map((year) => (
                                                            <option key={year} value={year}>{year}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                {/* Engine Size */}
                                                <div className="space-y-1">
                                                    <label className="text-sm text-gray-600 tracking-tight">Engine Size</label>
                                                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                                        value={formData.engineSize}
                                                        onChange={(e) => setFormData({ ...formData, engineSize: e.target.value })}
                                                        required
                                                    >
                                                        <option value="">Select Engine Size</option>
                                                        {carEngineSizes.map((engineSize) => (
                                                            <option key={engineSize} value={engineSize}>{engineSize}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                {/* Vehicle Color */}
                                                <div className="space-y-1">
                                                    <label className="text-sm text-gray-600 tracking-tight">Vehicle Color</label>
                                                    <input
                                                        type="text"
                                                        value={formData.color}
                                                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                                        className="w-full px-4 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                                        required
                                                    />                                                </div>

                                                {/* Engine Type */}
                                                <div className="space-y-1">
                                                    <label className="text-sm text-gray-600 tracking-tight">Engine Type</label>
                                                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                                        value={formData.engineType}
                                                        onChange={(e) => setFormData({ ...formData, engineType: e.target.value })}
                                                        required
                                                    >
                                                        <option value="">Select Engine Type</option>
                                                        {carEngineTypes.map((engineType) => (
                                                            <option key={engineType} value={engineType}>{engineType}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                {/* Engine Cylinder */}
                                                <div className="space-y-1">
                                                    <label className="text-sm text-gray-600 tracking-tight">Engine Cylinder</label>
                                                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
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

                                                {/* Body Type */}
                                                <div className="space-y-1">
                                                    <label className="text-sm text-gray-600 tracking-tight">Body Type</label>
                                                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                                        value={formData.bodyType}
                                                        onChange={(e) => setFormData({ ...formData, bodyType: e.target.value })}
                                                        required
                                                    >
                                                        <option value="">Select Body Type</option>
                                                        {carBodyTypes.map((bodyType) => (
                                                            <option key={bodyType} value={bodyType}>{bodyType}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                {/* Chassis Number */}
                                                <div className="space-y-1">
                                                    <label className="text-sm text-gray-600 tracking-tight">Chassis Number</label>
                                                    <input
                                                        type="text"
                                                        value={formData.chassisNumber}
                                                        onChange={(e) => setFormData({ ...formData, chassisNumber: e.target.value })}
                                                        className="w-full px-4 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                                        required
                                                    />
                                                </div>

                                                {/* Engine Number */}
                                                <div className="space-y-1">
                                                    <label className="text-sm text-gray-600 tracking-tight">Engine Number</label>
                                                    <input
                                                        type="text"
                                                        value={formData.engineNumber}
                                                        onChange={(e) => setFormData({ ...formData, engineNumber: e.target.value })}
                                                        className="w-full px-4 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                                        required
                                                    />                                                </div>
                                            </div>

                                            {/* Save Button */}
                                            <div className='text-center'>
                                                <button className="min-w-44 bg-indigo-700 text-white rounded-lg px-4 py-2 hover:bg-indigo-800"
                                                    onClick={handleRequest}
                                                >
                                                    Save Data
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}


                {/* Licenses Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plate Number</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vehicle Details</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vehicle Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">License Period</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {combinedData.map((license) => {
                                const startDate = new Date(license.startDate).toLocaleDateString();
                                const endDate = new Date(license.endDate).toLocaleDateString();
                                const isExpired = new Date(license.endDate) < new Date();

                                return (
                                    <tr key={license.plateNumber}>
                                        <td className="px-6 py-4 whitespace-nowrap font-medium">
                                            {license.plateNumber}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">
                                                {license.carDetails.maker} {license.carDetails.model}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {license.carDetails.year} • {license.carDetails.engineSize}L {license.carDetails.engineType}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{license.carDetails.vehicleType}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{startDate} - {endDate}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${isExpired
                                                ? 'bg-red-100 text-red-800'
                                                : 'bg-green-100 text-green-800'
                                                }`}>
                                                {isExpired ? 'Expired' : 'Active'}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default CarLicense;