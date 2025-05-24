import { useState, useEffect } from 'react';
import { Search, CheckCircle, XCircle, Eye, X } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export function CourseRequests() {
  const [requests, setRequests] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    // Fetch course requests from the backend
    axios.get('http://localhost:8626/admin/getAllCourses', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(response => {
        setRequests(response.data);
      })
      .catch(error => {
        console.error('Error fetching course requests:', error);
      });
  }, []);

  const handleApprove = (requestId) => {
    axios.post(`http://localhost:8626/admin/approveCourse/${requestId}`, {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(response => {
        toast.success('Request approved successfully');
        setRequests(requests.filter(request => request.id !== requestId));
      })
      .catch(error => {
        console.error('Error approving request:', error);
        toast.error('Failed to approve request');
      });
  };

  const handleDecline = (requestId) => {
    axios.post(`http://localhost:8626/admin/declineCourse/${requestId}`, {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(response => {
        toast.success('Request declined successfully');
        setRequests(requests.filter(request => request.id !== requestId));
      })
      .catch(error => {
        console.error('Error declining request:', error);
        toast.error('Failed to decline request');
      });
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    console.log(request)
    setShowDetails(true);
  };

  const closeDetails = () => {
    setShowDetails(false);
    setSelectedRequest(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Course Requests</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search requests..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Request Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {requests.map((request) => (
              <tr key={request.id}>
                <td className="px-6 py-4">{request.userName}</td>
                <td className="px-6 py-4">{request.requestDate.split('T')[0]}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${request.status === 'Approved' ? 'bg-green-100 text-green-800' :
                      request.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                    }`}>
                    {request.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button
                      className="text-green-600 hover:text-green-900"
                      onClick={() => handleApprove(request.id)}
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-900"
                      onClick={() => handleDecline(request.id)}
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                    <button
                      className="text-gray-600 hover:text-gray-900"
                      onClick={() => handleViewDetails(request)}
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Request Details Modal */}
      {showDetails && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Request Details</h2>
                <button
                  onClick={closeDetails}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">User Information</h3>
                    <div className="mt-1">
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">Name:</span> {selectedRequest.userName}
                      </p>
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">National ID:</span> {selectedRequest.nationalId}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Request Details</h3>
                    <div className="mt-1">
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">Request ID:</span> {selectedRequest.id}
                      </p>
                      {/* <p className="text-sm text-gray-900">
                        <span className="font-medium">Type:</span> {selectedRequest.type}
                      </p> */}
                      {/* <p className="text-sm text-gray-900">
                        <span className="font-medium">License Type:</span> {selectedRequest.licenseType}
                      </p> */}
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">Status:</span>
                        <span className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${selectedRequest.status === 'Approved' ? 'bg-green-100 text-green-800' :
                            selectedRequest.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                          }`}>
                          {selectedRequest.status}
                        </span>
                      </p>
                      {/* <p className="text-sm text-gray-900">
                        <span className="font-medium">Request Date:</span> {new Date(selectedRequest.createdAt).toLocaleString()}
                      </p> */}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Payment Receipt</h3>
                  <div className="mt-2 border rounded-lg overflow-hidden">
                    {selectedRequest.paymentImage ? (
                      <img
                        src={selectedRequest.paymentImage}
                        alt="Payment Receipt"
                        className="w-full h-auto object-contain max-h-64"
                      />
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        No payment receipt available
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-4">
                <button
                  onClick={() => handleDecline(selectedRequest.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Decline Request
                </button>
                <button
                  onClick={() => handleApprove(selectedRequest.id)}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Approve Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
// import { useState, useEffect } from 'react';
// import { Search, CheckCircle, XCircle, Eye } from 'lucide-react';
// import axios from 'axios';
// import { toast } from 'react-hot-toast';

// export function CourseRequests() {
//   const [requests, setRequests] = useState([]);
//   const [showDetails, setShowDetails] = useState(false);
//   const [selectedRequest, setSelectedRequest] = useState(null);

//   useEffect(() => {
//     // Fetch course requests from the backend
//     axios.get('http://localhost:8626/admin/getAllCourses', {
//       headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//     })
//       .then(response => {
//         setRequests(response.data);
//       })
//       .catch(error => {
//         console.error('Error fetching course requests:', error);
//       });
//   }, []);

//   const handleApprove = (requestId) => {
//     axios.post(`http://localhost:8626/admin/approveCourse/${requestId}`, {}, {
//       headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//     })
//       .then(response => {
//         toast.success('Request approved successfully');
//         setRequests(requests.filter(request => request.id !== requestId));
//       })
//       .catch(error => {
//         console.error('Error approving request:', error);
//         toast.error('Failed to approve request');
//       });
//   };

//   const handleDecline = (requestId) => {
//     axios.post(`http://localhost:8626/admin/declineCourse/${requestId}`, {}, {
//       headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//     })
//       .then(response => {
//         toast.success('Request declined successfully');
//         setRequests(requests.filter(request => request.id !== requestId));
//       })
//       .catch(error => {
//         console.error('Error declining request:', error);
//         toast.error('Failed to decline request');
//       });
//   };

//   const handleViewDetails = (request) => {
//     setSelectedRequest(request);
//     setShowDetails(true);
//   };


//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <h1 className="text-2xl font-bold text-gray-800">Course Requests</h1>
//         <div className="relative">
//           <input
//             type="text"
//             placeholder="Search requests..."
//             className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
//           />
//           <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
//         </div>
//       </div>

//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead>
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
//               {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course Type</th> */}
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Request Date</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200">
//             {requests.map((request) => (
//               <tr key={request.id}>
//                 <td className="px-6 py-4">{request.userName}</td>
//                 {/* <td className="px-6 py-4">{request.courseType}</td> */}
//                 <td className="px-6 py-4">{request.requestDate.split('T')[0]}</td>
//                 <td className="px-6 py-4">
//                   <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                     request.status === 'Approved' ? 'bg-green-100 text-green-800' :
//                     request.status === 'Rejected' ? 'bg-red-100 text-red-800' :
//                     'bg-yellow-100 text-yellow-800'
//                   }`}>
//                     {request.status}
//                   </span>
//                 </td>
//                 <td className="px-6 py-4">
//                   <div className="flex space-x-2">
//                     <button className="text-green-600 hover:text-green-900"
//                       onClick={() => handleApprove(request.id)}
//                     >
//                       <CheckCircle className="w-5 h-5" />
//                     </button>
//                     <button className="text-red-600 hover:text-red-900"
//                       onClick={() => handleDecline(request.id)}
//                     >
//                       <XCircle className="w-5 h-5" />
//                     </button>
//                     <button className="text-gray-600 hover:text-gray-900"
//                     onClick={() => handleViewDetails(request)}
//                     >
//                       <Eye className="w-5 h-5" />
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }