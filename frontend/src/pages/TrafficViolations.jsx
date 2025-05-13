import React, { useState, useEffect } from 'react';
import { AlertCircle, DollarSign, CheckCircle, Upload, Loader2, Wallet, AlertTriangle, FileText } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import Layout from '../components/Layout';

export default function TrafficViolations() {
  const [violations, setViolations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedViolations, setSelectedViolations] = useState([]);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentReceipt, setPaymentReceipt] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Grievance Modal States
  const [isGrievanceOpen, setIsGrievanceOpen] = useState(false);
  const [selectedViolationForGrievance, setSelectedViolationForGrievance] = useState(null);
  const [grievanceDescription, setGrievanceDescription] = useState('');

  useEffect(() => {
    const fetchViolations = async () => {
      try {
        const response = await axios.get('http://localhost:8626/users/me/violations', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        // Transform response to match component requirements
        const transformedViolations = response.data.violations.map(violation => ({
          id: violation.violationNumber,
          date: new Date(violation.date).toLocaleDateString(),
          type: violation.type,
          title: violation.title,
          description: violation.description,
          fine: violation.fineAmount,
          status: violation.status.toLowerCase(),
          paymentImage: violation.paymentImage,
          grievanceStatus: violation.grievanceStatus ? violation.grievanceStatus.toLowerCase() : null,
          grievanceDescription: violation.grievanceDescription,
          grievanceDate: violation.grievanceDate ? new Date(violation.grievanceDate).toLocaleDateString() : null,
        }));

        setViolations(transformedViolations);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setViolations([]);

        }
        else {
          setError(error);
          toast.error('Failed to fetch violations');
          console.error('Error fetching violations:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchViolations();
  }, []);

  const handleSelectViolation = (violationId) => {
    setSelectedViolations(prev =>
      prev.includes(violationId)
        ? prev.filter(id => id !== violationId)
        : [...prev, violationId]
    );
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create FormData object
      const formData = new FormData();

      // Append the payment receipt file
      if (paymentReceipt) {
        formData.append('payment', paymentReceipt);
      }

      // Append all selected violation numbers as comma-separated string
      formData.append('violationNumbers', selectedViolations.join(','));

      // Send to backend
      const response = await axios.post(
        'http://localhost:8626/users/me/violations/payment',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }
        }
      );

      if (response.status === 200) {
        // Update UI for all selected violations
        // Optimistically update the UI while we fetch fresh data
        setViolations(prev => prev.map(v => {
          if (selectedViolations.includes(v.id)) {
            return {
              ...v,
              status: 'pending_approval', // Update status to pending_approval
              paymentImage: URL.createObjectURL(paymentReceipt) // Create a preview URL
            };
          }
          return v;
        }));
        setSelectedViolations([]);
        setIsPaymentOpen(false);
        setPaymentMethod('');
        setPaymentReceipt(null);
        toast.success('Payment submitted for all selected violations! Waiting for admin approval.');
      } else {
        toast.error('Failed to submit payment');
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to submit payment');
      console.error('Payment error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleGrievanceSubmit = async (e) => {
    e.preventDefault();
    if (!grievanceDescription.trim()) {
      toast.error('Please enter a grievance description');
      return;
    }

    try {
      // Send to backend
      const response = await axios.post(
        `http://localhost:8626/users/me/violations/grievance/${selectedViolationForGrievance.id}`,
        {
          grievanceDescription,
          grievanceDate: new Date().toISOString()
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }
        });

      // Update UI
      setViolations(prev => prev.map(v =>
        v.id === selectedViolationForGrievance.id
          ? { ...v, grievanceStatus: 'pending', grievanceDescription: grievanceDescription }
          : v
      ));

      // Reset states
      setIsGrievanceOpen(false);
      setSelectedViolationForGrievance(null);
      setGrievanceDescription('');

      toast.success('Grievance submitted successfully!');
    } catch (error) {
      toast.error('Failed to submit grievance');
      console.error('Grievance error:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
        <span className="ml-4 text-lg font-medium text-gray-700">Loading violations...</span>
      </div>
    );
  }

  // if (error) {
  //   return (
  //     <div className="flex justify-center items-center min-h-screen bg-red-50">
  //       <div className="text-red-600 p-4 rounded-md border border-red-200">
  //         <p>Failed to load traffic violations</p>
  //         <button
  //           onClick={() => window.location.reload()}
  //           className="mt-2 text-sm text-white bg-red-600 px-3 py-1 rounded hover:bg-red-700"
  //         >
  //           Try Again
  //         </button>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <>
      <Layout navigation={[
        { name: 'Dashboard', href: '/dashboard' },
        { name: 'Driving License', href: '/driving-license-public' },
        { name: 'Car License', href: '/car-license' },
        { name: 'Violations', href: '/violations' },
      ]} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Traffic Violations</h1>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Your Violations</h2>
              <button
                onClick={() => setIsPaymentOpen(true)}
                disabled={selectedViolations.length === 0}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Pay Selected ({selectedViolations.length})
              </button>
            </div>

            {violations.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No violations found</h3>
                <p className="mt-1 text-sm text-gray-500">You currently have no traffic violations.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {violations.map((violation) => (
                  <div
                    key={violation.id}
                    className="border rounded-lg p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-4">
                      <input
                        type="checkbox"
                        checked={selectedViolations.includes(violation.id)}
                        onChange={() => handleSelectViolation(violation.id)}
                        disabled={violation.status === 'paid' || violation.status === 'pending_approval' || violation.status === 'dismissed' || violation.grievanceStatus === 'pending'}
                        className="h-5 w-5 text-blue-600 rounded border-gray-300"
                      />
                      <div className={`p-2 rounded-full ${violation.status === 'pending' ? 'bg-red-100' :
                        violation.status === 'unpaid' ? 'bg-yellow-100' :
                          violation.status === 'dismissed' ? 'bg-orange-100' :
                            violation.status === 'pending_approval' ? 'bg-purple-100' :
                              'bg-green-100'
                        }`}>
                        {/* Status icons */}
                        {violation.status === 'pending' ? (
                          <AlertCircle className="h-6 w-6 text-red-600" />
                        ) : violation.status === 'unpaid' ? (
                          <Wallet className="h-6 w-6 text-yellow-600" />
                        ) : violation.status === 'dismissed' ? (
                          // <AlertTriangle className="h-6 w-6 text-orange-600" />
                          <CheckCircle className="h-6 w-6 text-green-600" />
                        ) : violation.status === 'pending_approval' ? (
                          <Loader2 className="h-6 w-6 text-purple-600 animate-spin" />
                        ) : (
                          <CheckCircle className="h-6 w-6 text-green-600" />
                        )}
                      </div>

                      <div>
                        <h3 className="font-medium text-gray-900">{violation.type}</h3>
                        <p className="text-sm text-gray-500">{violation.title}</p>
                        <p className="text-sm text-gray-500">Date: {violation.date}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="flex items-center text-gray-900">
                        <DollarSign className="h-5 w-5 text-gray-400" />
                        <span className="font-medium">{violation.fine}</span>
                      </div>

                      {/* Grievance Button */}
                      {violation.status === 'unpaid' &&
                        <button
                          onClick={() => {
                            setSelectedViolationForGrievance(violation);
                            setIsGrievanceOpen(true);
                          }}
                          disabled={violation.status === 'paid' || violation.grievanceStatus === 'pending' || violation.grievanceStatus === 'accepted' || violation.grievanceStatus === 'rejected'}
                          className={`px-3 py-1 text-sm rounded-md ${violation.grievanceStatus === 'pending'
                            ? 'bg-yellow-100 text-yellow-800 cursor-not-allowed'
                            : violation.grievanceStatus === 'accepted' || violation.grievanceStatus === 'rejected'
                              ? 'bg-gray-100 text-gray-800 cursor-not-allowed'
                              : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                            }`}
                        >
                          {violation.grievanceStatus === 'pending'
                            ? 'Grievance Pending'
                            : violation.grievanceStatus === 'accepted'
                              ? 'Grievance Accepted'
                              : violation.grievanceStatus === 'rejected'
                                ? 'Grievance Rejected'
                                : 'File Grievance'
                          }
                        </button>}

                      {/* Status Badge */}
                      {violation.status === 'pending_approval' && (
                        <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50" disabled>
                          Pending Approval
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-gray-50 px-6 py-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Total Payable Fines</span>
              <span className="font-medium text-gray-900">
                {/* {violations.filter(v => v.status === 'unpaid').reduce((sum, v) => sum + v.fine, 0).toFixed(2)} */}
                {selectedViolations.filter(id => violations.find(v => v.id === id).status === 'unpaid').reduce((sum, id) => sum + violations.find(v => v.id === id).fine, 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Grievance Modal */}
        {isGrievanceOpen && selectedViolationForGrievance && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">File Grievance</h2>
                  <button
                    onClick={() => setIsGrievanceOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleGrievanceSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Violation ID: {selectedViolationForGrievance.id}
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={grievanceDescription}
                      onChange={(e) => setGrievanceDescription(e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Describe your grievance..."
                      required
                    />
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsGrievanceOpen(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center">
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Submitting...
                        </span>
                      ) : (
                        'Submit Grievance'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Payment Modal - Existing code */}
        {isPaymentOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Details</h2>

                <form onSubmit={handlePaymentSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total Amount: ${selectedViolations.reduce(
                        (sum, id) => sum + violations.find(v => v.id === id).fine,
                        0
                      )}
                    </label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload Payment Receipt
                    </label>
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500">
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={(e) => setPaymentReceipt(e.target.files[0])}
                        className="hidden"
                        required
                      />
                      {paymentReceipt ? (
                        <span className="text-sm text-gray-600">{paymentReceipt.name}</span>
                      ) : (
                        <div className="flex flex-col items-center">
                          <Upload className="h-8 w-8 text-gray-400 mb-2" />
                          <span className="text-sm text-gray-600">Click to upload receipt</span>
                        </div>
                      )}
                    </label>
                  </div>

                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => setIsPaymentOpen(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        'Submit Payment'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}