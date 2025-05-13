import { useState, useEffect } from 'react';
import { Search, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

export function QuizRequests() {
  const [requests, setRequests] = useState([]);
  
    useEffect(() => {
      // Fetch course requests from the backend
      axios.get('http://localhost:8626/admin/getAllExamRequests', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
        .then(response => {
          setRequests(response.data);
          console.log(response.data);
        })
        .catch(error => {
          console.error('Error fetching course requests:', error);
        });
    }, []);
  
    const handleApprove = (requestId) => {
      axios.post(`http://localhost:8626/admin/approveExamRequest/${requestId}`, {}, {
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
      axios.post(`http://localhost:8626/admin/approveExamRequest/${requestId}`, {}, {
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Quiz Requests</h1>
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quiz Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Request Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {requests.map((request) => (
              <tr key={request.id}>
                <td className="px-6 py-4">{request.userName}</td>
                <td className="px-6 py-4">{request.examType}</td>
                <td className="px-6 py-4">{request.requestDate.split('T')[0]}</td>
                <td className="px-4 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    request.status === 'Approved' ? 'bg-green-100 text-green-800' :
                    request.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {request.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button className="text-green-600 hover:text-green-900"
                      onClick={() => handleApprove(request.id)}
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>
                    <button className="text-red-600 hover:text-red-900"
                      onClick={() => handleDecline(request.id)}
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}