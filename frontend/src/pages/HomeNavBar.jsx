import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
    const [showServicesDropdown, setShowServicesDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const buttonRef = useRef(null);
    const [showMainPage, setShowMainPage] = useState(false);

    useEffect(() => {
        // Check if the current page is the main page
        setShowMainPage(window.location.pathname === '/home');
        console.log(`Current path: ${window.location.pathname}, Show Main Page: ${showMainPage}`);
    }, []);


    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
                buttonRef.current && !buttonRef.current.contains(event.target)) {
                setShowServicesDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <nav className="bg-white w-full shadow-sm">
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center gap-5">
                        <div className="flex-shrink-0">
                            <img
                                src="https://framerusercontent.com/images/kXJwAOxiBvPUdSfpiLzEVpKA.png"
                                alt="Egypt Coat of Arms"
                                className="h-10"
                            />
                        </div>

                        {/* Navigation Links with Dropdown */}
                        <div className="hidden md:flex space-x-8 relative">
                            {!showMainPage && <Link to="/home" className="text-gray-800 hover:text-blue-600 text-lg font-medium flex items-center">
                                Home
                            </Link>}
                            <div className="relative">
                                <button
                                    ref={buttonRef}
                                    className="text-gray-800 hover:text-blue-600 text-lg font-medium flex items-center"
                                    onClick={() => setShowServicesDropdown(!showServicesDropdown)}
                                >
                                    Services
                                    <svg
                                        className={`ml-1 w-4 h-4 transition-transform ${showServicesDropdown ? 'transform rotate-180' : ''}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {showServicesDropdown && (
                                    <div
                                        ref={dropdownRef}
                                        className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-100"
                                        onMouseLeave={() => setShowServicesDropdown(false)}
                                    >
                                        <Link
                                            to="/driving-license"
                                            className="block px-4 py-2 text-gray-800 hover:bg-blue-50 hover:text-blue-600"
                                            onClick={() => setShowServicesDropdown(false)}
                                        >
                                            Driving Services
                                        </Link>
                                        <Link
                                            to="/vehicle-license"
                                            className="block px-4 py-2 text-gray-800 hover:bg-blue-50 hover:text-blue-600"
                                            onClick={() => setShowServicesDropdown(false)}
                                        >
                                            Vehicle Services
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Auth Buttons */}
                    <div className="flex items-center space-x-4">
                        <Link to="/signup" className="text-gray-800 hover:text-blue-600 text-lg font-medium">
                            Sign up
                        </Link>
                        <Link to="/login" className="text-gray-800 hover:text-blue-600 text-lg font-medium">
                            Login
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;