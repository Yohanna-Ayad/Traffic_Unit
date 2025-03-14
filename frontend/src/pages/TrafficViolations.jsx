// import React, { useState } from 'react';
// import { AlertCircle, DollarSign, CheckCircle, Upload, Loader2 } from 'lucide-react';
// import { toast } from 'react-hot-toast';
// import Layout from '../components/Layout';

// const user = JSON.parse(localStorage.getItem('user'));
// const drivingLicense = user ? user.hasDrivingLicense : false;
// const carLicense = user ? user.hasCarLicense : false;

// const initialViolations = [
//   {
//     id: 'V001',
//     date: '2024-03-15',
//     type: 'Speeding',
//     location: 'Main Street',
//     fine: 150,
//     status: 'pending'
//   },
//   {
//     id: 'V002',
//     date: '2024-03-10',
//     type: 'Red Light',
//     location: 'Central Avenue',
//     fine: 200,
//     status: 'paid'
//   },
//   {
//     id: 'V003',
//     date: '2024-03-05',
//     type: 'Illegal Parking',
//     location: 'Market Square',
//     fine: 100,
//     status: 'pending'
//   }
// ];

// export default function TrafficViolations() {
//   const [violations, setViolations] = useState(initialViolations);
//   const [selectedViolations, setSelectedViolations] = useState([]);
//   const [isPaymentOpen, setIsPaymentOpen] = useState(false);
//   const [paymentMethod, setPaymentMethod] = useState('');
//   const [paymentReceipt, setPaymentReceipt] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const totalAmount = selectedViolations.reduce(
//     (sum, id) => sum + violations.find(v => v.id === id).fine,
//     0
//   );

//   const handleSelectViolation = (violationId) => {
//     setSelectedViolations(prev =>
//       prev.includes(violationId)
//         ? prev.filter(id => id !== violationId)
//         : [...prev, violationId]
//     );
//   };

//   const handlePaymentSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     // Simulate API call
//     setTimeout(() => {
//       setViolations(prev => prev.map(v =>
//         selectedViolations.includes(v.id) ? { ...v, status: 'pending' } : v
//       ));
//       setIsPaymentOpen(false);
//       setSelectedViolations([]);
//       setPaymentMethod('');
//       setPaymentReceipt(null);
//       toast.success('Payment request submitted! Waiting for admin approval.');
//       setIsSubmitting(false);
//     }, 2000);
//   };

//   return (
//     <>
//       <Layout navigation={[
//         { name: 'Dashboard', href: '/dashboard' },
//         drivingLicense ? null : { name: 'Driving License', href: '/driving-license' },
//         { name: 'Car License', href: '/car-license' },
//         { name: 'Violations', href: '/violations' },
//         { name: 'Digital Sticker', href: '/digital-sticker' },
//       ].filter(Boolean)} />

//       <div className="max-w-4xl mx-auto px-4 py-8">
//         <h1 className="text-3xl font-bold text-gray-900 mb-8">Traffic Violations</h1>

//         <div className="bg-white shadow-md rounded-lg overflow-hidden">
//           <div className="p-6">
//             <div className="flex items-center justify-between mb-6">
//               <h2 className="text-xl font-semibold text-gray-900">Your Violations</h2>
//               <button
//                 onClick={() => setIsPaymentOpen(true)}
//                 disabled={selectedViolations.length === 0}
//                 className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 Pay Selected ({selectedViolations.length})
//               </button>
//             </div>

//             <div className="space-y-4">
//               {violations.map((violation) => (
//                 <div
//                   key={violation.id}
//                   className="border rounded-lg p-4 flex items-center justify-between"
//                 >
//                   <div className="flex items-center space-x-4">
//                     <input
//                       type="checkbox"
//                       checked={selectedViolations.includes(violation.id)}
//                       onChange={() => handleSelectViolation(violation.id)}
//                       disabled={violation.status !== 'pending'}
//                       className="h-5 w-5 text-blue-600 rounded border-gray-300"
//                     />
//                     <div className={`p-2 rounded-full ${violation.status === 'pending' ? 'bg-red-100' : 'bg-green-100'}`}>
//                       {violation.status === 'pending' ? (
//                         <AlertCircle className="h-6 w-6 text-red-600" />
//                       ) : (
//                         <CheckCircle className="h-6 w-6 text-green-600" />
//                       )}
//                     </div>
//                     <div>
//                       <h3 className="font-medium text-gray-900">{violation.type}</h3>
//                       <p className="text-sm text-gray-500">
//                         {violation.date} - {violation.location}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex items-center space-x-4">
//                     <div className="flex items-center text-gray-900">
//                       <DollarSign className="h-5 w-5 text-gray-400" />
//                       <span className="font-medium">{violation.fine}</span>
//                     </div>
//                     {violation.status === 'pending' && (
//                       <button
//                         className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
//                         disabled
//                       >
//                         Pending Approval
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="bg-gray-50 px-6 py-4">
//             <div className="flex justify-between text-sm">
//               <span className="text-gray-500">Total Pending Fines</span>
//               <span className="font-medium text-gray-900">
//                 ${violations.filter(v => v.status === 'pending').reduce((sum, v) => sum + v.fine, 0)}
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* Payment Modal */}
//         {isPaymentOpen && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
//             <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
//               <div className="p-6">
//                 <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Details</h2>

//                 <form onSubmit={handlePaymentSubmit} className="space-y-6">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Total Amount: ${totalAmount}
//                     </label>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Payment Method
//                     </label>
//                     <select
//                       value={paymentMethod}
//                       onChange={(e) => setPaymentMethod(e.target.value)}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                       required
//                     >
//                       <option value="">Select Payment Method</option>
//                       <option value="instapay">Instapay</option>
//                       <option value="fawry">Fawry</option>
//                     </select>
//                   </div>

//                   {paymentMethod && (
//                     <div className="bg-blue-50 p-4 rounded-lg">
//                       <p className="text-sm text-blue-800">
//                         {paymentMethod === 'instapay' ? (
//                           <>Please transfer to Bank Account: 1234 5678 9012 3456</>
//                         ) : (
//                           <>Use Fawry Code: 987654 at any Fawry outlet</>
//                         )}
//                       </p>
//                     </div>
//                   )}

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Upload Payment Receipt
//                     </label>
//                     <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500">
//                       <input
//                         type="file"
//                         accept="image/*"
//                         onChange={(e) => setPaymentReceipt(e.target.files[0])}
//                         className="hidden"
//                         required
//                       />
//                       {paymentReceipt ? (
//                         <span className="text-sm text-gray-600">{paymentReceipt.name}</span>
//                       ) : (
//                         <div className="flex flex-col items-center">
//                           <Upload className="h-8 w-8 text-gray-400 mb-2" />
//                           <span className="text-sm text-gray-600">
//                             Click to upload receipt
//                           </span>
//                         </div>
//                       )}
//                     </label>
//                   </div>

//                   <div className="flex justify-end space-x-4">
//                     <button
//                       type="button"
//                       onClick={() => setIsPaymentOpen(false)}
//                       className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       type="submit"
//                       disabled={isSubmitting}
//                       className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
//                     >
//                       {isSubmitting ? (
//                         <Loader2 className="h-5 w-5 animate-spin" />
//                       ) : (
//                         'Submit Payment'
//                       )}
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// }

import React, { useState } from 'react';
import { AlertCircle, DollarSign, CheckCircle, Upload, Loader2, Wallet, AlertTriangle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Layout from '../components/Layout';

const user = JSON.parse(localStorage.getItem('user'));
const drivingLicense = user ? user.hasDrivingLicense : false;
const carLicense = user ? user.hasCarLicense : false;

const initialViolations = [
  {
    id: 'V001',
    date: '2024-03-15',
    type: 'Speeding',
    location: 'Main Street',
    fine: 150,
    status: 'pending'
  },
  {
    id: 'V002',
    date: '2024-03-10',
    type: 'Red Light',
    location: 'Central Avenue',
    fine: 200,
    status: 'paid'
  },
  {
    id: 'V003',
    date: '2024-03-05',
    type: 'Illegal Parking',
    location: 'Market Square',
    fine: 100,
    status: 'pending'
  },
  {
    id: 'V004',
    date: '2024-04-01',
    type: 'Illegal U-turn',
    location: 'Downtown',
    fine: 75,
    status: 'unpaid'
  },
  {
    id: 'V005',
    date: '2024-04-05',
    type: 'Expired Registration',
    location: 'Highway Patrol',
    fine: 200,
    status: 'disputed'
  }
];

export default function TrafficViolations() {
  const [violations, setViolations] = useState(initialViolations);
  const [selectedViolations, setSelectedViolations] = useState([]);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentReceipt, setPaymentReceipt] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalAmount = selectedViolations.reduce(
    (sum, id) => sum + violations.find(v => v.id === id).fine,
    0
  );

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
    
    // Simulate API call
    setTimeout(() => {
      setViolations(prev => prev.map(v => 
        selectedViolations.includes(v.id) ? {...v, status: 'pending_approval'} : v
      ));
      setIsPaymentOpen(false);
      setSelectedViolations([]);
      setPaymentMethod('');
      setPaymentReceipt(null);
      toast.success('Payment request submitted! Waiting for admin approval.');
      setIsSubmitting(false);
    }, 2000);
  };

  return (
    <>
      <Layout navigation={[
        { name: 'Dashboard', href: '/dashboard' },
        drivingLicense ? null : { name: 'Driving License', href: '/driving-license-public' },
        { name: 'Car License', href: '/car-license' },
        { name: 'Violations', href: '/violations' },
        // { name: 'Digital Sticker', href: '/digital-sticker' },
      ].filter(Boolean)} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Traffic Violations</h1>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Your Violations</h2>
              <button 
                onClick={() => setIsPaymentOpen(true)}
                disabled={selectedViolations.length === 0}
                className="inline-flex items-center px-4 py-2 border border-transpare nt text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Pay Selected ({selectedViolations.length})
              </button>
            </div>

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
                      disabled={violation.status === 'pending' || violation.status === 'disputed' || violation.status === 'paid'}
                      className="h-5 w-5 text-blue-600 rounded border-gray-300"
                    />
                    <div className={`p-2 rounded-full ${
                      violation.status === 'pending' ? 'bg-red-100' :
                      violation.status === 'unpaid' ? 'bg-yellow-100' :
                      violation.status === 'disputed' ? 'bg-orange-100' :
                      violation.status === 'pending_approval' ? 'bg-purple-100' :
                      'bg-green-100'}`}>
                      {violation.status === 'pending' ? (
                        <AlertCircle className="h-6 w-6 text-red-600" />
                      ) : violation.status === 'unpaid' ? (
                        <Wallet className="h-6 w-6 text-yellow-600" />
                      ) : violation.status === 'disputed' ? (
                        <AlertTriangle className="h-6 w-6 text-orange-600" />
                      ) : violation.status === 'pending_approval' ? (
                        <Loader2 className="h-6 w-6 text-purple-600 animate-spin" />
                      ) : (
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{violation.type}</h3>
                      <p className="text-sm text-gray-500">
                        {violation.date} - {violation.location}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-gray-900">
                      <DollarSign className="h-5 w-5 text-gray-400" />
                      <span className="font-medium">{violation.fine}</span>
                    </div>
                    {violation.status === 'pending_approval' ? (
                      <button 
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                        disabled
                      >
                        Pending Approval
                      </button>
                    ) : violation.status === 'pending' ? (
                      <button 
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                        disabled
                      >
                        Processing
                      </button>
                    ) : violation.status === 'disputed' && (
                      <button 
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                        disabled
                      >
                        Under Review
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 px-6 py-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Total Payable Fines</span>
              <span className="font-medium text-gray-900">
                ${violations
                  .filter(v => v.status === 'unpaid')
                  .reduce((sum, v) => sum + v.fine, 0)}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Modal */}
        {isPaymentOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Details</h2>
                
                <form onSubmit={handlePaymentSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total Amount: ${totalAmount}
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
                          <>Please transfer to Bank Account: 1234 5678 9012 3456</>
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
                        accept="image/*"
                        onChange={(e) => setPaymentReceipt(e.target.files[0])}
                        className="hidden"
                        required
                      />
                      {paymentReceipt ? (
                        <span className="text-sm text-gray-600">{paymentReceipt.name}</span>
                      ) : (
                        <div className="flex flex-col items-center">
                          <Upload className="h-8 w-8 text-gray-400 mb-2" />
                          <span className="text-sm text-gray-600">
                            Click to upload receipt
                          </span>
                        </div>
                      )}
                    </label>
                  </div>

                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => setIsPaymentOpen(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
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