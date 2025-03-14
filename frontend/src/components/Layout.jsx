import { Fragment, useEffect, useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Bell } from 'lucide-react';

function Layout({ navigation }) {
  const location = useLocation();

  useEffect(() => {
    if (!localStorage.getItem('user')) {
      window.location.href = '/login';
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

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
                          className={`${location.pathname === item.href
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
                {/* Profile Menu */}
                <div className="hidden md:flex items-center space-x-4">
                  <button className="p-1 text-black-100 bg-gray-100 rounded-full border-4 border-gray-100 hover:border-primary-400">
                    <Bell className="w-4 h-4" />
                  </button>
                  <Menu as="div" className="relative inline-block text-left">
                    <div>
                      <Menu.Button className="flex items-center rounded-full bg-primary-600 p-1 text-white focus:outline-none hover:bg-primary-500">
                        <span className="sr-only">Open user menu</span>
                        <img
                          className="h-8 w-8 rounded-full"
                          src="https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_1280.png" // Replace with actual user profile image URL
                          alt="Profile"
                        />
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/profile"
                              className={`${active ? 'bg-gray-100' : ''
                                } block px-4 py-2 text-sm text-gray-700`}
                            >
                              Profile
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={handleLogout}
                              className={`${active ? 'bg-gray-100' : ''
                                } block w-full px-4 py-2 text-left text-sm text-gray-700`}
                            >
                              Logout
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>

                {/* Mobile Menu Button */}
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
                    className={`${location.pathname === item.href
                      ? 'bg-primary-700 text-white'
                      : 'text-white hover:bg-primary-500'
                      } block rounded-md px-3 py-2 text-base font-medium`}
                  >
                    {item.name}
                  </Link>
                ))}
                <Link
                  to="/profile"
                  className="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-primary-500"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full rounded-md px-3 py-2 text-base font-medium text-white hover:bg-primary-500"
                >
                  Logout
                </button>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
