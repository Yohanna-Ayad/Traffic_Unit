import { useState, useEffect, useCallback } from 'react';
import { Calendar, Plus, Search, Edit, Trash2, Clock, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

export function ExamDates() {
  const [examRequestDates, setExamRequestDates] = useState([]);
  const [examDates, setExamDates] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [editExam, setEditExam] = useState(null);
  const [nationalId, setNationalId] = useState('');
  const [examType, setExamType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [userName, setUserName] = useState('');
  const [isEditingRequest, setIsEditingRequest] = useState(false);

  const togglePopup = useCallback(() => {
    setShowPopup(prev => !prev);
    setEditExam(null);
    setIsEditingRequest(false);
    resetForm();
  }, []);

  const resetForm = () => {
    setNationalId('');
    setExamType('');
    setStartDate('');
    setEndDate('');
  };

  // Fetch exam requests from backend
  useEffect(() => {
    const fetchExamRequests = async () => {
      try {
        const response = await axios.get('http://localhost:8626/admin/getAllPracticalExamRequests', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setExamRequestDates(response.data || []);
      } catch (error) {
        console.error('Failed to fetch exam requests:', error);
        toast.error('Failed to load exam requests');
      }
    };

    fetchExamRequests();
  }, []);

  useEffect(() => {
    const fetchExamDates = async () => {
      try {
        const response = await axios.get('http://localhost:8626/admin/getAllExamDates', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = response.data.map(exam => ({
          ...exam,
          startDate: new Date(exam.startDate).toLocaleString().slice(0, 16),
          endDate: new Date(exam.endDate).toLocaleString().slice(0, 16),
          status: exam.status === 'approved' ? 'Scheduled' : 'Completed',
          examType: exam.examType === 'theoretical' ? 'Theory Test' : 'Practical Driving Test',
          nationalId: exam.userNationalId,
          id: exam.id,
        }));
        setExamDates(data || []);
        // setExamDates(response.data || []);
      } catch (error) {
        console.error('Failed to fetch exam dates:', error);
        toast.error('Failed to load exam dates');
      }
    };

    fetchExamDates();
  }, []);

  // ESC key handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && showPopup) togglePopup();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showPopup, togglePopup]);

  // Handle scheduling a new exam
  const handleScheduleExam = async () => {
    console.log("handleScheduleExam");
    if (!nationalId || !examType || !startDate || !endDate) {
      await toast.error('Please fill in all fields');
      return;
    }
    console.log(nationalId, examType, startDate, endDate);
    console.log(editExam);
    console.log(isEditingRequest);
    if (editExam && !isEditingRequest) {
      console.log("here");
      const mappedExamType = editExam.examType === 'Theory Test' ? 'theoretical' : 'practical';

      // Editing existing exam in exam dates table
      await setExamDates(prev =>
        prev.map(exam =>
          exam.id === editExam.requestId
            ? {
              ...exam,
              nationalId,
              // mappedExamType,
              examType: mappedExamType,
              startDate,
              endDate,
            }
            : exam
        )
      );
      const response = await axios.post(`http://localhost:8626/admin/approvePracticalExamRequest/${editExam.requestId}`,
        {
          nationalId,
          examType,
          startDate,
          endDate,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      toast.success('Exam updated successfully');
      console.log(response.data);
      console.log(response.data.result.userNationalId);
      if (response.status !== 200) {
        await toast.error('Failed to schedule exam');
        return;
      }
    } else {
      console.log("here2");
      const response = await axios.post(`http://localhost:8626/admin/approvePracticalExamRequest/${editExam.id}`,
        {
          nationalId,
          examType,
          startDate,
          endDate,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      console.log(response.data);
      console.log(response.data.result.userNationalId);
      if (response.status !== 200) {
        await toast.error('Failed to schedule exam');
        return;
      }
      // Adding new exam (either from request or new schedule)
      // const mappedExamType = examType === 'Theory Test' ? 'theoretical' : 'practical';
      const mappedExamType = examType === 'theoretical' ? 'Theory Test' : 'Practical Driving Test';
      const newExam = {
        id: response.data ? response.data.result.id : String(Date.now()), // Use timestamp for unique ID
        nationalId: response.data ? response.data.result.userNationalId : nationalId,
        // examType,
        examType: mappedExamType,
        startDate,
        endDate,
        status: 'Scheduled',
      };

      setIsEditingRequest(false);
      setNationalId('');
      setExamType('');
      setStartDate('');
      setEndDate('');

      await setExamDates(prev => [...prev, newExam]);

      // If editing a request, remove it from requests
      if (isEditingRequest && editExam) {
        await setExamRequestDates(prev => prev.filter(req => req.id !== editExam.id));
      }

      toast.success('Exam scheduled successfully');
    }

    togglePopup();
  };

  // Handle scheduling a new exam request for non-users
  const handleScheduleExamRequest = async () => {
    console.log("handleScheduleExamRequest");
    if (!nationalId || !examType || !startDate || !endDate) {
      await toast.error('Please fill in all fields');
      return;
    }
    try {
      const response = await axios.post('http://localhost:8626/admin/scheduleExamDateForNonCreatedUsers', {
        userName,
        nationalId,
        examType,
        startDate,
        endDate,
      },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      if (response.status !== 200) {
        await toast.error('Failed to schedule exam request');
        return;
      }
      const mappedExamType = examType === 'Theory Test' ? 'theoretical' : 'practical';
      setExamDates(prev => [
        ...prev,
        // { id: String(Date.now()), nationalId, examType, startDate, endDate, status: 'Scheduled' },
        { id: String(Date.now()), nationalId, examType: mappedExamType, startDate, endDate, status: 'Scheduled' },
      ]);
      toast.success('Exam request scheduled successfully');
      togglePopup();
    } catch (error) {
      console.error('Failed to schedule exam request:', error);
      toast.error(error.response?.data?.error);
    }
  };

  const formatDateForInput = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().slice(0, 16); // Outputs "YYYY-MM-DDTHH:MM"
  };

  // Edit an exam request (move to exam dates)
  const handleEditExamRequest = (exam) => {
    console.log("handleEditExamRequest");
    setEditExam(exam);
    setIsEditingRequest(true);
    setNationalId(exam.userNationalId);
    const mappedExamType = exam.examType === 'Theory Test' ? 'theoretical' : 'practical';
    setExamType(mappedExamType);
    setStartDate(exam.startDate || '');
    setEndDate(exam.endDate || '');
    setShowPopup(true);
  };

  // Edit an existing exam date
  const handleEditExam = (exam) => {
    console.log("handleEditExam", exam);

    setEditExam(exam);
    setIsEditingRequest(false);
    setNationalId(exam.nationalId);

    const mappedExamType = exam.examType === 'Theory Test' ? 'theoretical' : 'practical';
    setExamType(mappedExamType);

    // Format dates before setting them
    setStartDate(formatDateForInput(exam.startDate));
    setEndDate(formatDateForInput(exam.endDate));

    setShowPopup(true);
  };
  // const handleEditExam = (exam) => {
  //   console.log("handleEditExam");
  //   console.log(exam);
  //   setEditExam(exam);
  //   setIsEditingRequest(false);
  //   setNationalId(exam.nationalId);
  //   const mappedExamType = exam.examType === 'Theory Test' ? 'theoretical' : 'practical';
  //   setExamType(mappedExamType);
  //   setStartDate(exam.startDate);
  //   setEndDate(exam.endDate);
  //   setShowPopup(true);
  // };

  // End an exam (mark as completed)
  const handleEndExam = (id) => {
    setExamDates(prev =>
      prev.map(exam =>
        exam.id === id ? { ...exam, status: 'Completed' } : exam
      )
    );
    toast.success('Exam marked as completed');
  };

  // Delete an exam
  const handleDeleteExam = async (id) => {
    console.log(`Bearer ${localStorage.getItem('token')}`);
    const response = await axios.post(`http://localhost:8626/admin/declinePracticalExamRequest/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
    console.log(response.data);
    if (response.status === 200) {
      if (editExam && editExam.id === id) {
        setEditExam(null);
        setIsEditingRequest(false);
        setNationalId('');
        setExamType('');
        setStartDate('');
        setEndDate('');
      }
      // Remove exam from both tables
      setExamRequestDates(prev => prev.filter(exam => exam.id !== id));
      setExamDates(prev => prev.filter(exam => exam.id !== id));
      toast.success('Exam deleted successfully');
    } else {
      toast.error('Failed to delete exam');
    }
  };

  // Format date/time
  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dateString).toLocaleString(undefined, options);
  };

  // Function to handle date button click
  // const handleDateButtonClick = (field) => {
  //   const now = new Date();
  //   const formattedDate = now.toISOString().slice(0, 16);
  //   // const formattedDate = now.toISOString().slice(0, 16).replace('T', ' ');
  //   // const formattedDate = now.toLocaleString('en-CA', { timeZone: 'UTC' });
  //   if (field === 'startDate') {
  //     setStartDate(formattedDate.toLocaleString());
  //   } else {
  //     setEndDate(formattedDate.toLocaleString());
  //   }
  // };
  const handleDateButtonClick = (field) => {
    const now = new Date();
    // Format as YYYY-MM-DDTHH:MM (local time)
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`;

    if (field === 'startDate') {
      setStartDate(formattedDate);
    } else {
      setEndDate(formattedDate);
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Exam Requests</h1>
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

      {/* Exam Requests Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Exam Type</th>
              <th className="px-8 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {examRequestDates.length > 0 ? (
              examRequestDates.map((exam) => (
                <tr key={exam.id}>
                  <td className="px-6 py-4">{exam.userNationalId}</td>
                  <td className="px-6 py-4">{exam.examType}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${exam.status === 'scheduled'
                        ? 'bg-blue-100 text-blue-800'
                        : exam.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : exam.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                    >
                      {exam.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => handleEditExamRequest(exam)}
                      className="text-indigo-600 hover:text-indigo-900"
                      disabled={exam.status === 'Completed'}
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteExam(exam.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No exam requests found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <h1 className="text-2xl font-bold text-gray-800">Exam Dates</h1>
      {/* Exam Dates Table */}
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
            {examDates.length > 0 ? (
              examDates.map((exam) => (
                <tr key={exam.nationalId}>
                  <td className="px-6 py-4">{exam.nationalId}</td>
                  <td className="px-6 py-4">{exam.examType}</td>
                  <td className="px-6 py-4">{formatDateTime(exam.startDate)}</td>
                  <td className="px-6 py-4">{formatDateTime(exam.endDate)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${exam.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
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
                      onClick={() => handleDeleteExam(exam.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No scheduled exams found
                </td>
              </tr>
            )}
          </tbody>
        </table>
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
            <h1 className="text-3xl font-bold text-gray-900 text-center">
              {isEditingRequest ? 'Schedule Exam Request' : editExam ? 'Edit Exam' : 'Schedule Exam'}
            </h1>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {!editExam &&
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">User Name</label>
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="User Name"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      readOnly={isEditingRequest}
                    // value={nationalId}
                    // onChange={(e) => setNationalId(e.target.value)}
                    // placeholder="30************"
                    // className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    // readOnly={isEditingRequest}
                    />
                  </div>
                }
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">National ID</label>
                  <input
                    type="text"
                    value={nationalId}
                    onChange={(e) => setNationalId(e.target.value)}
                    placeholder="30************"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    readOnly={isEditingRequest}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Exam Type</label>
                  <select
                    value={examType}
                    onChange={(e) => setExamType(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    disabled={isEditingRequest}
                  >
                    <option value="">Select Exam</option>
                    <option value="theoretical">Theory Test</option>
                    <option value="practical">Practical Driving Test</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Start Date</label>
                  <div className="flex gap-2">
                    <input
                      type="datetime-local"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleDateButtonClick('startDate')}
                      className="flex items-center justify-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                      title="Set to current time"
                    >
                      <Calendar className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">End Date</label>
                  <div className="flex gap-2">
                    <input
                      type="datetime-local"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleDateButtonClick('endDate')}
                      className="flex items-center justify-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                      title="Set to current time"
                    >
                      <Calendar className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
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
                  // onClick={handleScheduleExam}
                  onClick={editExam ? handleScheduleExam : handleScheduleExamRequest}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                >
                  {editExam ? 'Update Exam' : 'Set Exam'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}