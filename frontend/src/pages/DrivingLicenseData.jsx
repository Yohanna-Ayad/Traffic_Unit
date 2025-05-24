import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import LicenseImage from '../assets/LicenseTypeImage.png';
// import Layout from '../components/Layout';

// const drivingLicense = JSON.parse(localStorage.getItem('user')).hasDrivingLicense;

function DrivingLicenseData() {
  const [government, setGovernment] = useState('');
  const [licenseType, setLicenseType] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  // const [licenseStartDate, setLicenseStartDate] = useState('');
  // const [licenseEndDate, setLicenseEndDate] = useState('');
  const [trafficUnit, setTrafficUnit] = useState('');

  useEffect(() => {
    // Get user data safely
    let user;
    try {
      user = JSON.parse(localStorage.getItem('user'));
    } catch (error) {
      console.error('Error parsing user data:', error);
      user = null;
    }
  
    // Get token directly without JSON manipulation
    const token = localStorage.getItem('token');
  
    console.log('Stored user:', user);
    console.log('Stored token:', token);
  
    if (!user && !token) {
      window.location.href = '/login';
      console.log('Redirecting because:', {
        missingUser: !user,
        missingToken: !token
      });
    }
  }, []);

  const sendData = async () => {
    try {
      const response = await axios.post('http://localhost:8626/users/licenseExists', {
        licenseNumber,
        // licenseStartDate,
        // licenseEndDate,
        government,
        trafficUnit,
        licenseType
      });
      console.log('Response:', response.data);
      if (response.status === 200) {
        localStorage.setItem("drivingLicense", JSON.stringify({
          "licenseNumber": licenseNumber,
          "licenseType": licenseType,
          // "startDate": licenseStartDate,
          // "endDate": licenseEndDate,
          "government": government,
          "trafficUnit": trafficUnit
        }));
        console.log(localStorage.getItem("drivingLicense"))
      }
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user?.hasCarLicense === true) {
        window.location.href = '/car-license-data';
      }
      else if (user?.hasCarLicense === false) {
        console.log(JSON.parse(localStorage.getItem('user')))
        console.log(JSON.parse(localStorage.getItem('drivingLicense')))
        axios.post('http://localhost:8626/users', {
          user: JSON.parse(localStorage.getItem('user')),
          drivingLicense: JSON.parse(localStorage.getItem('drivingLicense'))
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
          .then((response) => {
            localStorage.removeItem("CarLicense");
            localStorage.removeItem("drivingLicense");
            localStorage.removeItem("user");
            localStorage.setItem("token", response.data.user.token)
            toast.success('Car license information saved successfully.',
              {
                duration: 3000,
                position: 'top-right',
              }
            );

            window.location.href = '/dashboard';
          })
          .catch((error) => {
            console.error(error);
            toast.error(error.message || 'Failed to save car license information. Please try again later.',
              {
                duration: 4000,
                position: 'top-center',
                // style: {
                //     borderRadius: '10px',
                //     background: '#333',
                //     color: '#fff',
                // },
              });
          });
      }
      else {
        try {
          const response = await axios.post(
            'http://localhost:8626/users/me/license',
            {
              licenseNumber,
              licenseType,
              // startDate: licenseStartDate,
              // endDate: licenseEndDate,
              government,
              trafficUnit
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
                // 'Content-Type' header is automatically set by Axios for objects
              }
            }
          );

          toast.success('Driving License information saved successfully.', {
            duration: 3000,
            position: 'top-right'
          });

          // Better alternative to reload: update state/redirect
          window.location.reload(); // Consider using navigation or state reset instead

        } catch (error) {
          console.error('Error:', error.response?.data || error.message);

          const errorMessage = error.response?.data?.message
            || 'Failed to save driving license information. Please try again later.';
          toast.error(errorMessage);
        }
      }
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to save driving license information. Please try again later.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    // if (!licenseType || !licenseNumber || !licenseStartDate || !licenseEndDate || !trafficUnit) {
    if (!licenseType || !licenseNumber || !trafficUnit) {
      toast.error('Please fill in all required fields');
      return;
    }
    else {
      sendData();
    }
  }

  return (
    <>
      <div className="max-w-2xl mx-auto py-5 px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Driving License Application</h1>
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow min-w-96">
            {/* <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                id="startDate"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                value={licenseStartDate}
                onChange={(e) => setLicenseStartDate(e.target.value)}
              />
            </div> */}

            {/* <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                id="endDate"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                value={licenseEndDate}
                onChange={(e) => setLicenseEndDate(e.target.value)}
              />
            </div> */}

            <div>
              <label htmlFor="government" className="block text-sm font-medium text-gray-700">
                Government
              </label>
              <select
                name="government"
                id="government"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                value={government}
                onChange={(e) => setGovernment(e.target.value)}
              >
                <option value="">Select a Government</option>
                <option value="Alexandria">Alexandria</option>
                <option value="Aswan">Aswan</option>
                <option value="Assiut">Assiut</option>
                <option value="Beheira">Beheira</option>
                <option value="Beni Suef">Beni Suef</option>
                <option value="Cairo">Cairo</option>
                <option value="Dakahlia">Dakahlia</option>
                <option value="Damietta">Damietta</option>
                <option value="Fayoum">Fayoum</option>
                <option value="Gharbia">Gharbia</option>
                <option value="Giza">Giza</option>
                <option value="Ismailia">Ismailia</option>
                <option value="Kafr el-Sheikh">Kafr el-Sheikh</option>
                <option value="Matrouh">Matrouh</option>
                <option value="Minya">Minya</option>
                <option value="Menofia">Menofia</option>
                <option value="New Valley">New Valley</option>
                <option value="North Sinai">North Sinai</option>
                <option value="Port Said">Port Said</option>
                <option value="Qualyubia">Qualyubia</option>
                <option value="Qena">Qena</option>
                <option value="Red Sea">Red Sea</option>
                <option value="Al-Sharqia">Al-Sharqia</option>
                <option value="Soha">Soha</option>
                <option value="South Sinai">South Sinai</option>
                <option value="Suez">Suez</option>
                <option value="Luxor">Luxor</option>
              </select>
            </div>

            <div>
              <label htmlFor="drivingLicenseUnit" className="block text-sm font-medium text-gray-700">
                Driving License Unit
              </label>
              <input
                type="text"
                name="drivingLicenseUnit"
                id="drivingLicenseUnit"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                value={trafficUnit}
                onChange={(e) => setTrafficUnit(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="drivingLicenseNumber" className="block text-sm font-medium text-gray-700">
                Driving License Number
              </label>
              <input
                type="number"
                name="drivingLicenseNumber"
                id="drivingLicenseNumber"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="drivingLicenseType" className="block text-sm font-medium text-gray-700">
                Driving License Type
              </label>
              <select
                name="drivingLicenseType"
                id="drivingLicenseType"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                value={licenseType}
                onChange={(e) => setLicenseType(e.target.value)}
              >
                <option value="A">A - Motorcycle</option>
                <option value="A1">A1 - Light Motorcycle</option>
                <option value="B">B - Private Vehicle</option>
                <option value="BE">BE - Bus</option>
                <option value="C1">C1 - Taxi</option>
                <option value="C1E">C1E - Light lorry and tow a trailer</option>
                <option value="C">C - Commercial Vehicle</option>
                <option value="D1">D1 - Car</option>
                <option value="D1E">D1E - Light lorry</option>
                <option value="D">D - Heavy Equipment</option>
                <option value="DE">DE - Vehicle</option>
              </select>
            </div>


            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Submit Application
            </button>
          </form>
          <img
            src={LicenseImage}
            alt="Driving License Type"
            className="w-48 md:w-64 shrink-0 mx-auto md:mx-0"
          />
        </div>
      </div>
    </>
  );
}

export default DrivingLicenseData;
