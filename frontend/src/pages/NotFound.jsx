// NotFound.jsx
import { useEffect, useState } from 'react';
import HomeNavBar from '../components/HomeNavBar';
import Layout from '../components/Layout';

const NotFound = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);

        // Set background style
        document.body.style.backgroundImage = "url('src/assets/tahrir.png')";
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundRepeat = "no-repeat";
        document.body.style.backgroundAttachment = "fixed";
        document.body.style.backgroundPosition = "center";
    }, []);

    return (
        <>
            {isLoggedIn ? (
                <Layout
                    navigation={[
                        { name: 'Dashboard', href: '/dashboard' },
                        { name: 'Driving License', href: '/driving-license-public' },
                        { name: 'Car License', href: '/car-license' },
                        { name: 'Violations', href: '/violations' },
                        { name: 'License Request', href: '/license-request' },
                    ]}
                />
            ) : (
                <HomeNavBar />
            )}

            <div className="max-w-md mx-auto bg-white/50 p-10 mt-32 rounded-3xl text-center">
                <h1 className="text-9xl font-bold text-primary-600 mb-4">404</h1>
                <p className="text-2xl text-gray-800 mb-6">Page Not Found</p>
                <p className="text-gray-600 mb-8">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <button
                    onClick={() => window.location.href = isLoggedIn ? '/dashboard' : '/login'}
                    className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                >
                    Return to {isLoggedIn ? 'Dashboard' : 'Home'}
                </button>
            </div>
        </>
    );
};

export default NotFound;