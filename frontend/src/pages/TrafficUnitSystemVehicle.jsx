import HomeNavBar from './HomeNavBar';
import CarCard from '../assets/output-onlinepngtools (1).png'; // Adjust the path as necessary
import BGImage from '../assets/istockphoto-950322678-612x612.jpg'; // Adjust the path as necessary

const TrafficUnitSystemVehicle = () => {

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* Navigation Bar */}
            <HomeNavBar />

            {/* Hero Section */}
            <div className="relative">
                <img
                    src={BGImage}
                    alt="Traffic background"
                    className="w-fit h-96 object-cover text-center mx-auto"
                />
            </div>

            {/* Vehicle Services Section */}
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Digital Sticker */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="h-48 relative">
                            <img
                                src={CarCard}
                                alt="Digital Sticker"
                                className="w-full h-full object-contain p-4"
                            />
                        </div>
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-10 text-center">
                                Digital Sticker
                            </h3>
                            <div className="flex justify-center">
                                <button
                                    className="bg-blue-800 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-900 transition"
                                    onClick={() => window.location.href = '/login'}
                                >
                                    More
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Renewal of vehicle license */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="h-48 relative">
                            <img
                                src={CarCard}
                                alt="Vehicle License Renewal"
                                className="w-full h-full object-contain p-4"
                            />
                        </div>
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                                Renewal of vehicle license
                            </h3>
                            <div className="flex justify-center">
                                <button
                                    className="bg-blue-800 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-900 transition"
                                    onClick={() => window.location.href = '/login'}
                                >
                                    More
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Replacement of damaged vehicle license */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="h-48 relative">
                            <img
                                src={CarCard}
                                alt="Damaged Vehicle License"
                                className="w-full h-full object-contain p-4"
                            />
                        </div>
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                                Replacement of damaged vehicle license
                            </h3>
                            <div className="flex justify-center">
                                <button
                                    className="bg-blue-800 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-900 transition"
                                    onClick={() => window.location.href = '/login'}
                                >
                                    More
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Replacement for lost vehicle licence */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="h-48 relative">
                            <img
                                src={CarCard}
                                alt="Lost Vehicle License"
                                className="w-full h-full object-contain p-4"
                            />
                        </div>
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                                Replacement for lost vehicle licence
                            </h3>
                            <div className="flex justify-center">
                                <button
                                    className="bg-blue-800 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-900 transition"
                                    onClick={() => window.location.href = '/login'}
                                >
                                    More
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Core Services Section */}
            <div className="bg-blue-600 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-white text-center mb-8">Our Digital Services</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Driving License Services */}
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <div className="flex items-center mb-4">
                                <div className="bg-blue-100 p-3 rounded-full mr-4">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Driving License Services</h3>
                            </div>
                            <ul className="space-y-3">
                                <li className="flex items-start">
                                    <svg className="flex-shrink-0 h-5 w-5 text-blue-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span className="ml-2 text-gray-600">Apply for new driving license</span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="flex-shrink-0 h-5 w-5 text-blue-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span className="ml-2 text-gray-600">Renew or replace lost license</span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="flex-shrink-0 h-5 w-5 text-blue-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span className="ml-2 text-gray-600">Schedule driving tests</span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="flex-shrink-0 h-5 w-5 text-blue-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span className="ml-2 text-gray-600">Grievance traffic violations</span>
                                </li>
                            </ul>
                        </div>

                        {/* Vehicle License Services */}
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <div className="flex items-center mb-4">
                                <div className="bg-blue-100 p-3 rounded-full mr-4">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Vehicle License Services</h3>
                            </div>
                            <ul className="space-y-3">
                                <li className="flex items-start">
                                    <svg className="flex-shrink-0 h-5 w-5 text-blue-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span className="ml-2 text-gray-600">New vehicle registration</span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="flex-shrink-0 h-5 w-5 text-blue-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span className="ml-2 text-gray-600">License plate requests</span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="flex-shrink-0 h-5 w-5 text-blue-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span className="ml-2 text-gray-600">Renew vehicle license</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="mt-12 text-center">
                        <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
                        <div className="flex flex-wrap justify-center gap-4">
                            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition"
                                onClick={() => window.location.href = '/login'}>
                                Check Traffic Violations
                            </button>
                            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition"
                                onClick={() => window.location.href = '/login'}>
                                Pay Fines Online
                            </button>
                            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition"
                                onClick={() => window.location.href = '/login'}>
                                Book Appointment
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrafficUnitSystemVehicle;