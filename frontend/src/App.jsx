import { Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Dashboard from './pages/Dashboard'
// import DrivingLicense from './pages/DrivingLicense'
import CarLicense from './pages/CarLicense'
import Violations from './pages/TrafficViolations'
// import OnlineExam from './pages/OnlineExam'
// import DigitalSticker from './pages/DigitalSticker'
// import DrivingLicenseFlow from './pages/DrivingLicenseFlow'
import DrivingLicensePublic from './pages/DrivingLicensePublic'
import DrivingLicenseInstructions from './pages/license/instructions'
import DrivingLicenseExam from './pages/license/exam'
import DrivingLicenseCourse from './pages/license/course'
import LicenseRequestPage from './pages/LicenseRequestPage'
import UserProfile from './pages/UserProfile'


import Signup from './pages/Signup'
import Login from './pages/LoginAccount'
import LicenseQuestionnaire from './components/LicenseQuestionnaire/index'
import DrivingLicenseData from './pages/DrivingLicenseData'
import CarLicenseData from './pages/CarLicenseData'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import NotFound from './pages/NotFound'
import TrafficUnitChatbot from './pages/TrafficUnitChatbot';
import TrafficUnitSystemPage from './pages/TrafficUnitSystemPage';
import TrafficUnitSystemDriving from './pages/TrafficUnitSystemDriving';
import TrafficUnitSystemCar from './pages/TrafficUnitSystemVehicle';


import { AdminLayout } from './components/admin/layout/AdminLayout';
import { ManageAdmins } from './components/admin/pages/ManageAdmins';
import { DrivingLicenses } from './components/admin/pages/DrivingLicenses';
import { CarLicenses } from './components/admin/pages/CarLicenses';
import { CourseRequests } from './components/admin/pages/CourseRequests';
import { QuizRequests } from './components/admin/pages/QuizRequests';
import { ExamDates } from './components/admin/pages/ExamDates';
import TrafficViolation from './components/admin/pages/TrafficViolation';
import LicenseRequestAdminPage from './components/admin/pages/LicenseRequestAdminPage';
import AdminNotFound from './components/admin/pages/AdminNotFound';
import { LicenseRequests } from './components/admin/pages/NewCarLicenseRequests';


function App() {
  const [userIsLoggedIn, setUserIsLoggedIn] = useState(false);

  // Check for token in localStorage when component mounts
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setUserIsLoggedIn(true);
    }
  }, []);

  // Optional: Listen for storage changes (if you have login/logout in other tabs)
  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem('token');
      setUserIsLoggedIn(!!token);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <div className="App">
      <Routes>
        {/* <Route path="/"> */}
        <Route path='dashboard' element={<Dashboard />} />
        <Route path="car-license" element={<CarLicense />} />
        <Route path="violations" element={<Violations />} />
        <Route path="profile" element={<UserProfile />} />
        <Route path="license-request" element={<LicenseRequestPage />} />


        <Route path="driving-license-instructions" element={<DrivingLicenseInstructions />} />
        <Route path="driving-license-exam" element={<DrivingLicenseExam />} />
        <Route path="driving-license-course" element={<DrivingLicenseCourse />} />
        <Route path="driving-license-public" element={<DrivingLicensePublic />} />

        <Route path="driving-license" element={<TrafficUnitSystemDriving />} />
        <Route path="vehicle-license" element={<TrafficUnitSystemCar />} />
        <Route path="home" element={<TrafficUnitSystemPage />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password" element={<ResetPassword />} />
        <Route path="driving-license-data" element={<DrivingLicenseData />} />
        <Route path="car-license-data" element={<CarLicenseData />} />
        <Route path='licenseQuestionnaire' element={<LicenseQuestionnaire />} />
        <Route path='signup' element={<Signup />} />
        <Route path='login' element={<Login />} />
        <Route path='home' element={<TrafficUnitSystemPage />} />
        <Route path="*" element={<NotFound />} />
        {/* </Route> */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="manage-admins" element={<ManageAdmins />} />
          <Route path="driving-licenses" element={<DrivingLicenses />} />
          <Route path="car-licenses" element={<CarLicenses />} />
          <Route path="course-requests" element={<CourseRequests />} />
          <Route path="quiz-requests" element={<QuizRequests />} />
          <Route path="exam-dates" element={<ExamDates />} />
          <Route path="traffic-violations" element={<TrafficViolation />} />
          <Route path="appointments" element={<LicenseRequestAdminPage />} />
          <Route path="car-requests" element={<LicenseRequests />} />
          <Route path="*" element={<AdminNotFound />} />
        </Route>



      </Routes>
      <TrafficUnitChatbot />
    </div>
  )
}

export default App