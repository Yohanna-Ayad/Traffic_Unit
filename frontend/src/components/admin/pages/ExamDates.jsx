import { useState } from 'react';
import { Calendar, Plus, Search } from 'lucide-react';

export function ExamDates() {
  const [examDates] = useState([
    {
      id: '1',
      userId: 'U123',
      userName: 'John Smith',
      examType: 'Practical Driving Test',
      scheduledDate: '2024-03-20 10:00 AM',
      location: 'Main Test Center',
      status: 'Scheduled',
    },
  ]);

  return (
    <div className="space-y-6">
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
          <button className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
            <Plus className="w-5 h-5" />
            <span>Schedule Exam</span>
          </button>
        </div>
      </div>

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
}