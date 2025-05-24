import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, X, CheckCircle, CircleAlert, XCircle, Clock, FileText, AlertCircle, Loader2 } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import Layout from '../components/Layout';

function LicenseRequestPage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [requestType, setRequestType] = useState('updateLicense');
    const [licenseType, setLicenseType] = useState('vehicle');
    const [selectedLicense, setSelectedLicense] = useState('');
    const [idFrontImage, setIdFrontImage] = useState(null);
    const [idBackImage, setIdBackImage] = useState(null);
    const [vehicleLicenses, setVehicleLicenses] = useState([]);
    const [driverLicenses, setDriverLicenses] = useState([]);
    const [cars, setCars] = useState([]);

    const [paymentMethod, setPaymentMethod] = useState('');

    const [requestApproved, setRequestApproved] = useState(false);
    const [requestRejected, setRequestRejected] = useState(false);
    const [requestPending, setRequestPending] = useState(false);
    const [paymentApproved, setPaymentApproved] = useState(false);
    const [paymentRejected, setPaymentRejected] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showPaymentReceiptModal, setShowPaymentReceiptModal] = useState(false);

    const [paymentAmount, setPaymentAmount] = useState(0);
    const [paymentReceipt, setPaymentReceipt] = useState(null);
    const [showApprovedRequestsModal, setShowApprovedRequestsModal] = useState(false);
    const [approvedRequests, setApprovedRequests] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [approvedPayments, setApprovedPayments] = useState([]);
    const [rejectedPayments, setRejectedPayments] = useState([]);
    const [selectedRejectedPayment, setSelectedRejectedPayment] = useState(null);
    const [selectedRequestForPayment, setSelectedRequestForPayment] = useState(null);

    useEffect(() => {
        const fetchDrivingLicenses = async () => {
            try {
                const response = await axios.get('http://localhost:8626/users/me/Drlicense', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                if (response.data.message === "No driving license found") {
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
                    setDriverLicenses([]);
                }
                else {
                    setDriverLicenses(response.data);
                }
            } catch (error) {
                console.error('Error fetching driving licenses:', error);
            }
            finally {
                setLoading(false);
            }
        };

        fetchDrivingLicenses();
    }, []);

    useEffect(() => {
        const fetchVehicleLicenses = async () => {
            try {
                const response = await axios.get('http://localhost:8626/users/me/cars', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setCars(response.data.userCars);
                setVehicleLicenses(response.data.carLicenses);
                // setVehicleLicensesApproved(response.data.approved);
            } catch (error) {
                console.error('Error fetching vehicle licenses:', error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchVehicleLicenses();
    }, []);

    const vehicleCombinedData = vehicleLicenses.map(license => {
        const car = cars.find(c => c.id === license.vehicleId);
        return {
            ...license,
            carDetails: car || {}
        };
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Check request approval status
                const requestResponse = await axios.get('http://localhost:8626/users/me/license-requests', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                console.log(requestResponse.data)
                if (requestResponse.data.requests) {
                    const approved = requestResponse.data.requests.filter(
                        req => req.status === 'approved' && req.paymentStatus === 'unpaid'
                    );
                    console.log(approved)
                    if (approved.length > 0) {
                        setApprovedRequests(approved);
                        // setShowApprovedRequestsModal(true);
                        setRequestApproved(true);
                    }

                    // Check if any requests are pending
                    const pending = requestResponse.data.requests.filter(req => req.paymentStatus === 'pending_approval');
                    if (pending.length > 0) {
                        setRequestPending(true);
                        setPendingRequests(pending);
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setError(error.response?.data?.error || 'Failed to load data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchPaidData = async () => {
            try {
                const response = await axios.get('http://localhost:8626/users/me/license-payment-requests', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                if (response.data.requests) {
                    const paidRequests = response.data.requests.filter(
                        req => req.paymentStatus === 'paid' && new Date(req.updatedAt) > new Date(Date.now() - 8 * 24 * 60 * 60 * 1000)
                    );
                    if (paidRequests.length > 0) {
                        console.log(paidRequests)
                        setApprovedPayments(paidRequests);
                        setPaymentApproved(true);
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setError(error.response?.data?.error || 'Failed to load data');
            } finally {
                setLoading(false);
            }
        };

        fetchPaidData();
    }, []);

    useEffect(() => {
        const fetchingRejectedPayments = async () => {
            try {
                const response = await axios.get('http://localhost:8626/users/me/license-payment-rejected', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                console.log(response.data)
                if (response.data.requests) {
                    setRejectedPayments(response.data.requests);
                    setPaymentRejected(true);
                    // console.log(rejectedRequests)
                    // setRejectedPayments(rejectedRequests);
                    // console.log(rejectedRequests)
                    // setPaymentRejected(true);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setError(error.response?.data?.error || 'Failed to load data');
            } finally {
                setLoading(false);
            }
        };

        fetchingRejectedPayments();
    }, []);

    // New handler for payment initiation
    const handleInitiatePayment = (request) => {
        setSelectedRequestForPayment(request);
        setPaymentAmount(100); // Fixed amount of 100 L.E
        setShowPaymentModal(true);
        setShowApprovedRequestsModal(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        console.log(error);
        try {
            const formData = new FormData();
            console.log(selectedLicense);
            formData.append('requestType', requestType);
            formData.append('licenseType', licenseType);
            formData.append('selectedLicense', selectedLicense);
            formData.append('idFrontImage', idFrontImage);
            formData.append('idBackImage', idBackImage);

            const response = await axios.post('http://localhost:8626/users/me/license-request', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            console.log(response.data);
            if (response.status === 200) {
                toast.success('Request submitted successfully!');
                setRequestType('updateLicense');
                setLicenseType('vehicle');
                setSelectedLicense('');
                setPaymentMethod('');
                setIdFrontImage(null);
                setIdBackImage(null);
            }
        } catch (error) {
            console.error('Error submitting request:', error);
            toast.error(error.response?.data?.error || 'Failed to submit request');
        } finally {
            setLoading(false);
        }
    };
    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const paymentFormData = new FormData();

            // Case 1: Approved request payment
            if (selectedRequestForPayment) {
                paymentFormData.append('payment', paymentReceipt);
                paymentFormData.append('requestId', selectedRequestForPayment.requestId);

                const response = await axios.post('http://localhost:8626/users/me/license-payment', paymentFormData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });

                toast.success('Payment submitted for approval!');
                setShowPaymentModal(false);

                // Update state
                const filteredRequests = approvedRequests.filter(
                    req => req.requestId !== selectedRequestForPayment.requestId
                );

                setPendingRequests([selectedRequestForPayment, ...pendingRequests]);
                setApprovedRequests(filteredRequests);
                setRequestPending(true);
                setRequestApproved(filteredRequests.length > 0);
            }

            // Case 2: Rejected payment retry
            else if (selectedRejectedPayment) {
                paymentFormData.append('payment', paymentReceipt);
                paymentFormData.append('requestId', selectedRejectedPayment.requestId);

                const response = await axios.post('http://localhost:8626/users/me/license-payment', paymentFormData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });

                toast.success('Payment resubmitted for approval!');
                setShowPaymentModal(false);

                // Update state
                const filteredRejected = rejectedPayments.filter(
                    req => req.requestId !== selectedRejectedPayment.requestId
                );

                setPendingRequests([selectedRejectedPayment, ...pendingRequests]);
                setRejectedPayments(filteredRejected);
                setRequestPending(true);
                setPaymentRejected(filteredRejected.length > 0);
            }

            // Reset selection states
            setSelectedRequestForPayment(null);
            setSelectedRejectedPayment(null);
            setPaymentReceipt(null);
            setShowPaymentReceiptModal(false);
        } catch (error) {
            console.error('Error submitting payment:', error);
            toast.error(error.response?.data?.error || 'Failed to submit payment');
        } finally {
            setLoading(false);
        }
    };
    // const handlePaymentSubmit = async (e) => {
    //     e.preventDefault();
    //     setLoading(true);

    //     try {
    //         const paymentFormData = new FormData();
    //         if (selectedRequestForPayment && !selectedRejectedPayment) {
    //             paymentFormData.append('payment', paymentReceipt);  // Changed from 'receipt' to 'payment'
    //             paymentFormData.append('requestId', selectedRequestForPayment.requestId);  // Ensure this matches your data structure

    //             const response = await axios.post('http://localhost:8626/users/me/license-payment', paymentFormData, {
    //                 headers: {
    //                     'Content-Type': 'multipart/form-data',
    //                     Authorization: `Bearer ${localStorage.getItem('token')}`
    //                 }
    //             });

    //             toast.success('Payment submitted for approval!');
    //             setShowPaymentModal(false);
    //             setShowApprovedRequestsModal(false);
    //             const filteredRequests = approvedRequests.filter(req => req.requestId !== selectedRequestForPayment.requestId);
    //             console.log(filteredRequests)
    //             console.log(selectedRequestForPayment)
    //             if (filteredRequests.length > 0) {
    //                 setApprovedRequests(filteredRequests);
    //                 setPendingRequests([selectedRequestForPayment, ...pendingRequests]);
    //                 setRequestPending(true);
    //                 setSelectedRequestForPayment(null);
    //                 setShowPaymentReceiptModal(false)
    //                 // setRequestPending(false);
    //                 // setRequestApproved(false);
    //             }
    //             else {
    //                 setPendingRequests([selectedRequestForPayment, ...pendingRequests]);
    //                 setApprovedRequests([]);
    //                 setShowPaymentReceiptModal(false)
    //                 setRequestApproved(false);
    //                 setRequestPending(true);
    //                 setSelectedRequestForPayment(null);
    //             }
    //         }
    //         else if (selectedRejectedPayment && !selectedRequestForPayment) {
    //             paymentFormData.append('payment', paymentReceipt);  // Changed from 'receipt' to 'payment
    //             paymentFormData.append('requestId', selectedRejectedPayment.requestId);  // Ensure this matches your
    //             const response = await axios.post('http://localhost:8626/users/me/license-payment', paymentFormData, {
    //                 headers: {
    //                     'Content-Type': 'multipart/form-data',
    //                     Authorization: `Bearer ${localStorage.getItem('token')}`
    //                 }
    //             });
    //             toast.success('Payment submitted for approval!');
    //             setShowPaymentModal(false);
    //             setShowApprovedRequestsModal(false);
    //             const filteredRequests = rejectedPayments.filter(req => req.requestId !== selectedRejectedPayment.requestId);
    //             if (filteredRequests.length > 0) {
    //                 setRejectedPayments(filteredRequests);
    //                 setPendingRequests([selectedRejectedPayment, ...pendingRequests]);
    //                 setRequestPending(true);
    //                 setSelectedRequestForPayment(null);
    //                 setShowPaymentReceiptModal(false)
    //                 // setRequestPending(false);
    //                 // setRequestApproved(false);
    //             }
    //             else {
    //                 setPendingRequests([selectedRejectedPayment, ...pendingRequests]);
    //                 setRejectedPayments([]);
    //                 setShowPaymentReceiptModal(false)
    //                 setRequestApproved(false);
    //                 setRequestPending(true);
    //                 setSelectedRequestForPayment(null);
    //             }
    //         }
    //         // paymentFormData.append('payment', paymentReceipt);  // Changed from 'receipt' to 'payment'
    //         // paymentFormData.append('requestId', selectedRequestForPayment.requestId);  // Ensure this matches your data structure

    //         // const response = await axios.post('http://localhost:8626/users/me/license-payment', paymentFormData, {
    //         //     headers: {
    //         //         'Content-Type': 'multipart/form-data',
    //         //         Authorization: `Bearer ${localStorage.getItem('token')}`
    //         //     }
    //         // });

    //         // toast.success('Payment submitted for approval!');
    //         // setShowPaymentModal(false);
    //         // setShowApprovedRequestsModal(false);
    //         // const filteredRequests = approvedRequests.filter(req => req.requestId !== selectedRequestForPayment.requestId);
    //         // console.log(filteredRequests)
    //         // console.log(selectedRequestForPayment)
    //         // if (filteredRequests.length > 0) {
    //         //     setApprovedRequests(filteredRequests);
    //         //     setPendingRequests([selectedRequestForPayment, ...pendingRequests]);
    //         //     setRequestPending(true);
    //         //     setSelectedRequestForPayment(null);
    //         //     setShowPaymentReceiptModal(false)
    //         //     // setRequestPending(false);
    //         //     // setRequestApproved(false);
    //         // }
    //         // else {
    //         //     setPendingRequests([selectedRequestForPayment, ...pendingRequests]);
    //         //     setApprovedRequests([]);
    //         //     setShowPaymentReceiptModal(false)
    //         //     setRequestApproved(false);
    //         //     setRequestPending(true);
    //         //     setSelectedRequestForPayment(null);
    //         // }
    //     } catch (error) {
    //         console.error('Error submitting payment:', error);
    //         toast.error(error.response?.data?.error || 'Failed to submit payment');
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const handleTryAgain = (payment) => {
        setSelectedRejectedPayment(payment);
        setShowPaymentReceiptModal(true);
    }
    // const handlePaymentSubmit = async (e) => {
    //     e.preventDefault();
    //     setLoading(true);

    //     try {
    //         const paymentFormData = new FormData();
    //         paymentFormData.append('amount', paymentAmount);
    //         paymentFormData.append('receipt', paymentReceipt);

    //         const response = await axios.post('http://localhost:8626/users/me/license-payment', paymentFormData, {
    //             headers: {
    //                 'Content-Type': 'multipart/form-data',
    //                 Authorization: `Bearer ${localStorage.getItem('token')}`
    //             }
    //         });

    //         toast.success('Payment submitted for approval!');
    //         setShowPaymentModal(false);
    //     } catch (error) {
    //         console.error('Error submitting payment:', error);
    //         toast.error(error.response?.data?.error || 'Failed to submit payment');
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    return (
        <>
            {loading ? (
                <div className="flex justify-center items-center min-h-screen bg-gray-50">
                    {error ? (
                        <div className="text-red-500 text-center">
                            <p>{error}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="mt-4 px-4 py-2 bg-red-100 rounded-md"
                            >
                                Retry
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
                            <span className="ml-4 text-lg font-medium text-gray-700">Loading data...</span>
                        </>
                    )}
                </div>
            ) : (
                <>
                    <Layout
                        navigation={[
                            { name: 'Dashboard', href: '/dashboard' },
                            { name: 'Driving License', href: '/driving-license-public' },
                            { name: 'Car License', href: '/car-license' },
                            { name: 'Violations', href: '/violations' },
                            { name: 'License Request', href: '/license-request' },
                        ]}
                    />
                    <div className="max-w-6xl mx-auto py-5 px-4">
                        {/* Request Approved Banner */}
                        {requestApproved && (
                            <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg shadow-sm animate-fade-in">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <svg className="h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-green-800">
                                            Your license request has been approved! Please proceed with payment.
                                        </p>
                                        <div className="mt-2">
                                            <button
                                                // onClick={() => setShowPaymentModal(true)}
                                                onClick={() => setShowApprovedRequestsModal(true)}
                                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-150"
                                            >
                                                Proceed to Payment
                                                <svg className="ml-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Payment Approved Banner - keep this one */}
                        {paymentApproved && (
                            approvedPayments.map((payment, index) => (
                                <div key={index} className="mb-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg shadow-sm animate-fade-in">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <svg className="h-6 w-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-green-800">
                                                Your payment for your {payment.licenseType} license <b>{payment.licenseId}</b> has been approved! Your license will be delivered to your home within a week.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                            // <div className="mb-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg shadow-sm animate-fade-in">
                            //     <div className="flex items-center">
                            //         <div className="flex-shrink-0">
                            //             <CheckCircle className="h-6 w-6 text-blue-500" />
                            //         </div>
                            //         <div className="ml-3">
                            //             <p className="text-sm font-medium text-blue-800">
                            //                 Your payment for your license {} has been approved! Your license will be delivered to your home within a week.
                            //             </p>
                            //         </div>
                            //     </div>
                            // </div>
                        )}

                        {paymentRejected && (
                            rejectedPayments.map((payment, index) => (
                                <div key={index} className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-sm animate-fade-in">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <XCircle className="h-6 w-6 text-red-500" />
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-red-800">
                                                Your payment for your {payment.licenseType} license <b>{payment.licenseId}</b> has been rejected. Please try again.
                                            </p>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-red-800">
                                                Reason: {payment.adminNotes}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-2">
                                        <button className=' bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 ml-5'
                                            onClick={() => handleTryAgain(payment)}>
                                            Try Again
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}

                        {/* Payment Request Pending */}
                        {requestPending && (
                            pendingRequests.map((request, index) => (
                                <div key={index} className="mb-6 bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg shadow-sm animate-fade-in">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <CircleAlert className="h-6 w-6 text-yellow-500" />
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-yellow-800">
                                                Your payment request for {request.type.toUpperCase().split('LICENSE')} LICENSE for {request.licenseId} is pending. Please wait for approval.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                            // <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg shadow-sm animate-fade-in">
                            //     <div className="flex items-center">
                            //         <div className="flex-shrink-0">
                            //             <CircleAlert className="h-6 w-6 text-yellow-500" />
                            //         </div>
                            //         <div className="ml-3">
                            //             <p className="text-sm font-medium text-yellow-800">
                            //                 Your payment request is pending. Please wait for approval.
                            //             </p>
                            //         </div>
                            //     </div>
                            // </div>
                        )}


                        <div className="bg-white rounded-lg shadow overflow-hidden p-6">
                            <h1 className="text-2xl font-bold text-gray-800 mb-6">License Request Form</h1>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Request Type Selection */}
                                <div>
                                    <label htmlFor="requestType" className="block text-sm font-medium text-gray-700 mb-1">
                                        Request Type
                                    </label>
                                    <select
                                        id="requestType"
                                        value={requestType}
                                        onChange={(e) => setRequestType(e.target.value)}
                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                        required
                                    >
                                        <option value="updateLicense">Update License</option>
                                        <option value="replaceLicense">Replace Lost License</option>
                                    </select>
                                </div>

                                {/* License Type Selection */}
                                <div>
                                    <label htmlFor="licenseType" className="block text-sm font-medium text-gray-700 mb-1">
                                        License Type
                                    </label>
                                    <select
                                        id="licenseType"
                                        value={licenseType}
                                        onChange={(e) => {
                                            setLicenseType(e.target.value);
                                            setSelectedLicense(''); // Reset specific license when type changes
                                        }}
                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                        required
                                    >
                                        <option value="vehicle">Vehicle License</option>
                                        <option value="driving">Driving License</option>
                                    </select>
                                </div>

                                {/* Specific License Selection */}
                                <div>
                                    <label htmlFor="selectedLicense" className="block text-sm font-medium text-gray-700 mb-1">
                                        {licenseType === 'vehicle' ? 'Vehicle License' : 'Driving License'}
                                    </label>
                                    <select
                                        id="selectedLicense"
                                        value={selectedLicense}
                                        onChange={(e) => setSelectedLicense(e.target.value)}
                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                        required
                                    >
                                        <option value="">Select an option</option>
                                        {licenseType === 'vehicle' ? (
                                            vehicleCombinedData.map(({ carDetails, plateNumber }) => (
                                                <option key={plateNumber} value={plateNumber}>
                                                    {carDetails.maker} {carDetails.model} ({carDetails.year}) - {plateNumber}
                                                </option>
                                            ))
                                        ) : (
                                            driverLicenses.map(({ licenseType, licenseNumber }) => (
                                                <option key={licenseNumber} value={licenseType + "-" + licenseNumber}>
                                                    {licenseType} - {licenseNumber}
                                                </option>
                                            ))
                                        )}
                                    </select>
                                </div>

                                {/* National ID Front Image Upload */}
                                <div>
                                    <label htmlFor="idFrontImage" className="block text-sm font-medium text-gray-700 mb-1">
                                        National ID Front Image
                                    </label>
                                    <div className="mt-1 flex items-center">
                                        <input
                                            type="file"
                                            id="idFrontImage"
                                            accept="image/*"
                                            onChange={(e) => setIdFrontImage(e.target.files[0])}
                                            className="block w-full text-sm text-gray-500
                                                file:mr-4 file:py-2 file:px-4
                                                file:rounded-md file:border-0
                                                file:text-sm file:font-semibold
                                                file:bg-indigo-50 file:text-indigo-700
                                                hover:file:bg-indigo-100"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* National ID Back Image Upload */}
                                <div>
                                    <label htmlFor="idBackImage" className="block text-sm font-medium text-gray-700 mb-1">
                                        National ID Back Image
                                    </label>
                                    <div className="mt-1 flex items-center">
                                        <input
                                            type="file"
                                            id="idBackImage"
                                            accept="image/*"
                                            onChange={(e) => setIdBackImage(e.target.files[0])}
                                            className="block w-full text-sm text-gray-500
                                                file:mr-4 file:py-2 file:px-4
                                                file:rounded-md file:border-0
                                                file:text-sm file:font-semibold
                                                file:bg-indigo-50 file:text-indigo-700
                                                hover:file:bg-indigo-100"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        disabled={loading}
                                    >
                                        {loading ? 'Submitting...' : 'Submit Request'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Payment Modal
                    {showPaymentModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-xl font-bold text-gray-800">Payment Information</h2>
                                        <button
                                            onClick={() => setShowPaymentModal(false)}
                                            className="text-gray-500 hover:text-gray-700"
                                        >
                                            <X className="w-6 h-6" />
                                        </button>
                                    </div>

                                    <form onSubmit={handlePaymentSubmit} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Payment Amount (L.E)
                                            </label>
                                            <input
                                                type="number"
                                                value={paymentAmount}
                                                onChange={(e) => setPaymentAmount(e.target.value)}
                                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Payment Receipt (Image)
                                            </label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => setPaymentReceipt(e.target.files[0])}
                                                className="block w-full text-sm text-gray-500
                                                    file:mr-4 file:py-2 file:px-4
                                                    file:rounded-md file:border-0
                                                    file:text-sm file:font-semibold
                                                    file:bg-indigo-50 file:text-indigo-700
                                                    hover:file:bg-indigo-100"
                                                required
                                            />
                                        </div>

                                        <div className="pt-4">
                                            <button
                                                type="submit"
                                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                                disabled={loading}
                                            >
                                                {loading ? 'Submitting...' : 'Submit Payment'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )} */}
                    {/* Approved Requests Modal */}
                    {showApprovedRequestsModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
                            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-2xl font-bold text-gray-800">Your License Requests Have Been Approved!</h2>
                                        <button
                                            onClick={() => setShowApprovedRequestsModal(false)}
                                            className="text-gray-500 hover:text-gray-700"
                                        >
                                            <X className="w-6 h-6" />
                                        </button>
                                    </div>

                                    <div className="mb-6">
                                        <p className="text-gray-600">
                                            Please complete payment for your approved license requests below.
                                        </p>
                                    </div>

                                    <div className="space-y-4 max-h-96 overflow-y-auto">
                                        {approvedRequests.map((request) => (
                                            <div key={request.requestId} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h3 className="font-medium text-gray-900">
                                                            {request.licenseType === 'vehicle' ? 'Vehicle' : 'Driving'} License - {request.type.toUpperCase().split('LICENSE')[0]} - LICENSE
                                                        </h3>
                                                        <p className="text-sm text-gray-500 mt-1">
                                                            License: {request.licenseId}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            Submitted: {new Date(request.createdAt).toLocaleString()}
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() => handleInitiatePayment(request)}
                                                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center"
                                                    >
                                                        <span>Pay 100 L.E</span>
                                                        <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-6 flex justify-end">
                                        <button
                                            onClick={() => setShowApprovedRequestsModal(false)}
                                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                                        >
                                            I'll Pay Later
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* {showApprovedRequestsModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-xl font-bold text-gray-800">Approved License Requests</h2>
                                        <button
                                            onClick={() => setShowApprovedRequestsModal(false)}
                                            className="text-gray-500 hover:text-gray-700"
                                        >
                                            <X className="w-6 h-6" />
                                        </button>
                                    </div>

                                    <div className="space-y-4 max-h-96 overflow-y-auto">
                                        {approvedRequests.map((request) => (
                                            <div key={request.id} className="border rounded-lg p-4">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h3 className="font-medium text-gray-900">
                                                            {request.licenseType === 'vehicle' ? 'Vehicle' : 'Driving'} License - {request.requestType}
                                                        </h3>
                                                        <p className="text-sm text-gray-500">
                                                            License: {request.licenseNumber}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            Submitted: {new Date(request.submittedAt).toLocaleString()}
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() => handleInitiatePayment(request)}
                                                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                                    >
                                                        Pay Now (100 L.E)
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-6 flex justify-end">
                                        <button
                                            onClick={() => setShowApprovedRequestsModal(false)}
                                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )} */}
                    {showPaymentReceiptModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-xl font-bold text-gray-800">Payment Receipt</h2>
                                        <button
                                            onClick={() => setShowPaymentReceiptModal(false)}
                                            className="text-gray-500 hover:text-gray-700"
                                        >
                                            <X className="w-6 h-6" />
                                        </button>
                                    </div>

                                    <div className="space-y-4 max-h-96 overflow-y-auto">
                                        <div className="border rounded-lg p-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h3 className="font-medium text-gray-900">
                                                        Payment Receipt
                                                    </h3>
                                                    <p className="text-sm text-gray-500">
                                                        Payment Amount: 100 L.E
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        Payment Date: {new Date().toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='flex space-x-4 justify-end'>
                                        <div className="mt-6 flex justify-end">
                                            <button
                                                onClick={() => setShowPaymentModal(true)}
                                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                            >
                                                Pay Again
                                            </button>
                                        </div>

                                        <div className="mt-6 flex justify-end">
                                            <button
                                                onClick={() => setShowPaymentReceiptModal(false)}
                                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                            >
                                                Close
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {showPaymentModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-xl font-bold text-gray-800">
                                            {selectedRejectedPayment ? 'Resubmit Payment' : 'Payment Information'}
                                        </h2>
                                        <button
                                            onClick={() => {
                                                setShowPaymentModal(false);
                                                setSelectedRequestForPayment(null);
                                                setSelectedRejectedPayment(null);
                                            }}
                                            className="text-gray-500 hover:text-gray-700"
                                        >
                                            <X className="w-6 h-6" />
                                        </button>
                                    </div>

                                    <form onSubmit={handlePaymentSubmit} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Request Details
                                            </label>
                                            <div className="bg-gray-50 p-3 rounded-md">
                                                {selectedRequestForPayment ? (
                                                    <>
                                                        <p className="text-sm">
                                                            {selectedRequestForPayment.licenseType === 'vehicle' ? 'Vehicle' : 'Driving'} License - {selectedRequestForPayment.type.toUpperCase().split('LICENSE')[0]} LICENSE
                                                        </p>
                                                        <p className="text-sm">License: {selectedRequestForPayment.licenseId}</p>
                                                    </>
                                                ) : selectedRejectedPayment ? (
                                                    <>
                                                        <p className="text-sm">
                                                            {selectedRejectedPayment.licenseType === 'vehicle' ? 'Vehicle' : 'Driving'} License - {selectedRejectedPayment.type.toUpperCase().split('LICENSE')[0]} LICENSE
                                                        </p>
                                                        <p className="text-sm">License: {selectedRejectedPayment.licenseId}</p>
                                                        <p className="text-sm text-red-500">Previous rejection reason: {selectedRejectedPayment.adminNotes}</p>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Payment Amount (L.E)
                                            </label>
                                            <input
                                                type="number"
                                                value={100}
                                                readOnly
                                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 bg-gray-100 focus:outline-none sm:text-sm rounded-md"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Payment Method
                                            </label>
                                            <select
                                                value={paymentMethod}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                required
                                            >
                                                <option value="">Select Payment Method</option>
                                                <option value="instapay">Instapay</option>
                                                <option value="fawry">Fawry</option>
                                            </select>
                                        </div>

                                        {paymentMethod && (
                                            <div className="bg-blue-50 p-4 rounded-lg">
                                                <p className="text-sm text-blue-800">
                                                    {paymentMethod === 'instapay' ? (
                                                        <>Transfer to Bank Account: 1234 5678 9012 3456</>
                                                    ) : (
                                                        <>Use Fawry Code: 987654 at any Fawry outlet</>
                                                    )}
                                                </p>
                                            </div>
                                        )}

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Payment Receipt (Image)
                                            </label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => setPaymentReceipt(e.target.files[0])}
                                                className="block w-full text-sm text-gray-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-md file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-indigo-50 file:text-indigo-700
                                    hover:file:bg-indigo-100"
                                                required
                                            />
                                        </div>

                                        <div className="pt-4">
                                            <button
                                                type="submit"
                                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                                disabled={loading}
                                            >
                                                {loading ? 'Submitting...' : 'Submit Payment'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* Payment Modal (updated with fixed amount)
                    {showPaymentModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-xl font-bold text-gray-800">Payment Information</h2>
                                        <button
                                            onClick={() => setShowPaymentModal(false)}
                                            className="text-gray-500 hover:text-gray-700"
                                        >
                                            <X className="w-6 h-6" />
                                        </button>
                                    </div>

                                    <form onSubmit={handlePaymentSubmit} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Request Details
                                            </label>
                                            <div className="bg-gray-50 p-3 rounded-md">
                                                {selectedRequestForPayment && (
                                                    <>
                                                        <p className="text-sm">
                                                            {selectedRequestForPayment.licenseType === 'vehicle' ? 'Vehicle' : 'Driving'} License - {selectedRequestForPayment.type.toUpperCase().split('LICENSE')[0]} LICENSE
                                                        </p>
                                                        <p className="text-sm">License: {selectedRequestForPayment.licenseId}</p>
                                                    </>
                                                )}
                                                {selectedRejectedPayment && (
                                                    <>
                                                        <p className="text-sm">
                                                            {selectedRejectedPayment.licenseType === 'vehicle' ? 'Vehicle' : 'Driving'} License - {selectedRejectedPayment.type.toUpperCase().split('LICENSE')[0]} LICENSE
                                                        </p>
                                                        <p className="text-sm">License: {selectedRejectedPayment.licenseId}</p>
                                                        <p className="text-sm">Reason: {selectedRejectedPayment.adminNotes}</p>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Payment Amount (L.E)
                                            </label>
                                            <input
                                                type="number"
                                                value={100}
                                                readOnly
                                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 bg-gray-100 focus:outline-none sm:text-sm rounded-md"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Payment Method
                                            </label>
                                            <select
                                                value={paymentMethod}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                required
                                            >
                                                <option value="">Select Payment Method</option>
                                                <option value="instapay">Instapay</option>
                                                <option value="fawry">Fawry</option>
                                            </select>
                                        </div>

                                        {paymentMethod && (
                                            <div className="bg-blue-50 p-4 rounded-lg">
                                                <p className="text-sm text-blue-800">
                                                    {paymentMethod === 'instapay' ? (
                                                        <>Transfer to Bank Account: 1234 5678 9012 3456</>
                                                    ) : (
                                                        <>Use Fawry Code: 987654 at any Fawry outlet</>
                                                    )}
                                                </p>
                                            </div>
                                        )}

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Payment Receipt (Image)
                                            </label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => setPaymentReceipt(e.target.files[0])}
                                                className="block w-full text-sm text-gray-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-md file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-indigo-50 file:text-indigo-700
                                    hover:file:bg-indigo-100"
                                                required
                                            />
                                        </div>

                                        <div className="pt-4">
                                            <button
                                                type="submit"
                                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                                disabled={loading}
                                            >
                                                {loading ? 'Submitting...' : 'Submit Payment'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )} */}
                </>
            )}
        </>
    );
}

export default LicenseRequestPage;