import { Fragment, useEffect, useState, useRef } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Bell } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

function Layout({ navigation }) {
  const bellButtonRef = useRef(null);
  const notificationDropdownRef = useRef(null);
  const location = useLocation();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);


  document.body.style.backgroundImage = "url('src/assets/dashboard4.png')";
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundRepeat = "no-repeat";
  document.body.style.backgroundAttachment = "fixed";
  document.body.style.backgroundPosition = "center";

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      window.location.href = '/login';
    }
  }, []);
  useEffect(() => {
    const fetchUserNotifications = async () => {
      try {
        const res = await axios.get('http://localhost:8626/users/me/notifications', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (res.status === 200) {
          setNotifications(res.data);
          console.log('Notifications fetched successfully:', res.data);
          //   toast.success('Notifications fetched successfully');
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
        // toast.error('Failed to fetch notifications');
      }
    };
    fetchUserNotifications();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showNotifications &&
        bellButtonRef.current &&
        notificationDropdownRef.current &&
        !bellButtonRef.current.contains(event.target) &&
        !notificationDropdownRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    document.body.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.body.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  const handleNotificationClick = (notificationId) => {
    // Handle notification click (e.g., mark as read, redirect to specific page)
    console.log(`Notification ${notificationId} clicked`);
    setShowNotifications(!showNotifications);
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId ? { ...notification, read: true } : notification
      )
    );
  };
  const handleNotificationClose = async (notificationId) => {
    const response = await axios.delete(`http://localhost:8626/users/me/notifications/${notificationId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (response.data.notification) {
      toast.success('Notification deleted successfully');
      await setNotifications((prev) => prev.filter((notification) => notification.id !== notificationId));
    }
    else {
      toast.error('Failed to delete notification');
    }
  };
  const handleNotificationToggle = () => {
    setShowNotifications(!showNotifications);
  };
  const handleNotificationClear = async () => {
    const previousNotifications = [...notifications];
    setNotifications([]);
    toast.loading('Clearing notifications...');

    try {
      await axios.delete('http://localhost:8626/users/me/notifications', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      toast.dismiss();
      toast.success('All notifications cleared');
    } catch (error) {
      setNotifications(previousNotifications);
      toast.error('Failed to clear notifications');
    }
  };
  const handleNotificationMarkAllAsRead = async () => {
    const previousState = [...notifications];

    // Optimistic update
    setNotifications(prev => prev.map(notification => ({ ...notification, status: 'read' })));

    try {
      await axios.patch(
        'http://localhost:8626/users/me/notifications',
        {}, // empty body
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      toast.success('All notifications marked as read');
    } catch (error) {
      // Revert on error
      setNotifications(previousState);
      toast.error('Failed to mark notifications as read');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
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
                  <div className="relative">
                    <button
                      ref={bellButtonRef}
                      className="p-1 text-black-100 bg-gray-100 rounded-full border-4 border-gray-100 hover:border-primary-400 relative focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      onClick={() => handleNotificationToggle()}
                      aria-label={`Notifications: ${notifications.filter(n => n.status === 'unread').length} unread`}
                    >
                      <Bell className="w-4 h-4" />
                      {/* Notification Badge */}
                      {notifications.some(notification => notification.status === 'unread') && (
                        <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full shadow-md transform translate-x-1/4 -translate-y-1/4">
                          {notifications.filter(n => n.status === 'unread').length}
                        </span>
                      )}
                    </button>
                    {/* <button
                      className="p-1 text-black-100 bg-gray-100 rounded-full border-4 border-gray-100 hover:border-primary-400 relative focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      onClick={() => handleNotificationClick('notificationId')}
                      aria-label={`Notifications: ${notifications.filter(n => n.status === 'unread').length} unread`}
                    >
                      <Bell className="w-4 h-4" />

                      {notifications.some(notification => notification.status === 'unread') && (
                        <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full shadow-md transform translate-x-1/4 -translate-y-1/4">
                          {notifications.filter(n => n.status === 'unread').length}
                        </span>
                      )}
                    </button> */}
                  </div>
                  {/* <div className="relative">
                    <button
                      className="p-1 text-black-100 bg-gray-100 rounded-full border-4 border-gray-100 hover:border-primary-400 relative focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      onClick={() => handleNotificationClick('notificationId')}
                      aria-label={`Notifications: ${notifications.length} unread`}
                    >
                      <Bell className="w-4 h-4" />

                      {notifications.length > 0 && (
                        <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full shadow-md transform translate-x-1/4 -translate-y-1/4">
                          {notifications.length}
                        </span>
                      )}
                    </button>
                  </div> */}
                  {/* <button className="p-1 text-black-100 bg-gray-100 rounded-full border-4 border-gray-100 hover:border-primary-400"
                    onClick={() => handleNotificationClick('notificationId')}
                  >
                    <Bell className="w-4 h-4" />
                  </button> */}
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
                    {showNotifications && (
                      <Transition
                        as={Fragment}
                        appear
                        show={showNotifications}
                        enter="transition-all ease-out duration-200"
                        enterFrom="opacity-0 translate-y-[-4px] scale-95"
                        enterTo="opacity-100 translate-y-0 scale-100"
                        leave="transition-all ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0 scale-100"
                        leaveTo="opacity-0 translate-y-[-4px] scale-95"
                      >
                        <div
                          ref={notificationDropdownRef}
                          className="absolute right-0 z-50 mt-2 w-80 origin-top-right rounded-lg bg-white shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none"
                          role="menu"
                          aria-orientation="vertical"
                          aria-labelledby="notification-button"
                        >
                          {/* {showNotifications && (
                      <Transition
                        as={Fragment}
                        appear
                        show={showNotifications}
                        enter="transition-all ease-out duration-200"
                        enterFrom="opacity-0 translate-y-[-4px] scale-95"
                        enterTo="opacity-100 translate-y-0 scale-100"
                        leave="transition-all ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0 scale-100"
                        leaveTo="opacity-0 translate-y-[-4px] scale-95"
                      >
                        <div
                          className="absolute right-0 z-50 mt-2 w-80 origin-top-right rounded-lg bg-white shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none"
                          role="menu"
                          aria-orientation="vertical"
                          aria-labelledby="notification-button"
                        > */}
                          <div className="max-h-96 overflow-y-auto py-2">
                            {notifications.length > 0 ? (
                              notifications.map((notification) => (
                                <div
                                  key={notification.id}
                                  className={`group relative flex items-start px-4 py-3 m-2 rounded-lg transition-colors duration-150 ${notification.status === 'read'
                                    ? 'bg-gray-50 hover:bg-gray-100'
                                    : 'bg-blue-50 hover:bg-blue-100'
                                    }`}
                                >
                                  <div className="flex-1 min-w-0">
                                    <p className={`text-sm font-medium ${notification.status === 'read' ? 'text-gray-700' : 'text-blue-800'}`}>
                                      {notification.description}
                                    </p>
                                  </div>

                                  <button
                                    onClick={() => handleNotificationClose(notification.id)}
                                    className="ml-2 p-1 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-200"
                                    aria-label="Dismiss notification"
                                  >
                                    <span className="sr-only">Dismiss notification</span>
                                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                      <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
                                    </svg>
                                  </button>

                                  {notification.status !== 'read' && (
                                    <span className="absolute -top-1 -right-1 h-2 w-2 bg-blue-500 rounded-full" />
                                  )}
                                </div>
                              ))
                            ) : (
                              <div className="px-4 py-6 text-center text-sm text-gray-500">
                                <p>No new notifications</p>
                              </div>
                            )}
                          </div>

                          <div className="border-t border-gray-200 py-2">
                            <div className="flex justify-between px-3">
                              <button
                                onClick={handleNotificationClear}
                                className="text-sm text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-1.5 rounded-md transition-colors duration-150"
                              >
                                Clear All
                              </button>

                              <button
                                onClick={handleNotificationMarkAllAsRead}
                                className="text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-1.5 rounded-md transition-colors duration-150"
                              >
                                Mark All Read
                              </button>
                            </div>
                          </div>
                        </div>
                      </Transition>
                    )}
                    {/* {showNotifications && (
                      <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1">
                          {notifications.length > 0 ? (
                            notifications.map((notification) => (
                              <div
                                key={notification.id}
                                className={`block px-4 py-2 text-sm text-gray-700 ${notification.read ? 'bg-gray-100' : ''
                                  }`}
                              >
                                <span>{notification.description}</span>
                                <button
                                  onClick={() => handleNotificationClose(notification.id)}
                                  className="ml-2 text-red-500"
                                >
                                  &times;
                                </button>
                              </div>
                            ))
                          ) : (
                            <div className="px-4 py-2 text-sm text-gray-700">No notifications</div>
                          )}
                        </div>
                        <div className="py-1">
                          <button
                            onClick={handleNotificationClear}
                            className="block px-4 py-2 text-sm text-gray-700"
                          >
                            Clear All
                          </button>
                          <button
                            onClick={handleNotificationMarkAllAsRead}
                            className="block px-4 py-2 text-sm text-gray-700"
                          >
                            Mark All as Read
                          </button>
                        </div>
                      </div>
                    )} */}
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
