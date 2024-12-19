import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import DrivingLicense from './pages/DrivingLicense'
// import CarLicense from './pages/CarLicense'
import Violations from './pages/TrafficViolations'
import OnlineExam from './pages/OnlineExam'
import DigitalSticker from './pages/DigitalSticker'
import Signup from './pages/Signup'
import Login from './pages/LoginAccount'
import LicenseQuestionnaire from './components/LicenseQuestionnaire/index'

function App() {
  return (
    <Routes>
      <Route path="/">
        <Route path='dashboard' element={<Dashboard />} />
        <Route path="driving-license" element={<DrivingLicense />} />
        {/* <Route path="car-license" element={<CarLicense />} /> */}
        <Route path="violations" element={<Violations />} />
        <Route path="online-exam" element={<OnlineExam />} />
        <Route path="digital-sticker" element={<DigitalSticker />} />
      </Route>
      <Route path='/licenseQuestionnaire' element={<LicenseQuestionnaire />} />
      <Route path='signup' element={<Signup />} />
      <Route path='login' element={<Login />} />

    </Routes>
  )
}

export default App