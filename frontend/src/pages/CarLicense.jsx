// import { useState,useEffect } from 'react';
// import { Search, Filter, Plus, X } from 'lucide-react';
// import Layout from '../components/Layout';

// function CarLicense() {
//     const drivingLicense = JSON.parse(localStorage.getItem('user')).hasDrivingLicense;

//     const [showForm, setShowForm] = useState(false);
//     const [licenses] = useState([
//         {
//             id: '1',
//             // userId: 'U123',
//             // userName: 'John Smith',
//             licenseNumber: 'CL-2024-001',
//             brand: 'Toyota',
//             model: 'Camry',
//             year: '2023',
//             engineSize: '2.5L',
//             color: 'Silver',
//             engineType: 'Petrol',
//             engineCylinder: '4',
//             bodyType: 'Sedan',
//             checkDate: '2024-03-15',
//             chassisNumber: 'ABC123XYZ456789',
//             licenseEndDate: '2025-03-15',
//             engineNumber: 'ENG123456789',
//             status: 'Active',
//         },
//     ]);

//     const [formData, setFormData] = useState({
//         brand: '',
//         model: '',
//         year: '',
//         engineSize: '',
//         color: '',
//         engineType: '',
//         engineCylinder: '',
//         bodyType: '',
//         checkDate: '',
//         chassisNumber: '',
//         licenseEndDate: '',
//         engineNumber: '',
//     });

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         console.log('Form submitted:', formData);
//         setShowForm(false);
//         // Handle form submission here
//         console.log('Form submitted:', formData);
//     };

//       ////////////////////////////////////////
//       // Function to handle keydown event
//       const handleKeyDown = (event) => {
//         if (event.keyCode === 27) { // Escape key
//           setShowForm(false);
//         }
//       };
    
//       const handleClickOutside = (event) => {
//         if (event.target === document.querySelector('.fixed')) {
//           setShowForm(false);
//         }
//       }
//       // Add event listener when component mounts
//       useEffect(() => {
//         window.addEventListener('keydown', handleKeyDown);
//         window.addEventListener('click', handleClickOutside);
    
//         // Remove event listener when component unmounts
//         return () => {
//           window.removeEventListener('keydown', handleKeyDown);
//           window.removeEventListener('click', handleClickOutside);
//         };
//       }, []); // Empty dependency array to ensure this effect runs only once
//     /////////////////////////////////////////

//     return (
//         <>
//             <Layout
//                 navigation={[
//                     { name: 'Dashboard', href: '/dashboard' },
//                     drivingLicense ? null : { name: 'Driving License', href: '/driving-license' },
//                     { name: 'Car License', href: '/car-license' },
//                     { name: 'Violations', href: '/violations' },
//                     // drivingLicense ? null : { name: 'Online Exam', href: '/online-exam' },
//                     { name: 'Digital Sticker', href: '/digital-sticker' },
//                 ].filter(Boolean)}
//             />
//             <div className="max-w-6xl mx-auto py-5 px-4">
//                 <div className="flex justify-between items-center mb-6">
//                     <h1 className="text-2xl font-bold text-gray-800">Car License</h1>
//                     <div className="flex space-x-4">
//                         {/* <div className="relative">
//                             <input
//                                 type="text"
//                                 placeholder="Search licenses..."
//                                 className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
//                             />
//                             <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
//                         </div> */}
//                         <button
//                             onClick={() => setShowForm(true)}
//                             className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
//                         >
//                             <Plus className="w-5 h-5" />
//                             <span>Add License</span>
//                         </button>
//                     </div>
//                 </div>

//                 {showForm && (
//                     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
//                         <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//                             <div className="p-6">
//                                 <div className="flex justify-between items-center mb-6">
//                                     <h2 className="text-xl font-bold text-gray-800">Add New Car License</h2>
//                                     <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-700">
//                                         <X className="w-6 h-6" />
//                                     </button>
//                                 </div>

//                                 <form onSubmit={handleSubmit} className="space-y-6">
//                                     <div className="grid grid-cols-2 gap-6">
//                                         <div>
//                                             <label className="block text-sm font-medium text-gray-700 mb-1">Car Brand</label>
//                                             <input
//                                                 type="text"
//                                                 value={formData.brand}
//                                                 onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
//                                                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
//                                                 required
//                                             />
//                                         </div>

