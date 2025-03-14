// import { useState, useEffect, useCallback } from 'react';
// import { Calendar, Plus, Search } from 'lucide-react';

// export function ExamDates() {
//   const [examDates, setExamDates] = useState([
//     {
//       id: '1',
//       userId: 'U123',
//       userName: 'John Smith',
//       examType: 'Practical Driving Test',
//       scheduledDate: '2024-03-20 10:00 AM',
//       location: 'Main Test Center',
//       status: 'Scheduled',
//     },
//   ]);

//   const [showPopup, setShowPopup] = useState(false);
//   const [nationalId, setNationalId] = useState('');
//   const [examType, setExamType] = useState('');
//   const [startDate, setStartDate] = useState('');
//   const [endDate, setEndDate] = useState('');

//   const togglePopup = useCallback(() => {
//     setShowPopup(prev => !prev);
//     if (showPopup) {
//       setNationalId('');
//       setExamType('');
//       setStartDate('');
//       setEndDate('');
//     }
//   }, [showPopup]);

//   // ESC key handler
//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (e.key === 'Escape' && showPopup) {
//         togglePopup();
//       }
//     };
//     window.addEventListener('keydown', handleKeyDown);
//     return () => window.removeEventListener('keydown', handleKeyDown);
//   }, [showPopup, togglePopup]);

//   const handleScheduleExam = () => {
//     const newExam = {
//       id: String(examDates.length + 1),
//       userId: `U${examDates.length + 100}`,
//       userName: 'New User',
//       examType,
//       scheduledDate: startDate,
//       location: 'Main Test Center',
//       status: 'Scheduled',
//     };
//     setExamDates([...examDates, newExam]);
//     togglePopup();
//   };

import { useState, useEffect, useCallback } from 'react';
import { Calendar, Plus, Search, Edit, Trash2, Clock, CheckCircle } from 'lucide-react';

export function ExamDates() {
  const [examDates, setExamDates] = useState([
    {
      id: '1',
      userId: 'U123',
      nationalId: '30112040104528',
      examType: 'Practical Driving Test',
      startDate: '2024-03-20T10:00',
      endDate: '2024-03-20T11:00',
      location: 'Main Test Center',
      status: 'Scheduled',
    },
  ]);

  const [showPopup, setShowPopup] = useState(false);
  const [editExam, setEditExam] = useState(null);
  const [nationalId, setNationalId] = useState('');
  const [examType, setExamType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const togglePopup = useCallback(() => {
    setShowPopup(prev => !prev);
    setEditExam(null);
    if (showPopup) resetForm();
  }, [showPopup]);

  const resetForm = () => {
    setNationalId('');
    setExamType('');
    setStartDate('');
    setEndDate('');
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && showPopup) togglePopup();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showPopup, togglePopup]);

  const handleScheduleExam = () => {
    if (editExam) {
      const updatedExams = examDates.map(exam => 
        exam.id === editExam.id ? { 
          ...exam, 
          examType,
          startDate,
          endDate
        } : exam
      );
      setExamDates(updatedExams);
    } else {
      const newExam = {
        id: String(examDates.length + 1),
        userId: `U${examDates.length + 100}`,
        userName: 'New User',
        examType,
        startDate,
        endDate,
        location: 'Main Test Center',
        status: 'Scheduled',
      };
      setExamDates([...examDates, newExam]);
    }
    togglePopup();
  };

  const handleEditExam = (exam) => {
    setEditExam(exam);
    setExamType(exam.examType);
    setStartDate(exam.startDate);
    setEndDate(exam.endDate);
    setShowPopup(true);
  };

  const handleEndExam = (id) => {
    setExamDates(examDates.map(exam => 
      exam.id === id ? { ...exam, status: 'Completed' } : exam
    ));
  };

  const formatDateTime = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    return new Date(dateString).toLocaleString(undefined, options);
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Exam Dates</h1>
        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search exams..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
          </div>
          <button 
            className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            onClick={togglePopup}
          >
            <Plus className="w-5 h-5" />
            <span>Schedule Exam</span>
          </button>
        </div>
      </div>

      {/* Schedule Exam Popup */}
      {showPopup && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && togglePopup()}
        >
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl p-8 space-y-6">
            <div className="float-end">
              <button onClick={togglePopup}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-700 hover:text-gray-900"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 text-center">Schedule Exam</h1>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">National ID</label>
                  <input
                    type="number"
                    value={nationalId}
                    onChange={(e) => setNationalId(e.target.value)}
                    placeholder="30************"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Exam Type</label>
                  <select
                    value={examType}
                    onChange={(e) => setExamType(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Exam</option>
                    <option value="Theory Test">Theory Test</option>
                    <option value="Practical Driving Test">Practical Driving Test</option>
                    <option value="Road Signs Test">Road Signs Test</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Start Date</label>
                  <input
                    type="datetime-local"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">End Date</label>
                  <input
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={togglePopup}
                  className="px-6 py-3 rounded-lg font-medium text-gray-700 border border-gray-300 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleScheduleExam}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                >
                  Set Exam
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
          <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Exam Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">End Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {examDates.map((exam) => (
              <tr key={exam.id}>
                <td className="px-6 py-4">{exam.nationalId}</td>
                <td className="px-6 py-4">{exam.examType}</td>
                <td className="px-6 py-4">{formatDateTime(exam.startDate)}</td>
                <td className="px-6 py-4">{formatDateTime(exam.endDate)}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    exam.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                    exam.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {exam.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button 
                    onClick={() => handleEditExam(exam)}
                    className="text-indigo-600 hover:text-indigo-900"
                    disabled={exam.status === 'Completed'}
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleEndExam(exam.id)}
                    className="text-red-600 hover:text-red-900"
                    disabled={exam.status === 'Completed'}
                  >
                    {exam.status === 'Completed' ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <Clock className="w-5 h-5" />
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
{/* 
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Exam Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {examDates.map((exam) => (
              <tr key={exam.id}>
                <td className="px-6 py-4">{exam.userName}</td>
                <td className="px-6 py-4">{exam.examType}</td>
                <td className="px-6 py-4">{exam.scheduledDate}</td>
                <td className="px-6 py-4">{exam.location}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    exam.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                    exam.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {exam.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} */}