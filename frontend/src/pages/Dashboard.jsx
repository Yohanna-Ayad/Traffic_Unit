import { Link } from 'react-router-dom'
import Layout from '../components/Layout'

// import {
//   UserIcon,
// CarIcon,
//   ExclamationTriangleIcon,
//   AcademicCapIcon,
//   DocumentCheckIcon,
// } from '@heroicons/react/24/outline'
import { BsPersonVcardFill } from "react-icons/bs";
import { FaCar } from "react-icons/fa";
import { PiTrafficConeBold } from "react-icons/pi";
import { MdQuiz } from "react-icons/md";
import { PiStickerBold } from "react-icons/pi";

const user = JSON.parse(localStorage.getItem('user'));
const drivingLicense = user ? user.hasDrivingLicense : false; // Fallback to `false` or handle appropriately
const carLicense = user ? user.hasCarLicense : false; // Fallback to `false` or handle appropriately

console.log('Driving License:', drivingLicense);
console.log('Car License:', carLicense);

const services = [
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
  },
  // {
  //   name: 'Digital Sticker',
  //   description: `Apply for your car's digital electronic sticker`,
  //   icon: PiStickerBold,
  //   href: '/digital-sticker',
  // },
];

// Add the Driving License service only if the user doesn't have a driving license
if (!drivingLicense) {
  services.unshift({
    name: 'Driving License',
    description: 'Apply for a new driving license or renew your existing one',
    icon: BsPersonVcardFill,
    href: '/driving-license',
  });

  // // Add the Online Exam service only if the user doesn't have a driving license
  // services.push({
  //   name: 'Online Exam',
  //   description: 'Take your driving license theoretical test online',
  //   icon: MdQuiz,
  //   href: '/online-exam',
  // });
}


console.log(services);


function Dashboard() {
  return (
    <>
      <Layout navigation={[
        { name: 'Dashboard', href: '/dashboard' },
        drivingLicense ? null : { name: 'Driving License', href: '/driving-license' },
        { name: 'Car License', href: '/car-license' },
        { name: 'Violations', href: '/violations' },
        // drivingLicense ? null : { name: 'Online Exam', href: '/online-exam' },
        // { name: 'Digital Sticker', href: '/digital-sticker' },
      ].filter(Boolean)} />
      <div className='m-5'>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Welcome to Traffic Services</h1>

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
  )
}

export default Dashboard