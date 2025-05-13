import { Users, FileText, Calendar, ClipboardList, UserPlus, CarFront, TrafficCone, MapPin } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const menuItems = [
  { icon: UserPlus, label: 'Manage Admins', path: '/admin/manage-admins' },
  { icon: FileText, label: 'Driving Licenses', path: '/admin/driving-licenses' },
  { icon: CarFront, label: 'Car Licenses', path: '/admin/car-licenses' },
  { icon: Users, label: 'Course Requests', path: '/admin/course-requests' },
  { icon: ClipboardList, label: 'Quiz Requests', path: '/admin/quiz-requests' },
  { icon: Calendar, label: 'Exam Dates', path: '/admin/exam-dates' },
  { icon: TrafficCone, label: 'Traffic Violations', path: '/admin/traffic-violations' },
  { icon: MapPin, label: 'Appointments', path: '/admin/appointments' }, 
];

export function Sidebar() {
  const location = useLocation();

  return (
    <div className="w-64 bg-white h-screen border-r border-gray-200">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800">Admin Panel</h2>
      </div>
      <nav className="px-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}