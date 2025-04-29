import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, X } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import Layout from '../components/Layout';
import DrivingLicenseData from './DrivingLicenseData'; // Import your form component

function DrivingLicense() {
    const user = JSON.parse(localStorage.getItem('user'));
    const [showAddModal, setShowAddModal] = useState(false);
    const [showExistingLicenseForm, setShowExistingLicenseForm] = useState(false);
    const [showNewLicenseForm, setShowNewLicenseForm] = useState(false);
    const [licenses, setLicenses] = useState([]);
    const [showApprovedCourse, setShowApprovedCourse] = useState(false);
    // const [approvedCourse, setApprovedCourse] = useState(false);
    // const [newLicense, setNewLicense] = useState({});


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8626/users/me/Drlicense',
                    {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                    }
                );
                console.log(response.data)
                setLicenses(response.data);
            } catch (error) {
                // Custom toast style
                const customToastStyle = {
                    border: '1px solid #FFA040',
                    backgroundColor: '#FFB266',
                    color: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    padding: '16px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    fontSize: '15px',
                    fontWeight: 500,
                };

                // Usage in your error handler
                if (error.response.data.error === 'No driving license found') {
                    toast.custom(
                        (t) => (
                            <div style={customToastStyle} className={t.visible ? 'animate-enter' : 'animate-leave'}>
                                <Plus size={18} color="white" />
                                <span>No driving license found. Please add one.</span>
                                <button
                                    onClick={() => toast.dismiss(t.id)}
                                    style={{
                                        marginLeft: '20px',
                                        background: 'transparent',
                                        border: 'none',
                                        color: 'white',
                                        cursor: 'pointer',
                                    }}
                                >
                                    ×
                                </button>
                            </div>
                        ),
                        {
                            position: 'top-center',
                            duration: 5000,
                        }
                    );
                } else {
                    toast.error('Failed to load driving licenses');
                }
            }
        };
        fetchData();
    }, [])

    useEffect(() => {
        const checkApprovedCourse = async () => {
            try {
                const response = await axios.get('http://localhost:8626/users/me/course', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                if (response.data.approved) {
                    // toast.success('Course approved!');
                    setShowApprovedCourse(true);
                } else {
                    toast.error('Course not approved yet!');
                }
            } catch (error) {
                toast.error('Failed to check course approval');
            }
        };
        checkApprovedCourse();
    }, []);

    // Handle keyboard and click outside events
    const handleKeyDown = (event) => {
        if (event.keyCode === 27) {
            setShowAddModal(false);
            setShowExistingLicenseForm(false);
            setShowNewLicenseForm(false);
        }
    };

    const handleClickOutside = (event) => {
        if (event.target === document.querySelector('.fixed')) {
            setShowAddModal(false);
            setShowExistingLicenseForm(false);
            setShowNewLicenseForm(false);
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

    const checkLicense = () => {
        if (licenses.endDate < Date.now()) {
            return 'Expired'
        } else {
            return 'Active'
        }
    }

    const handleAddLicense = (type) => {
        if (type === 'add existing') {
            setShowAddModal(false);
            setShowExistingLicenseForm(true);
        } else if (type === 'request new') {
            setShowAddModal(false);
            setShowNewLicenseForm(true);

            // toast.success(`Request to ${type} submitted!`);

        }
    };

    // Add this component somewhere in your root layout
    const ToastProvider = () => (
        <Toaster
            position="top-center"
            toastOptions={{
                duration: 5000,
            }}
        />
    );
    const handleFormSubmit = () => {
        console.log("Submit")
        // setShowExistingLicenseForm(false);

        toast.success('Existing license added successfully!');
    };

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
                {/* Approved Course Banner */}
                {showApprovedCourse && (
                    <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg shadow-sm animate-fade-in">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg className="h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-green-800">
                                    Your theoretical driving course has been approved!
                                </p>
                                <div className="mt-2">
                                    <button
                                        onClick={() => window.location.assign('/driving-license-course')}
                                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-150"
                                    >
                                        Proceed to Course Page
                                        <svg className="ml-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {/* ... existing table and buttons ... */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Driving Licenses</h1>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Add License</span>
                    </button>
                </div>
                {/* Add License Modal */}
                {/* {showAddModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold text-gray-800">License Options</h2>
                                    <button
                                        onClick={() => setShowAddModal(false)}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )} */}

                {/* Add License Modal */}
                {showAddModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold text-gray-800">License Options</h2>
                                    <button
                                        onClick={() => setShowAddModal(false)}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <button
                                        onClick={() => handleAddLicense('add existing')}
                                        className="w-full p-4 bg-indigo-100 hover:bg-indigo-200 rounded-lg text-indigo-700 font-medium transition-colors"
                                    >
                                        Add Existing License
                                    </button>
                                    <button
                                        onClick={() => handleAddLicense('request new')}
                                        className="w-full p-4 bg-green-100 hover:bg-green-200 rounded-lg text-green-700 font-medium transition-colors"
                                    >
                                        Request New License
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {showExistingLicenseForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold text-gray-800">Add Existing License</h2>
                                    <button
                                        onClick={() => setShowExistingLicenseForm(false)}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>
                                <DrivingLicenseData onSubmit={handleFormSubmit} />
                            </div>
                        </div>
                    </div>
                )}
                {showNewLicenseForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold text-gray-800">Request New License</h2>
                                    <button
                                        onClick={() => setShowNewLicenseForm(false)}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="licenseType" className='block text-sm font-medium text-gray-700'>License Type</label>
                                    <select
                                        id="licenseType"
                                        name="licenseType"
                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                                    >
                                        <option value="car">Car</option>
                                        <option value="motorcycle">Motorcycle</option>
                                    </select>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                    onClick={() => {
                                        setShowNewLicenseForm(false);
                                        toast.success('New license request submitted!');
                                        window.location.href = '/driving-license-instructions';
                                    }
                                    }
                                >
                                    Submit Application
                                </button>
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
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expiry Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {licenses.map((license) => (
                                <tr key={license.id}>
                                    <td className="px-6 py-4">{license.licenseNumber}</td>
                                    <td className="px-6 py-4">{license.licenseType}</td>
                                    <td className="px-6 py-4">{license.endDate.split("T")[0]}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${checkLicense(license)
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                            }`}>
                                            {checkLicense(license)}
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

export default DrivingLicense;