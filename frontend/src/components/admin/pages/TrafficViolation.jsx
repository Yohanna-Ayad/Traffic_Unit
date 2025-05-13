import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, X, Edit, Trash2, Clock, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function TrafficViolation() {
    // Main state
    const [violations, setViolations] = useState([]);
    const [filteredViolations, setFilteredViolations] = useState([]);
    const [grievanceRequests, setGrievanceRequests] = useState([]);
    const [filteredGrievances, setFilteredGrievances] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedViolation, setSelectedViolation] = useState(null);
    const [editingContext, setEditingContext] = useState(null); // 'violation' or 'grievance'
    const [isCreating, setIsCreating] = useState(false);

    const [newViolation, setNewViolation] = useState({
        violationNumber: '',
        type: '',
        title: '',
        description: '',
        date: '',
        fineAmount: '',
        licenseType: '',
        licenseId: '',
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    // Filters
    const [violationFilter, setViolationFilter] = useState('');
    const [grievanceFilter, setGrievanceFilter] = useState('');

    // Load data on mount
    useEffect(() => {
        const fetchViolations = async () => {
            try {
                const res = await axios.get('http://localhost:8626/admin/getAllTrafficViolations', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                // console.log('Raw API response:', res); // Debug the full response

                if (!Array.isArray(res.data)) {
                    throw new Error('Expected array but got ' + typeof res.data);
                }

                const allData = res.data || [];

                // Validate each item has required fields
                allData.forEach(item => {
                    if (!item.violationNumber) {
                        console.warn('Item missing violationNumber:', item);
                    }
                });
                // Separate into two datasets based on actual data structure

                const activeViolations = allData.filter(v =>
                    !v.grievanceStatus || v.grievanceStatus !== 'pending');
                const grievanceList = allData.filter(v =>
                    v.grievanceStatus && v.grievanceStatus === 'pending');

                console.log('All data:', allData); // Debug log
                console.log('Active violations:', activeViolations); // Debug log
                console.log('Grievance list:', grievanceList); // Debug log


                setViolations(activeViolations);
                setGrievanceRequests(grievanceList);

                // Apply filters with the current filter values
                applyFilters(activeViolations, 'violation');
                applyFilters(grievanceList, 'grievance');
            } catch (error) {
                toast.error('Failed to load traffic violations');
                console.error('Error fetching violations:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchViolations();
    }, []);

    // Add useEffect to reapply filters when data changes
    useEffect(() => {
        applyFilters(violations, 'violation');
    }, [violations, violationFilter]);

    useEffect(() => {
        applyFilters(grievanceRequests, 'grievance');
    }, [grievanceRequests, grievanceFilter]);

    // Apply filters
    const applyFilters = (data, type) => {
        const filter = type === 'violation' ? violationFilter : grievanceFilter;

        if (!filter) {
            type === 'violation'
                ? setFilteredViolations(data)
                : setFilteredGrievances(data);
            return;
        }

        const filtered = data.filter(item => {
            // For violations, check both status and grievanceStatus
            if (type === 'violation') {
                return (
                    (item.status && item.status === filter) ||
                    (item.grievanceStatus && item.grievanceStatus === filter)
                );
            }
            // For grievances, only check grievanceStatus
            return item.grievanceStatus && item.grievanceStatus === filter;
        });

        type === 'violation'
            ? setFilteredViolations(filtered)
            : setFilteredGrievances(filtered);
    };

    // Format date with null check
    const formatDate = (date) => {
        if (!date) return 'N/A'; // Or some default value
        try {
            return new Date(date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            });
        } catch (e) {
            console.error('Invalid date:', date);
            return 'Invalid Date';
        }
    };

    // Format currency with null check
    const formatCurrency = (amount) => {
        if (amount === null || amount === undefined || isNaN(amount)) return 'EGP N/A';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'EGP',
        }).format(amount);
    };

    // Format date for input
    const formatInputDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().slice(0, 16);
    };

    // Status badge styles
    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'unpaid': return 'bg-red-100 text-red-800';
            case 'paid': return 'bg-green-100 text-green-800';
            case 'pending_approval': return 'bg-blue-100 text-blue-800';
            case 'dismissed': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    // Grievance status badge styles
    const getGrievanceBadgeClass = (status) => {
        switch (status) {
            case 'pending': return 'bg-blue-100 text-blue-800';
            case 'accepted': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    // Open edit modal with context
    const openEditModal = (violation, context) => {
        setSelectedViolation({ ...violation });
        setEditingContext(context);
        setShowEditModal(true);
    };

    // Save edited violation
    const handleSave = async () => {
        if (!selectedViolation) return;
        try {
            const response = await axios.patch(
                `http://localhost:8626/admin/updateTrafficViolation/${selectedViolation.violationNumber}`,
                selectedViolation,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            const updatedViolation = response.data;


            // Transform the updated violation to match your frontend structure
            const transformedViolation = {
                ...updatedViolation,
                id: updatedViolation.violationNumber,
                date: new Date(updatedViolation.date).toLocaleDateString(),
                status: updatedViolation.status,
                grievanceStatus: updatedViolation.grievanceStatus
                    ? updatedViolation.grievanceStatus
                    : null,
                grievanceDate: updatedViolation.grievanceDate
                    ? new Date(updatedViolation.grievanceDate).toLocaleDateString()
                    : null,
            };

            // Update all relevant state arrays
            const updateState = (prevArray) =>
                prevArray.map(v =>
                    v.violationNumber === transformedViolation.violationNumber
                        ? transformedViolation
                        : v
                );

            setViolations(updateState);
            setFilteredViolations(updateState);
            setGrievanceRequests(updateState);
            setFilteredGrievances(updateState);

            setShowEditModal(false);
            toast.success('Violation updated successfully');


            // // Update both datasets
            // setViolations(prev =>
            //     prev.map(v => v.violationNumber === updatedViolation.violationNumber ? updatedViolation : v)
            // );
            // setFilteredViolations(prev =>
            //     prev.map(v => v.violationNumber === updatedViolation.violationNumber ? updatedViolation : v)
            // );

            // setGrievanceRequests(prev =>
            //     prev.map(v => v.violationNumber === updatedViolation.violationNumber ? updatedViolation : v)
            // );
            // setFilteredGrievances(prev =>
            //     prev.map(v => v.violationNumber === updatedViolation.violationNumber ? updatedViolation : v)
            // );


            // setShowEditModal(false);
            // toast.success('Violation updated successfully');
        } catch (error) {
            console.error('Failed to update violation', error);
            toast.error('Failed to update violation');
        }
    };

    // Handle create violation form submission
    const handleCreate = async () => {
        setIsCreating(true);
        const requiredFields = ['title', 'description', 'date', 'fineAmount', 'licenseType', 'licenseId'];
        const missingFields = requiredFields.filter(field => !newViolation[field]);

        if (missingFields.length > 0) {
            toast.error(`Missing required fields: ${missingFields.join(', ')}`);
            return;
        }

        try {
            const response = await axios.post(
                'http://localhost:8626/admin/addTrafficViolation',
                newViolation,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            console.log('Creation response:', response.data); // Debug log

            const createdViolation = response.data.trafficViolation;
            console.log(createdViolation);
            // console.log(filteredViolations[filteredViolations.length - 1].violationNumber);
            // Ensure all required fields are present
            const completeViolation = {
                violationNumber: createdViolation.violationNumber || filteredViolations[filteredViolations.length - 1].violationNumber + 1,
                title: createdViolation.title || newViolation.title,
                description: createdViolation.description || newViolation.description,
                date: createdViolation.date || newViolation.date,
                fineAmount: createdViolation.fineAmount || newViolation.fineAmount,
                licenseType: createdViolation.licenseType || newViolation.licenseType,
                licenseId: createdViolation.licenseId || newViolation.licenseId,
                status: createdViolation.status || 'unpaid', // Default status
                grievanceStatus: createdViolation.grievanceStatus || null,
            };

            // Add to appropriate dataset
            if (!completeViolation.grievanceStatus || completeViolation.grievanceStatus === 'pending') {
                setViolations(prev => [completeViolation, ...prev]);
                setFilteredViolations(prev => [completeViolation, ...prev]);
            } else {
                setGrievanceRequests(prev => [completeViolation, ...prev]);
                setFilteredGrievances(prev => [completeViolation, ...prev]);
            }

            setShowCreateModal(false);
            setNewViolation({
                violationNumber: '',
                title: '',
                description: '',
                date: '',
                fineAmount: '',
                licenseType: '',
                licenseId: '',
            });
            toast.success(response.data.message || 'Violation created successfully');
        } catch (error) {
            console.error('Full error:', error.response?.data || error.message); // More detailed error
            // toast.error('Failed to create violation');
            toast.error(error.response?.data?.error || 'Failed to create violation');
        }
        finally {
            setIsCreating(false);
        }
    };

    // Reset form
    const resetCreateForm = () => {
        setNewViolation({
            violationNumber: '',
            title: '',
            description: '',
            date: '',
            fineAmount: '',
            licenseType: '',
            licenseId: '',
        });
    };


    return (
        <>
            {loading ? (
                <div className="flex justify-center items-center min-h-screen bg-gray-50">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
                    <span className="ml-4 text-lg font-medium text-gray-700">Loading violations...</span>
                </div>
            ) : (
                <div className="max-w-6xl mx-auto py-5 px-4">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-800">Traffic Violations</h1>
                        <div className="flex space-x-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search violations..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                />
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </div>
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                            >
                                <Plus className="w-5 h-5" />
                                <span>Create Violation</span>
                            </button>
                        </div>
                    </div>

                    {/* Main Violation Table */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="flex justify-between items-center p-4">
                            <h3 className="text-lg font-semibold text-gray-800">Traffic Violations</h3>
                            <select
                                value={violationFilter}
                                onChange={(e) => {
                                    setViolationFilter(e.target.value);
                                    applyFilters(violations, 'violation');
                                }}
                                className="p-2 border border-gray-300 rounded"
                            >
                                <option value="">All Statuses</option>
                                <option value="unpaid">Unpaid</option>
                                <option value="paid">Paid</option>
                                <option value="pending_approval">Pending Approval</option>
                                <option value="dismissed">Dismissed</option>
                            </select>
                        </div>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Violation #</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fine</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredViolations.length > 0 ? (
                                    filteredViolations.map((violation) => (
                                        <tr key={violation._id || violation.violationNumber || Math.random().toString(36).substr(2, 9)}>
                                            {/* {filteredViolations.length > 0 ? (
                                    filteredViolations.map((violation) => (
                                        <tr key={violation.violationNumber}> */}
                                            <td className="px-6 py-4">{violation.violationNumber}</td>
                                            <td className="px-6 py-4">{violation.title}</td>
                                            <td className="px-6 py-4">{formatDate(violation.date)}</td>
                                            <td className="px-6 py-4">{formatCurrency(violation.fineAmount)}</td>
                                            <td className="px-4 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(violation.status)}`}>
                                                    {violation.status}
                                                </span>
                                            </td>
                                            <td className="px-10 py-4 text-right">
                                                <button
                                                    onClick={() => openEditModal(violation, 'violation')}
                                                    className="text-indigo-600 hover:text-indigo-900"
                                                >
                                                    <Edit className="w-5 h-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center py-4 text-gray-500">
                                            No violations found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Grievance Requests Table */}
                    <div className="bg-white rounded-lg shadow overflow-hidden mt-8">
                        <div className="flex justify-between items-center p-4">
                            <h3 className="text-lg font-semibold text-gray-800">Grievance Requests</h3>
                            <select
                                value={grievanceFilter}
                                onChange={(e) => {
                                    setGrievanceFilter(e.target.value);
                                    applyFilters(grievanceRequests, 'grievance');
                                }}
                                className="p-2 border border-gray-300 rounded"
                            >
                                <option value="">All Statuses</option>
                                <option value="pending">Pending</option>
                                <option value="accepted">Accepted</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Violation #</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grievance Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredGrievances.length > 0 ? (
                                    filteredGrievances.map((grievance) => (
                                        <tr key={grievance.violationNumber}>
                                            <td className="px-6 py-4">{grievance.violationNumber}</td>
                                            <td className="px-6 py-4">{grievance.title}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGrievanceBadgeClass(grievance.grievanceStatus)}`}>
                                                    {grievance.grievanceStatus}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => openEditModal(grievance, 'grievance')}
                                                    className="text-indigo-600 hover:text-indigo-900"
                                                >
                                                    <Edit className="w-5 h-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center py-4 text-gray-500">
                                            No grievance requests found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Edit Violation Modal */}
                    {showEditModal && selectedViolation && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl  overflow-y-auto h-full">
                                <div className="p-6 ">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-2xl font-bold text-gray-900">
                                            {editingContext === 'violation' ? 'Edit Violation' : 'Edit Grievance'}
                                        </h2>
                                        <button
                                            onClick={() => setShowEditModal(false)}
                                            className="text-gray-500 hover:text-gray-900"
                                        >
                                            <X className="w-6 h-6" />
                                        </button>
                                    </div>

                                    <div className="space-y-4 mb-6">
                                        {/* Common Fields */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Violation Title</label>
                                            <input
                                                type="text"
                                                value={selectedViolation.title}
                                                onChange={(e) => setSelectedViolation({ ...selectedViolation, title: e.target.value })}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>

                                        {/* Context-Specific Fields */}
                                        {editingContext === 'violation' ? (
                                            <>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Status</label>
                                                    <select
                                                        value={selectedViolation.status}
                                                        onChange={(e) =>
                                                            setSelectedViolation({
                                                                ...selectedViolation,
                                                                status: e.target.value,
                                                            })
                                                        }
                                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                    >
                                                        <option value="pending_approval">Pending Approval</option>
                                                        <option value="paid">Paid</option>
                                                        <option value="dismissed">Dismissed</option>
                                                    </select>
                                                </div>

                                                {selectedViolation.paymentImage && (
                                                    <div className="mt-4">
                                                        <a
                                                            href={selectedViolation.paymentImage}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-600 hover:underline"
                                                        >
                                                            View Receipt
                                                        </a>
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Grievance Status</label>
                                                    <select
                                                        value={selectedViolation.grievanceStatus}
                                                        onChange={(e) =>
                                                            setSelectedViolation({
                                                                ...selectedViolation,
                                                                grievanceStatus: e.target.value,
                                                            })
                                                        }
                                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="accepted">Accepted</option>
                                                        <option value="rejected">Rejected</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Status</label>
                                                    <select
                                                        value={selectedViolation.status}
                                                        onChange={(e) =>
                                                            setSelectedViolation({
                                                                ...selectedViolation,
                                                                status: e.target.value,
                                                            })
                                                        }
                                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                    >
                                                        <option value="pending_approval">Pending Approval</option>
                                                        <option value="paid">Paid</option>
                                                        <option value="dismissed">Dismissed</option>
                                                    </select>
                                                </div>
                                                <div className="relative w-full">
                                                    <label className="block text-sm font-medium text-gray-700">Violation Fine</label>
                                                    <input
                                                        type="number"
                                                        value={selectedViolation.fineAmount}
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            // Only update if value is a number or empty string
                                                            if (value === '' || !isNaN(value)) {
                                                                setSelectedViolation({
                                                                    ...selectedViolation,
                                                                    fineAmount: value === '' ? '' : parseFloat(value),
                                                                });
                                                            }
                                                        }}
                                                        className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 no-spinner"
                                                    />
                                                    <span className="absolute right-3 top-1/2 transform -translate-y-px text-gray-500 pointer-events-none">
                                                        L.E
                                                    </span>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Grievance Description</label>
                                                    <textarea
                                                        value={selectedViolation.grievanceDescription || ''}
                                                        onChange={(e) => setSelectedViolation({
                                                            ...selectedViolation,
                                                            grievanceDescription: e.target.value,
                                                        })}
                                                        disabled
                                                        rows={4}
                                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>

                                                {selectedViolation.grievanceDate && (
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">Grievance Date</label>
                                                        <input
                                                            type="datetime-local"
                                                            value={formatInputDate(selectedViolation.grievanceDate)}
                                                            disabled
                                                            className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg"
                                                        />
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>

                                    <div className="flex justify-end space-x-4">
                                        <button
                                            onClick={() => setShowEditModal(false)}
                                            className="px-6 py-3 rounded-lg font-medium text-gray-700 border border-gray-300 hover:bg-gray-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSave}
                                            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Create Violation Modal */}
                    {showCreateModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-2xl font-bold text-gray-900">Create Violation</h2>
                                        <button
                                            onClick={() => {
                                                setShowCreateModal(false);
                                                resetCreateForm();
                                            }}
                                            className="text-gray-500 hover:text-gray-900"
                                        >
                                            <X className="w-6 h-6" />
                                        </button>
                                    </div>

                                    {/* User Data Section */}
                                    <div className="mb-8">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">User Data</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">License Type</label>
                                                <select
                                                    value={newViolation.licenseType}
                                                    onChange={(e) =>
                                                        setNewViolation({ ...newViolation, licenseType: e.target.value })
                                                    }
                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                >
                                                    <option value="">Select License Type</option>
                                                    <option value="drivingLicense">Driving License</option>
                                                    <option value="vehicleLicense">Vehicle License</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">License ID</label>
                                                <input
                                                    type="text"
                                                    value={newViolation.licenseId}
                                                    onChange={(e) =>
                                                        setNewViolation({ ...newViolation, licenseId: e.target.value })
                                                    }
                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                    placeholder="LIC-XXXX-XXXX"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Violation Details Section */}
                                    <div className="mb-8">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Violation Details</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Violation Type</label>
                                                <select
                                                    value={newViolation.type}
                                                    onChange={(e) =>
                                                        setNewViolation({ ...newViolation, type: e.target.value })
                                                    }
                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                >
                                                    <option value="">Select Violation Type</option>
                                                    <option value="Speeding">Speeding</option>
                                                    <option value="Parking">Parking</option>
                                                    <option value="Signal">Signal</option>
                                                    <option value="Illegal U-Turn">Illegal U-Turn</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Violation Title</label>
                                                <input
                                                    type="text"
                                                    value={newViolation.title}
                                                    onChange={(e) =>
                                                        setNewViolation({ ...newViolation, title: e.target.value })
                                                    }
                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                                <textarea
                                                    value={newViolation.description}
                                                    onChange={(e) =>
                                                        setNewViolation({ ...newViolation, description: e.target.value })
                                                    }
                                                    rows={3}
                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Timing & Financials Section */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Timing & Financials</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                                <input
                                                    type="date"
                                                    value={newViolation.date}
                                                    max={new Date().toISOString().split('T')[0]} // This disables future dates
                                                    onChange={(e) => {
                                                        // Additional validation (optional)
                                                        if (new Date(e.target.value) > new Date()) {
                                                            // alert('Date cannot be in the future');
                                                            toast.error('Date cannot be in the future');
                                                            return;
                                                        }
                                                        setNewViolation({ ...newViolation, date: e.target.value });
                                                    }}
                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Fine Amount</label>
                                                <div className="relative w-full">
                                                    <input
                                                        type="number"
                                                        value={newViolation.fineAmount}
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            // Only update if value is a number or empty string
                                                            if (value === '' || !isNaN(value)) {
                                                                setNewViolation({
                                                                    ...newViolation,
                                                                    fineAmount: value === '' ? '' : parseFloat(value),
                                                                });
                                                            }
                                                        }}
                                                        className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 no-spinner"
                                                    />
                                                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
                                                        L.E
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end space-x-4 mt-8 pt-4 border-t">
                                        <button
                                            onClick={() => {
                                                setShowCreateModal(false);
                                                resetCreateForm();
                                            }}
                                            className="px-6 py-3 rounded-lg font-medium text-gray-700 border border-gray-300 hover:bg-gray-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleCreate}
                                            disabled={isCreating}
                                            className={`px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 ${isCreating ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            {isCreating ? 'Creating...' : 'Create Violation'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}