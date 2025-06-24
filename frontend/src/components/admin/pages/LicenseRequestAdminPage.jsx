
import { Dialog, Transition } from '@headlessui/react';
import React, { useState, useEffect, Fragment } from 'react';
import { CheckCircle, XCircle, Clock, FileText, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

export default function LicenseRequestAdminPage() {
  const [requests, setRequests] = useState([]);
  const [paymentPendingApproval, setPaymentPendingApproval] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [currentImages, setCurrentImages] = useState({
    front: '',
    back: ''
  });
  const [paymentImage, setPaymentImage] = useState('');
  const [paymentImageModalOpen, setPaymentImageModalOpen] = useState(false);

  const [selectedRequests, setSelectedRequests] = useState([]);
  const [isApprovalOpen, setIsApprovalOpen] = useState(false);
  const [isRejectionOpen, setIsRejectionOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchLicenseRequests = async () => {
      try {
        const response = await axios.get('http://localhost:8626/admin/license-requests', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        console.log(response.data);
        setRequests(response.data.map(request => ({
          id: request.requestId,
          userId: request.user.id,
          userName: request.user.name,
          userEmail: request.user.email,
          requestType: request.type,
          licenseType: request.licenseType,
          licenseNumber: request.licenseId,
          status: request.status.toLowerCase(),
          idFrontImage: request.idFrontImage,
          idBackImage: request.idBackImage,
          submittedAt: new Date(request.createdAt).toLocaleString(),
          paymentStatus: request.paymentStatus ? request.paymentStatus.toLowerCase() : null,
          paymentAmount: request.paymentAmount,
          paymentReceipt: request.paymentImage,
          rejectionReason: request.adminNotes,
        })));
      } catch (error) {
        setError(error);
        toast.error('Failed to fetch license requests');
        console.error('Error fetching license requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLicenseRequests();
  }, []);

  useEffect(() => {
    const fetchPaymentPendingApproval = async () => {
      try {
        const response = await axios.get('http://localhost:8626/admin/getAllPendingApprovalPaymentRequests', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        console.log(response.data);
        setPaymentPendingApproval(response.data.map(request => ({
          id: request.requestId,
          userId: request.user.id,
          userName: request.user.name,
          userEmail: request.user.email,
          requestType: request.type,
          licenseType: request.licenseType,
          licenseNumber: request.licenseId,
          status: request.status.toLowerCase(),
          idFrontImage: request.idFrontImage,
          idBackImage: request.idBackImage,
          submittedAt: new Date(request.createdAt).toLocaleString(),
          paymentStatus: request.paymentStatus ? request.paymentStatus.toLowerCase() : null,
          paymentAmount: request.paymentAmount,
          paymentReceipt: request.paymentImage,
          rejectionReason: request.adminNotes,
        })));
      } catch (error) {
        setError(error);
        toast.error('Failed to fetch license requests');
        console.error('Error fetching license requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentPendingApproval();
  }, []);

  const handleSelectRequest = (requestId) => {
    setSelectedRequests(prev =>
      prev.includes(requestId)
        ? prev.filter(id => id !== requestId)
        : [...prev, requestId]
    );
  };

  const handleApproveRequests = async () => {
    setIsProcessing(true);
    try {
      const response = await axios.post(
        'http://localhost:8626/admin/license-requests/approve',
        { requestIds: selectedRequests },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }
        }
      );

      // Update UI
      setRequests(prev => prev.map(request => {
        if (selectedRequests.includes(request.id)) {
          return { ...request, status: 'approved' };
        }
        return request;
      }));

      setSelectedRequests([]);
      setIsApprovalOpen(false);
      toast.success('Requests approved successfully!');
    } catch (error) {
      toast.error('Failed to approve requests');
      console.error('Approval error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectRequest = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Please enter a rejection reason');
      return;
    }

    setIsProcessing(true);
    try {
      const response = await axios.post(
        'http://localhost:8626/admin/rejectRequest',
        {
          requestId: selectedRequests[0],
          rejectionReason
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }
        }
      );

      // Update UI
      setRequests(prev => prev.map(request => {
        if (request.id === selectedRequests[0]) {
          return {
            ...request,
            status: 'rejected',
            rejectionReason
          };
        }
        return request;
      }));

      setSelectedRequests([]);
      setIsRejectionOpen(false);
      setRejectionReason('');
      toast.success('Request rejected successfully!');
    } catch (error) {
      toast.error('Failed to reject request');
      console.error('Rejection error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApprovePaymentRequests = async () => {
    setIsProcessing(true);
    try {
      const response = await axios.post(
        'http://localhost:8626/admin/approvePaymentRequests',
        { requestIds: selectedRequests },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }
        }
      );

      // Update UI for payment requests
      setPaymentPendingApproval(prev => prev.map(request => {
        if (selectedRequests.includes(request.id)) {
          return { ...request, paymentStatus: 'approved' };
        }
        return request;
      }));

      setSelectedRequests([]);
      setIsApprovalOpen(false);
      toast.success('Payment requests approved successfully!');
    } catch (error) {
      toast.error('Failed to approve payment requests');
      console.error('Payment approval error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectPaymentRequest = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Please enter a rejection reason');
      return;
    }

    setIsProcessing(true);
    try {
      const response = await axios.post(
        'http://localhost:8626/admin/rejectPaymentRequest',
        {
          requestId: selectedRequests[0],
          rejectionReason
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }
        }
      );

      // Update UI for payment requests
      setPaymentPendingApproval(prev => prev.map(request => {
        if (request.id === selectedRequests[0]) {
          return {
            ...request,
            paymentStatus: 'rejected',
            rejectionReason
          };
        }
        return request;
      }));

      setSelectedRequests([]);
      setIsRejectionOpen(false);
      setRejectionReason('');
      toast.success('Payment request rejected successfully!');
    } catch (error) {
      toast.error('Failed to reject payment request');
      console.error('Payment rejection error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleViewImages = (request) => {
    setCurrentImages({
      front: request.idFrontImage,
      back: request.idBackImage
    });
    setIsImageModalOpen(true);
  };

  const handleViewPaymentImage = (request) => {
    setPaymentImage(request.paymentReceipt);
    setPaymentImageModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
        <span className="ml-4 text-lg font-medium text-gray-700">Loading license requests...</span>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">License Requests</h1>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Pending Requests</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsApprovalOpen(true)}
                  disabled={selectedRequests.length === 0}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Approve Selected ({selectedRequests.length})
                </button>
                <button
                  onClick={() => setIsRejectionOpen(true)}
                  disabled={selectedRequests.length !== 1}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Reject Selected
                </button>
              </div>
            </div>

            {requests.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No license requests found</h3>
                <p className="mt-1 text-sm text-gray-500">There are currently no pending license requests.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {requests.map((request) => (
                  <div
                    key={request.id}
                    className="border rounded-lg p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-4">
                      <input
                        type="checkbox"
                        checked={selectedRequests.includes(request.id)}
                        onChange={() => handleSelectRequest(request.id)}
                        disabled={request.status !== 'pending'}
                        className="h-5 w-5 text-blue-600 rounded border-gray-300"
                      />
                      <div className={`p-2 rounded-full ${request.status === 'pending' ? 'bg-yellow-100' :
                        request.status === 'approved' ? 'bg-green-100' :
                          'bg-red-100'
                        }`}>
                        {request.status === 'pending' ? (
                          <Clock className="h-6 w-6 text-yellow-600" />
                        ) : request.status === 'approved' ? (
                          <CheckCircle className="h-6 w-6 text-green-600" />
                        ) : (
                          <XCircle className="h-6 w-6 text-red-600" />
                        )}
                      </div>

                      <div>
                        <h3 className="font-medium text-gray-900">
                          {request.userName} ({request.userEmail})
                        </h3>
                        <p className="text-sm text-gray-500">
                          {request.licenseType === 'vehicle' ? 'Vehicle' : 'Driving'} License - {request.requestType.replace(/([A-Z])/g, ' $1').trim()}
                        </p>
                        <p className="text-sm text-gray-500">
                          License: {request.licenseNumber} | Submitted: {request.submittedAt}
                        </p>
                        {request.status === 'rejected' && request.rejectionReason && (
                          <p className="text-sm text-red-500">
                            Rejection Reason: {request.rejectionReason}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => handleViewImages(request)}
                        className="px-3 py-1 text-sm rounded-md bg-blue-100 text-blue-800 hover:bg-blue-200"
                      >
                        View Documents
                      </button>

                      <span className={`px-3 py-1 text-sm rounded-md ${request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        request.status === 'approved' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>


        <div className="bg-white shadow-md rounded-lg overflow-hidden mt-5">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Pending Payment Requests Approval</h2>
              {/* <div className="flex space-x-2">
                <button
                  onClick={() => setIsApprovalOpen(true)}
                  disabled={selectedRequests.length === 0}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Approve Selected ({selectedRequests.length})
                </button>
                <button
                  onClick={() => setIsRejectionOpen(true)}
                  disabled={selectedRequests.length !== 1}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Reject Selected
                </button>
              </div> */}
            </div>

            {paymentPendingApproval.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No license requests found</h3>
                <p className="mt-1 text-sm text-gray-500">There are currently no pending license requests.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {paymentPendingApproval.map((request) => (
                  <div
                    key={request.id}
                    className="border rounded-lg p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-full ${request.paymentStatus === 'pending_approval' ? 'bg-yellow-100' :
                        request.paymentStatus === 'approved' ? 'bg-green-100' :
                          'bg-red-100'
                        }`}>
                        {request.paymentStatus === 'pending_approval' ? (
                          <Clock className="h-6 w-6 text-yellow-600" />
                        ) : request.paymentStatus === 'approved' ? (
                          <CheckCircle className="h-6 w-6 text-green-600" />
                        ) : (
                          <XCircle className="h-6 w-6 text-red-600" />
                        )}
                      </div>

                      <div>
                        <h3 className="font-medium text-gray-900">
                          {request.userName} ({request.userEmail})
                        </h3>
                        <p className="text-sm text-gray-500">
                          {request.licenseType === 'vehicle' ? 'Vehicle' : 'Driving'} License - {request.requestType.replace(/([A-Z])/g, ' $1').trim()}
                        </p>
                        <p className="text-sm text-gray-500">
                          License: {request.licenseNumber} | Submitted: {request.submittedAt}
                        </p>
                        {request.paymentStatus === 'rejected' && request.rejectionReason && (
                          <p className="text-sm text-red-500">
                            Rejection Reason: {request.rejectionReason}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => handleViewPaymentImage(request)}
                        className="px-3 py-1 text-sm rounded-md bg-blue-100 text-blue-800 hover:bg-blue-200"
                      >
                        View Documents
                      </button>

                      {request.paymentStatus === 'pending_approval' ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setSelectedRequests([request.id]);
                              setIsApprovalOpen(true)
                            }}
                            className="px-3 py-1 text-sm rounded-md bg-green-100 text-green-800 hover:bg-green-200"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => {
                              setSelectedRequests([request.id]);
                              setIsRejectionOpen(true)
                            }}
                            className="px-3 py-1 text-sm rounded-md bg-red-100 text-red-800 hover:bg-red-200"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className={`px-3 py-1 text-sm rounded-md ${request.paymentStatus === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                          {request.paymentStatus.charAt(0).toUpperCase() + request.paymentStatus.slice(1)}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {/* {paymentPendingApproval.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No license requests found</h3>
                <p className="mt-1 text-sm text-gray-500">There are currently no pending license requests.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {paymentPendingApproval.map((request) => (
                  <div
                    key={request.id}
                    className="border rounded-lg p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-4">
                      <input
                        type="checkbox"
                        checked={selectedRequests.includes(request.id)}
                        onChange={() => handleSelectRequest(request.id)}
                        disabled={request.paymentStatus !== 'pending_approval'}
                        className="h-5 w-5 text-blue-600 rounded border-gray-300"
                      />
                      <div className={`p-2 rounded-full ${request.paymentStatus === 'pending_approval' ? 'bg-yellow-100' :
                        request.paymentStatus === 'approved' ? 'bg-green-100' :
                          'bg-red-100'
                        }`}>
                        {request.paymentStatus === 'pending_approval' ? (
                          <Clock className="h-6 w-6 text-yellow-600" />
                        ) : request.paymentStatus === 'approved' ? (
                          <CheckCircle className="h-6 w-6 text-green-600" />
                        ) : (
                          <XCircle className="h-6 w-6 text-red-600" />
                        )}
                      </div>

                      <div>
                        <h3 className="font-medium text-gray-900">
                          {request.userName} ({request.userEmail})
                        </h3>
                        <p className="text-sm text-gray-500">
                          {request.licenseType === 'vehicle' ? 'Vehicle' : 'Driving'} License - {request.requestType.replace(/([A-Z])/g, ' $1').trim()}
                        </p>
                        <p className="text-sm text-gray-500">
                          License: {request.licenseNumber} | Submitted: {request.submittedAt}
                        </p>
                        {request.paymentStatus === 'rejected' && request.rejectionReason && (
                          <p className="text-sm text-red-500">
                            Rejection Reason: {request.rejectionReason}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => handleViewPaymentImage(request)}
                        className="px-3 py-1 text-sm rounded-md bg-blue-100 text-blue-800 hover:bg-blue-200"
                      >
                        View Documents
                      </button>

                      <span className={`px-3 py-1 text-sm rounded-md ${request.paymentStatus === 'pending_approval' ? 'bg-yellow-100 text-yellow-800' :
                        request.paymentStatus === 'approved' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                        {request.paymentStatus === 'pending_approval' ? 'Pending Approval' : request.paymentStatus.charAt(0).toUpperCase() + request.paymentStatus.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )} */}
          </div>
        </div>

        {/* Approval Confirmation Modal */}
        {isApprovalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Confirm Approval</h2>
                  <button
                    onClick={() => setIsApprovalOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <p className="mb-6">Are you sure you want to approve {selectedRequests.length} selected request(s)?</p>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsApprovalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      // Check if we're in the payment requests section
                      const isPaymentApproval = paymentPendingApproval.some(
                        req => selectedRequests.includes(req.id)
                      );

                      if (isPaymentApproval) {
                        handleApprovePaymentRequests();
                      } else {
                        handleApproveRequests();
                      }
                    }}
                    disabled={isProcessing}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <span className="flex items-center">
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Approving...
                      </span>
                    ) : (
                      'Confirm Approval'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* {isApprovalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Confirm Approval</h2>
                  <button
                    onClick={() => setIsApprovalOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <p className="mb-6">Are you sure you want to approve {selectedRequests.length} selected license request(s)?</p>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsApprovalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleApproveRequests}
                    disabled={isProcessing}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <span className="flex items-center">
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Approving...
                      </span>
                    ) : (
                      'Confirm Approval'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )} */}

        {/* Rejection Modal */}
        {isRejectionOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Reject Request</h2>
                  <button
                    onClick={() => setIsRejectionOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={(e) => {
                  e.preventDefault();
                  // Check if we're in the payment requests section
                  const isPaymentRejection = paymentPendingApproval.some(
                    req => selectedRequests.includes(req.id)
                  );

                  if (isPaymentRejection) {
                    handleRejectPaymentRequest();
                  } else {
                    handleRejectRequest();
                  }
                }}>
                  {/* {isRejectionOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Reject Request</h2>
                  <button
                    onClick={() => setIsRejectionOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleRejectRequest(); }}> */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reason for Rejection
                    </label>
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Explain why this request is being rejected..."
                      required
                    />
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsRejectionOpen(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                    >
                      {isProcessing ? (
                        <span className="flex items-center">
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Rejecting...
                        </span>
                      ) : (
                        'Confirm Rejection'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
      <Transition appear show={isImageModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsImageModalOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-75" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 mb-4"
                  >
                    ID Documents
                  </Dialog.Title>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Front Side</h4>
                      {currentImages.front ? (
                        <img
                          src={currentImages.front}
                          alt="ID Front"
                          className="w-full h-auto rounded-md border border-gray-200"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-48 bg-gray-100 rounded-md border border-gray-200">
                          <span className="text-gray-500">No front image available</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Back Side</h4>
                      {currentImages.back ? (
                        <img
                          src={currentImages.back}
                          alt="ID Back"
                          className="w-full h-auto rounded-md border border-gray-200"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-48 bg-gray-100 rounded-md border border-gray-200">
                          <span className="text-gray-500">No back image available</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => setIsImageModalOpen(false)}
                    >
                      Close
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <Transition appear show={paymentImageModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsImageModalOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-75" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 mb-4"
                  >
                    ID Documents
                  </Dialog.Title>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Payment Receipt</h4>
                  {paymentImage ? (
                    <img
                      src={paymentImage}
                      alt="Payment Receipt"
                      className="w-full h-auto rounded-md border border-gray-200"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-48 bg-gray-100 rounded-md border border-gray-200">
                      <span className="text-gray-500">No Payment Receipt available</span>
                    </div>
                  )}

                  <div className="mt-6 flex justify-end">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => setPaymentImageModalOpen(false)}
                    >
                      Close
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}