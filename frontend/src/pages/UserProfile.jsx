import { useState } from 'react';
import { toast } from 'react-hot-toast';
import Layout from '../components/Layout';

function UserProfile() {
    const [user, setUser] = useState({
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
        address: '123 Main St, City, Country',
        profilePicture: 'https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_1280.png',
    });

    const [showDrivingLicenseForm, setShowDrivingLicenseForm] = useState(false);
    const [drivingLicenseData, setDrivingLicenseData] = useState({
        startDate: '',
        endDate: '',
        drivingLicenseUnit: '',
        drivingLicenseType: 'A',
        government: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleDrivingLicenseChange = (e) => {
        const { name, value } = e.target;
        setDrivingLicenseData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        toast.success('Profile updated successfully!');
    };

    const handleDrivingLicenseSubmit = (e) => {
        e.preventDefault();
        toast.success('Driving license data updated successfully!');
        setShowDrivingLicenseForm(false);
    };

    return (
        <>
            <Layout navigation={[
                { name: 'Dashboard', href: '/dashboard' },
            ].filter(Boolean)} />
            
            <div className="max-w-4xl mx-auto py-4 px-4">
                <h1 className="text-3xl font-bold text-gray-900">User Profile</h1>

                <div className="bg-white p-5 rounded-lg shadow">
                    <div className="flex flex-col items-center space-y-4">
                        <img
                            src="https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_1280.png"
                            alt="Profile"
                            className="w-32 h-32 rounded-full object-cover"
                        />
                        <h2 className="text-2xl font-semibold text-gray-900">{user.name}</h2>
                        
                        <button
                            onClick={() => setShowDrivingLicenseForm(!showDrivingLicenseForm)}
                            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                        >
                            {showDrivingLicenseForm ? 'Cancel Editing' : 'Edit Driving License Data'}
                        </button>
                    </div>

                    {/* Driving License Form */}
                    {showDrivingLicenseForm && (
                        <form onSubmit={handleDrivingLicenseSubmit} className="mt-8 space-y-6">
                            <div>
                                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                                    Start Date
                                </label>
                                <input
                                    type="date"
                                    name="startDate"
                                    id="startDate"
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                    value={drivingLicenseData.startDate}
                                    onChange={handleDrivingLicenseChange}
                                />
                            </div>

                            <div>
                                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                                    End Date
                                </label>
                                <input
                                    type="date"
                                    name="endDate"
                                    id="endDate"
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                    value={drivingLicenseData.endDate}
                                    onChange={handleDrivingLicenseChange}
                                />
                            </div>

                            <div>
                                <label htmlFor="government" className="block text-sm font-medium text-gray-700">
                                    Government
                                </label>
                                <select
                                    name="government"
                                    id="government"
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                    value={drivingLicenseData.government}
                                    onChange={handleDrivingLicenseChange}
                                >
                                    <option value="">Select a Government</option>
                                    <option value="cairo">Cairo</option>
                                    <option value="giza">Giza</option>
                                    <option value="alexandria">Alexandria</option>
                                    <option value="aswan">Aswan</option>
                                    <option value="luxor">Luxor</option>
                                    <option value="port-said">Port Said</option>
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
                                    value={drivingLicenseData.drivingLicenseUnit}
                                    onChange={handleDrivingLicenseChange}
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
                                    value={drivingLicenseData.drivingLicenseType}
                                    onChange={handleDrivingLicenseChange}
                                >
                                    <option value="A">A - Motorcycle</option>
                                    <option value="B">B - Private Vehicle</option>
                                    <option value="C">C - Commercial Vehicle</option>
                                    <option value="D">D - Heavy Equipment</option>
                                    <option value="A1">A1 - Light Motorcycle</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            >
                                Update Driving License
                            </button>
                        </form>
                    )}

                    {/* Original Profile Form */}
                    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                value={user.name}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                value={user.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                id="phone"
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                value={user.phone}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                Address
                            </label>
                            <input
                                type="text"
                                name="address"
                                id="address"
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                value={user.address}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-700">
                                Profile Picture URL
                            </label>
                            <input
                                type="url"
                                name="profilePicture"
                                id="profilePicture"
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                value={user.profilePicture}
                                onChange={handleChange}
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                            Update Profile
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default UserProfile;