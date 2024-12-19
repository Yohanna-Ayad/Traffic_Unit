import { useState } from 'react'
import { toast } from 'react-hot-toast'
import Layout from '../components/Layout'

const drivingLicense = JSON.parse(localStorage.getItem('user')).hasDrivingLicense

function DrivingLicense() {
  const [formData, setFormData] = useState({
    fullName: '',
    nationalId: '',
    dateOfBirth: '',
    phoneNumber: '',
    email: '',
    licenseType: 'private',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would typically send the data to your backend
    toast.success('Application submitted successfully!')
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <>
      <Layout navigation={[
        { name: 'Dashboard', href: '/dashboard' },
        drivingLicense ? null : { name: 'Driving License', href: '/driving-license' },
        { name: 'Car License', href: '/car-license' },
        { name: 'Violations', href: '/violations' },
        drivingLicense ? null : { name: 'Online Exam', href: '/online-exam' },
        { name: 'Digital Sticker', href: '/digital-sticker' },
      ]} />
      <div className="max-w-2xl mx-auto py-5 px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Driving License Application</h1>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              id="fullName"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="nationalId" className="block text-sm font-medium text-gray-700">
              National ID
            </label>
            <input
              type="text"
              name="nationalId"
              id="nationalId"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              value={formData.nationalId}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
              Date of Birth
            </label>
            <input
              type="date"
              name="dateOfBirth"
              id="dateOfBirth"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              value={formData.dateOfBirth}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="tel"
              name="phoneNumber"
              id="phoneNumber"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              value={formData.phoneNumber}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="licenseType" className="block text-sm font-medium text-gray-700">
              License Type
            </label>
            <select
              name="licenseType"
              id="licenseType"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              value={formData.licenseType}
              onChange={handleChange}
            >
              <option value="private">Private Vehicle</option>
              <option value="commercial">Commercial Vehicle</option>
              <option value="motorcycle">Motorcycle</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Submit Application
          </button>
        </form>
      </div>
    </>
  )
}

export default DrivingLicense