import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
// import DrivingLicense from './pages/DrivingLicense'
import CarLicense from './pages/CarLicense'
import Violations from './pages/TrafficViolations'
// import OnlineExam from './pages/OnlineExam'
// import DigitalSticker from './pages/DigitalSticker'
import DrivingLicenseFlow from './pages/DrivingLicenseFlow'
import DrivingLicensePublic from './pages/DrivingLicensePublic'

import Signup from './pages/Signup'
import Login from './pages/LoginAccount'
import LicenseQuestionnaire from './components/LicenseQuestionnaire/index'
import DrivingLicenseData from './pages/DrivingLicenseData'
import CarLicenseData from './pages/CarLicenseData'
import UserProfile from './pages/UserProfile'

import { AdminLayout } from './components/admin/layout/AdminLayout';
import { ManageAdmins } from './components/admin/pages/ManageAdmins';
import { DrivingLicenses } from './components/admin/pages/DrivingLicenses';
import { CarLicenses } from './components/admin/pages/CarLicenses';
import { CourseRequests } from './components/admin/pages/CourseRequests';
import { QuizRequests } from './components/admin/pages/QuizRequests';
import { ExamDates } from './components/admin/pages/ExamDates';

function App() {
  return (
    <Routes>
      <Route path="/">
        <Route path='dashboard' element={<Dashboard />} />
        {/* <Route path="driving-license" element={<DrivingLicense />} /> */}
        <Route path="car-license" element={<CarLicense />} />
        <Route path="violations" element={<Violations />} />
        {/* <Route path="online-exam" element={<OnlineExam />} /> */}
        {/* <Route path="digital-sticker" element={<DigitalSticker />} /> */}
        <Route path="profile" element={<UserProfile />} />
        <Route path="driving-license" element={<DrivingLicenseFlow />} />
        <Route path="driving-license-public" element={<DrivingLicensePublic />} />  

      </Route>
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="admins" element={<ManageAdmins />} />
        <Route path="driving-licenses" element={<DrivingLicenses />} />
        <Route path="car-licenses" element={<CarLicenses />} />
        <Route path="course-requests" element={<CourseRequests />} />
        <Route path="quiz-requests" element={<QuizRequests />} />
        <Route path="exam-dates" element={<ExamDates />} />
      </Route>
      <Route path="driving-license-data" element={<DrivingLicenseData />} />
      <Route path="car-license-data" element={<CarLicenseData />} />
      <Route path='/licenseQuestionnaire' element={<LicenseQuestionnaire />} />
      <Route path='signup' element={<Signup />} />
      <Route path='login' element={<Login />} />

    </Routes>
  )
}

export default App