//                                         <div>
//                                             <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
//                                             <input
//                                                 type="text"
//                                                 value={formData.model}
//                                                 onChange={(e) => setFormData({ ...formData, model: e.target.value })}
//                                                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
//                                                 required
//                                             />
//                                         </div>

//                                         <div>
//                                             <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
//                                             <input
//                                                 type="number"
//                                                 min="1900"
//                                                 max={new Date().getFullYear()}
//                                                 value={formData.year}
//                                                 onChange={(e) => setFormData({ ...formData, year: e.target.value })}
//                                                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
//                                                 required
//                                             />
//                                         </div>

//                                         <div>
//                                             <label className="block text-sm font-medium text-gray-700 mb-1">Engine Size</label>
//                                             <input
//                                                 type="text"
//                                                 value={formData.engineSize}
//                                                 onChange={(e) => setFormData({ ...formData, engineSize: e.target.value })}
//                                                 placeholder="e.g., 2.0L"
//                                                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
//                                                 required
//                                             />
//                                         </div>

//                                         <div>
//                                             <label className="block text-sm font-medium text-gray-700 mb-1">Car Color</label>
//                                             <input
//                                                 type="text"
//                                                 value={formData.color}
//                                                 onChange={(e) => setFormData({ ...formData, color: e.target.value })}
//                                                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
//                                                 required
//                                             />
//                                         </div>

//                                         <div>
//                                             <label className="block text-sm font-medium text-gray-700 mb-1">Engine Type</label>
//                                             <select
//                                                 value={formData.engineType}
//                                                 onChange={(e) => setFormData({ ...formData, engineType: e.target.value })}
//                                                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
//                                                 required
//                                             >
//                                                 <option value="">Select Engine Type</option>
//                                                 <option value="Petrol">Petrol</option>
//                                                 <option value="Diesel">Diesel</option>
//                                                 <option value="Electric">Electric</option>
//                                                 <option value="Hybrid">Hybrid</option>
//                                             </select>
//                                         </div>

//                                         <div>
//                                             <label className="block text-sm font-medium text-gray-700 mb-1">Engine Cylinder</label>
//                                             <input
//                                                 type="number"
//                                                 min="1"
//                                                 value={formData.engineCylinder}
//                                                 onChange={(e) => setFormData({ ...formData, engineCylinder: e.target.value })}
//                                                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
//                                                 required
//                                             />
//                                         </div>

//                                         <div>
//                                             <label className="block text-sm font-medium text-gray-700 mb-1">Body Type</label>
//                                             <select
//                                                 value={formData.bodyType}
//                                                 onChange={(e) => setFormData({ ...formData, bodyType: e.target.value })}
//                                                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
//                                                 required
//                                             >
//                                                 <option value="">Select Body Type</option>
//                                                 <option value="Sedan">Sedan</option>
//                                                 <option value="SUV">SUV</option>
//                                                 <option value="Hatchback">Hatchback</option>
//                                                 <option value="Coupe">Coupe</option>
//                                                 <option value="Truck">Truck</option>
//                                                 <option value="Van">Van</option>
//                                             </select>
//                                         </div>

//                                         <div>
//                                             <label className="block text-sm font-medium text-gray-700 mb-1">Check Date</label>
//                                             <input
//                                                 type="date"
//                                                 value={formData.checkDate}
//                                                 onChange={(e) => setFormData({ ...formData, checkDate: e.target.value })}
//                                                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
//                                                 required
//                                             />
//                                         </div>

//                                         <div>
//                                             <label className="block text-sm font-medium text-gray-700 mb-1">Chassis Number</label>
//                                             <input
//                                                 type="text"
//                                                 value={formData.chassisNumber}
//                                                 onChange={(e) => setFormData({ ...formData, chassisNumber: e.target.value })}
//                                                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
//                                                 required
//                                             />
//                                         </div>

//                                         <div>
//                                             <label className="block text-sm font-medium text-gray-700 mb-1">License End Date</label>
//                                             <input
//                                                 type="date"
//                                                 value={formData.licenseEndDate}
//                                                 onChange={(e) => setFormData({ ...formData, licenseEndDate: e.target.value })}
//                                                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
//                                                 required
//                                             />
//                                         </div>

//                                         <div>
//                                             <label className="block text-sm font-medium text-gray-700 mb-1">Engine Number</label>
//                                             <input
//                                                 type="text"
//                                                 value={formData.engineNumber}
//                                                 onChange={(e) => setFormData({ ...formData, engineNumber: e.target.value })}
//                                                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
//                                                 required
//                                             />
//                                         </div>
//                                     </div>

//                                     <div className="flex justify-end space-x-4">
//                                         <button
//                                             type="button"
//                                             onClick={() => setShowForm(false)}
//                                             className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
//                                         >
//                                             Cancel
//                                         </button>
//                                         <button
//                                             type="submit"
//                                             className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
//                                         >
//                                             Save License
//                                         </button>
//                                     </div>
//                                 </form>
//                             </div>
//                         </div>
//                     </div>
//                 )}

//                 <div className="bg-white rounded-lg shadow overflow-hidden">
//                     <table className="min-w-full divide-y divide-gray-200">
//                         <thead>
//                             <tr>
//                                 {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th> */}
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">License Number</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Car Details</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check Date</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
//                             </tr>
//                         </thead>
//                         <tbody className="divide-y divide-gray-200">
//                             {licenses.map((license) => (
//                                 <tr key={license.id}>
//                                     {/* <td className="px-6 py-4">{license.userName}</td> */}
//                                     <td className="px-6 py-4">{license.licenseNumber}</td>
//                                     <td className="px-6 py-4">
//                                         {license.brand} {license.model} ({license.year})
//                                     </td>
//                                     <td className="px-6 py-4">{license.checkDate}</td>
//                                     <td className="px-6 py-4">
//                                         <span className={`px-2 py-1 rounded-full text-xs font-medium ${license.status === 'Active' ? 'bg-green-100 text-green-800' :
//                                                 license.status === 'Expired' ? 'bg-red-100 text-red-800' :
//                                                     'bg-yellow-100 text-yellow-800'
//                                             }`}>
//                                             {license.status}
//                                         </span>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         </>
//     );
// }

// export default CarLicense;

import { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Layout from '../components/Layout';

function CarLicense() {
    const user = JSON.parse(localStorage.getItem('user'));
    const drivingLicense = user ? user.hasDrivingLicense : false;
    const [showForm, setShowForm] = useState(false);
    const [showDigitalStickerModal, setShowDigitalStickerModal] = useState(false);
    const [selectedCar, setSelectedCar] = useState('');
    
    const [licenses] = useState([
        {
            id: '1',
            licenseNumber: 'CL-2024-001',
            brand: 'Toyota',
            model: 'Camry',
            year: '2023',
            engineSize: '2.5L',
            color: 'Silver',
            engineType: 'Petrol',
            engineCylinder: '4',
            bodyType: 'Sedan',
            checkDate: '2024-03-15',
            chassisNumber: 'ABC123XYZ456789',
            licenseEndDate: '2025-03-15',
            engineNumber: 'ENG123456789',
            status: 'Active',
        },
        {
            id: '2',
            licenseNumber: 'CL-2023-045',
            brand: 'Honda',
            model: 'Civic',
            year: '2022',
            engineSize: '1.8L',
            color: 'Red',
            engineType: 'Petrol',
            engineCylinder: '4',
            bodyType: 'Sedan',
            checkDate: '2023-12-01',
            chassisNumber: 'HONDA2345XYZ678',
            licenseEndDate: '2024-12-01',
            engineNumber: 'ENG987654321',
            status: 'Active',
        }
    ]);

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
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        toast.success('New license added successfully!');
        setShowForm(false);
        setFormData({
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
        });
    };

    const handleKeyDown = (event) => {
        if (event.keyCode === 27) {
            setShowForm(false);
            setShowDigitalStickerModal(false);
        }
    };
  
    const handleClickOutside = (event) => {
        if (event.target === document.querySelector('.fixed')) {
            setShowForm(false);
            setShowDigitalStickerModal(false);
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

    const handleDigitalStickerRequest = () => {
        if (!selectedCar) {
            toast.error('Please select a car first!');
            return;
        }
        
        setTimeout(() => {
            if (Math.random() > 0.2) {
                toast.success('Digital sticker request submitted successfully!');
            } else {
                toast.error('Failed to submit request. Please try again.');
            }
            setShowDigitalStickerModal(false);
            setSelectedCar('');
        }, 1000);
    };

    return (
        <>
            <Layout
                navigation={[
                    { name: 'Dashboard', href: '/dashboard' },
                    drivingLicense ? null : { name: 'Driving License', href: '/driving-license' },
                    { name: 'Car License', href: '/car-license' },
                    { name: 'Violations', href: '/violations' },
                    // { name: 'Digital Sticker', href: '/digital-sticker' },
                ].filter(Boolean)}
            />
            <div className="max-w-6xl mx-auto py-5 px-4">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Car License</h1>
                    <div className="flex space-x-4">
                        <button
                            onClick={() => setShowDigitalStickerModal(true)}
                            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                        >
                            <span>Digital Sticker</span>
                        </button>
                        <button
                            onClick={() => setShowForm(true)}
                            className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                        >
                            <Plus className="w-5 h-5" />
                            <span>Add License</span>
                        </button>
                    </div>
                </div>

                {/* Digital Sticker Modal */}
                {showDigitalStickerModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold text-gray-800">Digital Sticker Request</h2>
                                    <button 
                                        onClick={() => setShowDigitalStickerModal(false)} 
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    <div className="prose">
                                        <h3 className="text-lg font-semibold mb-2">How to Extract Digital Sticker:</h3>
                                        <ol className="list-decimal pl-6 space-y-2">
                                            <li>Select your vehicle from the list below</li>
                                            <li>Verify your vehicle information is correct</li>
                                            <li>Click "Request Digital Sticker"</li>
                                            <li>Wait for confirmation email/SMS</li>
                                            <li>You can get to the traffic unit to get your digital sticker</li>
                                            {/* <li>Download sticker from your dashboard once approved</li> */}
                                        </ol>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Select Vehicle
                                        </label>
                                        <select
                                            value={selectedCar}
                                            onChange={(e) => setSelectedCar(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                            required
                                        >
                                            <option value="">Select a Vehicle</option>
                                            {licenses.map((car) => (
                                                <option key={car.id} value={car.id}>
                                                    {car.brand} {car.model} ({car.year}) - {car.licenseNumber}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="flex justify-end space-x-4">
                                        <button
                                            type="button"
                                            onClick={() => setShowDigitalStickerModal(false)}
                                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleDigitalStickerRequest}
                                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                        >
                                            Request Digital Sticker
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Add License Modal */}
                {showForm && (
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
                                            <input
                                                type="text"
                                                value={formData.brand}
                                                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                                            <input
                                                type="text"
                                                value={formData.model}
                                                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                                            <input
                                                type="number"
                                                min="1900"
                                                max={new Date().getFullYear()}
                                                value={formData.year}
                                                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Engine Size</label>
                                            <input
                                                type="text"
                                                value={formData.engineSize}
                                                onChange={(e) => setFormData({ ...formData, engineSize: e.target.value })}
                                                placeholder="e.g., 2.0L"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                                required
                                            />
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
                                                <option value="Petrol">Petrol</option>
                                                <option value="Diesel">Diesel</option>
                                                <option value="Electric">Electric</option>
                                                <option value="Hybrid">Hybrid</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Engine Cylinder</label>
                                            <input
                                                type="number"
                                                min="1"
                                                value={formData.engineCylinder}
                                                onChange={(e) => setFormData({ ...formData, engineCylinder: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                                required
                                            />
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
                                                <option value="Sedan">Sedan</option>
                                                <option value="SUV">SUV</option>
                                                <option value="Hatchback">Hatchback</option>
                                                <option value="Coupe">Coupe</option>
                                                <option value="Truck">Truck</option>
                                                <option value="Van">Van</option>
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
                                    </div>

                                    <div className="flex justify-end space-x-4">
                                        <button
                                            type="button"
                                            onClick={() => setShowForm(false)}
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
                )}

                {/* Licenses Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">License Number</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Car Details</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {licenses.map((license) => (
                                <tr key={license.id}>
                                    <td className="px-6 py-4">{license.licenseNumber}</td>
                                    <td className="px-6 py-4">
                                        {license.brand} {license.model} ({license.year})
                                    </td>
                                    <td className="px-6 py-4">{license.checkDate}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            license.status === 'Active' ? 'bg-green-100 text-green-800' :
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
                </div>
            </div>
        </>
    );
}

export default CarLicense;