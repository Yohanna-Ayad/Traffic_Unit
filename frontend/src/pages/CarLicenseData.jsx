import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, Plus, X } from 'lucide-react';
// import Layout from '../components/Layout';

function CarLicense() {
    const drivingLicense = JSON.parse(localStorage.getItem('user')).hasDrivingLicense;
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
        licenseStartDate: '',
        licenseEndDate: '',
        engineNumber: '',
        carPlateNumber: '',
        licenseType: '',
        trafficUnit: '',
    });

    useEffect(() => {
        const source = axios.CancelToken.source();

        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8626/cars/brands', {
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
    }, []);


    useEffect(() => {
        const source = axios.CancelToken.source();

        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:8626/cars/models/${formData.brand}`, {
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
                const response = await axios.get(`http://localhost:8626/cars/years/${formData.brand}/${formData.model}`, {
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
                    `http://localhost:8626/cars/${formData.brand}/${formData.model}/${formData.year}`,
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

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData, JSON.parse(localStorage.getItem('user')));
        // Here you would typically send the data to your backend
        // window.location.href = '/dashboard';
        // setShowForm(false);
    };

    ////////////////////////////////////////
    // Function to handle keydown event
    const handleKeyDown = (event) => {
        if (event.keyCode === 27) { // Escape key
            setShowForm(false);
        }
    };

    const handleClickOutside = (event) => {
        if (event.target === document.querySelector('.fixed')) {
            setShowForm(false);
        }
    }
    // Add event listener when component mounts
    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('click', handleClickOutside);

        // Remove event listener when component unmounts
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('click', handleClickOutside);
        };
    }, []); // Empty dependency array to ensure this effect runs only once
    /////////////////////////////////////////
    if (brandLoading) return <div>Loading...</div>;
    if (brandError) return <div>Error: {error}</div>;
    if (modelLoading) return <div>Loading...</div>;
    if (modelError) return <div>Error: {error}</div>;
    if (yearLoading) return <div>Loading...</div>;
    if (yearError) return <div>Error: {error}</div>;
    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-800">Add New Car License</h2>
                            <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-700">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Car Brand</label>
                                    <select
                                        value={formData.brand}
                                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        required
                                    >
                                        <option value="">Select Car Brand</option>
                                        {carBrands.map((brand) => (
                                            <option key={brand} value={brand}>{brand}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                                    <select
                                        value={formData.model}
                                        onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        required
                                    >
                                        <option value="">Select Car Model</option>
                                        {carModels.map((model) => (
                                            <option key={model} value={model}>{model}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                                    <select
                                        value={formData.year}
                                        onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        required
                                    >
                                        <option value="">Select Year</option>
                                        {carYears.map((year) => (
                                            <option key={year} value={year}>{year}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Engine Size</label>
                                    <select
                                        value={formData.engineSize}
                                        onChange={(e) => setFormData({ ...formData, engineSize: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        required
                                    >
                                        <option value="">Select Engine Size</option>
                                        {carEngineSizes.map((engineSize) => (
                                            <option key={engineSize} value={engineSize}>{engineSize}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Car Color</label>
                                    <input
                                        type="text"
                                        value={formData.color}
                                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Engine Type</label>
                                    <select
                                        value={formData.engineType}
                                        onChange={(e) => setFormData({ ...formData, engineType: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        required
                                    >
                                        <option value="">Select Engine Type</option>
                                        {carEngineTypes.map((engineType) => (
                                            <option key={engineType} value={engineType}>{engineType}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Engine Cylinder</label>
                                    <select
                                        value={formData.engineCylinder}
                                        onChange={(e) => setFormData({ ...formData, engineCylinder: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
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
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
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
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Chassis Number</label>
                                    <input
                                        type="text"
                                        value={formData.chassisNumber}
                                        onChange={(e) => setFormData({ ...formData, chassisNumber: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">License Start Date</label>
                                    <input
                                        type="date"
                                        value={formData.licenseStartDate}
                                        onChange={(e) => setFormData({ ...formData, licenseStartDate: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">License End Date</label>
                                    <input
                                        type="date"
                                        value={formData.licenseEndDate}
                                        onChange={(e) => setFormData({ ...formData, licenseEndDate: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Engine Number</label>
                                    <input
                                        type="text"
                                        value={formData.engineNumber}
                                        onChange={(e) => setFormData({ ...formData, engineNumber: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Plate Number</label>
                                    <input
                                        type="text"
                                        value={formData.carPlateNumber}
                                        onChange={(e) => setFormData({ ...formData, carPlateNumber: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
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
                                
                            </div>
                            <div className="justify-end  space-x-4 flex p-2.5 mt-3">
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

                        </form>
                    </div>
                </div>
            </div>
            {/* )} */}

            {/* <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr>
                                // <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">License Number</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Car Details</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {licenses.map((license) => (
                                <tr key={license.id}>
                                    // <td className="px-6 py-4">{license.userName}</td>
                                    <td className="px-6 py-4">{license.licenseNumber}</td>
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
            {/* </div> */}
        </>
    );
}

export default CarLicense;
