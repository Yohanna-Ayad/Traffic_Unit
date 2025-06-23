import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import { BsPersonVcardFill } from "react-icons/bs";
import { FaCar } from "react-icons/fa";
import { PiTrafficConeBold } from "react-icons/pi";
import axios from 'axios';
import { useEffect, useState } from 'react';

function Dashboard() {
  // All hooks must be inside the component
  const [user, setUser] = useState({});
  const [drivingLicense, setDrivingLicense] = useState(false);
  const [carLicense, setCarLicense] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log(token)
        const [
          // drivingResponse,
          // carResponse,
          userResponse
        ] = await Promise.all([
          // axios.get('http://localhost:8626/users/me/Drlicense', { headers: { Authorization: `Bearer ${token}` } }),
          // axios.get('http://localhost:8626/users/me/cars', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:8626/users/me', { headers: { Authorization: `Bearer ${token}` } })
        ]);

        // Store responses in state and localStorage
        // setDrivingLicense(drivingResponse.data);
        // localStorage.setItem('drivingLicense', JSON.stringify(drivingResponse.data));

        // setCarLicense(carResponse.data);
        // localStorage.setItem('carLicense', JSON.stringify(carResponse.data));

        setUser(userResponse.data);
        // localStorage.setItem('user', JSON.stringify(userResponse.data));

      } catch (error) {
        console.error(error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    if (!localStorage.getItem('token')) {
      window.location.href = './login';
    }
    else {
      // Check if data exists in localStorage first
      // const storedUser = localStorage.getItem('user');
      // const storedDriving = localStorage.getItem('drivingLicense');
      // const storedCar = localStorage.getItem('carLicense');

      // if (storedDriving && storedCar) {
      //   // setUser(JSON.parse(storedUser));
      //   setDrivingLicense(JSON.parse(storedDriving));
      //   setCarLicense(JSON.parse(storedCar));
      //   setLoading(false);
      // } else {
      fetchData();
      // }
    }
  }, []);
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const token = localStorage.getItem('token');
  //       const [
  //         drivingResponse,
  //         carResponse,
  //         userResponse
  //       ] = await Promise.all([
  //         axios.get('http://localhost:8626/users/me/Drlicense', { headers: { Authorization: `Bearer ${token}` } }),
  //         axios.get('http://localhost:8626/users/me/cars', { headers: { Authorization: `Bearer ${token}` } }),
  //         axios.get('http://localhost:8626/users/me', { headers: { Authorization: `Bearer ${token}` } })
  //       ]);

  //       await setDrivingLicense(drivingResponse.data);
  //       await setCarLicense(carResponse.data);
  //       await setUser(userResponse.data);
  //     } catch (error) {
  //       console.error(error);
  //       setError(error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   if(!localStorage.getItem('token')){
  //     window.location.href = './login';
  //   }
  //   else{
  //     fetchData();
  //   }
  // }, []);

  const services = [
    {
      name: 'Driving License',
      description: 'Apply for a new driving license or renew your existing one',
      icon: BsPersonVcardFill,
      href: '/driving-license-public',
    },
    {
      name: 'Car License',
      description: 'Register your vehicle or renew your car license',
      icon: FaCar,
      href: '/car-license',
    },
    {
      name: 'Traffic Violations',
      description: 'Check and pay your traffic violations',
      icon: PiTrafficConeBold,
      href: '/violations',
    }
  ]

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  // document.body.style.backgroundImage = "url('src/assets/dashboard4.png')";
  // document.body.style.backgroundSize = "cover";
  // document.body.style.backgroundRepeat = "no-repeat";
  // document.body.style.backgroundAttachment = "fixed";
  // document.body.style.backgroundPosition = "center";
  // document.body.style.backgroundImage = "0.9";

  return (
    <>
      <Layout navigation={[
        { name: 'Dashboard', href: '/dashboard' },
        { name: 'Driving License', href: '/driving-license-public' },
        { name: 'Car License', href: '/car-license' },
        { name: 'Violations', href: '/violations' },
        { name: 'License Request', href: '/license-request' },
      ]} />
      <div className='m-5'>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Welcome to Traffic Services{user?.name ? `, ${user.name}` : ''}
        </h1>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Link
              key={service.name}
              to={service.href}
              className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <service.icon className="h-8 w-8 text-primary-600" />
                </div>
                <div className="ml-4">
                  <h2 className="text-xl font-semibold text-gray-900">{service.name}</h2>
                  <p className="mt-1 text-gray-600">{service.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

export default Dashboard;