import { useEffect, useState } from 'react';

const AdminNotFound = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);

        // Set admin-friendly background
        document.body.style.backgroundColor = "#f9fafb"; // Tailwind's gray-50

        // Cleanup styles on unmount
        return () => {
            document.body.style.backgroundColor = "";
        };
    }, []);

    return (
        <div className="space-y-6 p-6 max-w-3xl mx-auto">
            {/* Header Section */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Page Not Found</h1>
            </div>

            {/* 404 Content Card */}
            <div className="bg-white rounded-lg shadow-lg p-10 flex flex-col items-center justify-center text-center">
                <h2 className="text-9xl font-bold text-indigo-600 mb-6">404</h2>
                <p className="text-2xl text-gray-800 mb-4">Page Not Found</p>
                <p className="text-gray-600 mb-8">
                    The page you're looking for doesn't exist or has been moved.
                </p>

                {/* Return Button */}
                <button
                    onClick={() => window.location.href = isLoggedIn ? '/admin/manage-admins' : '/login'}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    Return to {isLoggedIn ? 'Dashboard' : 'Login'}
                </button>
            </div>
        </div>
    );
};

export default AdminNotFound;