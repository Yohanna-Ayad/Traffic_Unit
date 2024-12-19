import { Fragment, useEffect, useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { Disclosure } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

// const navigation = [
//   { name: 'Dashboard', href: '/dashboard' },
//   { name: 'Driving License', href: '/driving-license' },
//   // { name: 'Car License', href: '/car-license' },
//   { name: 'Violations', href: '/violations' },
//   { name: 'Online Exam', href: '/online-exam' },
//   { name: 'Digital Sticker', href: '/digital-sticker' },
// ]

function Layout( { navigation }) {
  console.log('Navigation:', navigation);
  navigation.forEach((item) => {
    if (item === null) {
      navigation.splice(navigation.indexOf(item), 1);
    }
  });
  console.log('Navigation:', navigation);
  const location = useLocation()

  useEffect(() => {
    if(!localStorage.getItem('user')) {
      window.location.href = '/login'
    }
  }
  , []);

  return (
    <div className="bg-gray-100">
      <Disclosure as="nav" className="bg-primary-600">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="text-white text-xl font-bold">Traffic Services</span>
                  </div>
                  <div className="hidden md:block">
                    <div className="ml-10 flex items-baseline space-x-4">
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={`${
                            location.pathname === item.href
                              ? 'bg-primary-700 text-white'
                              : 'text-white hover:bg-primary-500'
                          } rounded-md px-3 py-2 text-sm font-medium`}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
                {/* <div className=''>
                  <Link to="/login" className="text-white hover:bg-primary-500 px-3 py-2 rounded-md text-sm font-medium">
                    Log in
                  </Link>
                  <Link to="/register" className="text-white hover:bg-primary-500 px-3 py-2 rounded-md text-sm font-medium">
                    Register
                  </Link>
                </div> */}
                <div className="-mr-2 flex md:hidden">
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-primary-600 p-2 text-white hover:bg-primary-500 focus:outline-none">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="md:hidden">
              <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`${
                      location.pathname === item.href
                        ? 'bg-primary-700 text-white'
                        : 'text-white hover:bg-primary-500'
                    } block rounded-md px-3 py-2 text-base font-medium`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout