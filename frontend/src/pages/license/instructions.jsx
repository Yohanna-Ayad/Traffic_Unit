import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import Layout from '../../components/Layout';

export default function LicenseInstructionsPage() {
    const [button, setButton] = useState("Active");
    
    useEffect(() => {
        const fetchPendingRequest = async () => {
            try {
                const res = await axios.get('http://localhost:8626/users/me/request/drivingLicense', {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (res.data.request === false) {
                    setButton("Inactive");
                } else {
                    setButton("Active");
                }
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to fetch request status. Please try again later.');
            }
        };
        fetchPendingRequest();
    }, []);



    const handleRequestCourse = async () => {
        try {
            const res = await axios.post('http://localhost:8626/users/me/request/drivingLicense', {
                userId: localStorage.getItem('userId'),
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            console.log(res.data);
            if (res.status === 200) {
                toast.success(res.data.message);
                setButton("Inactive");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to request course. Please try again later.');
        }
    }

    return (
        <>
            <Layout
                navigation={[
                    { name: 'Dashboard', href: '/dashboard' },
                    { name: 'Driving License', href: '/driving-license-public' },
                    { name: 'Car License', href: '/car-license' },
                    { name: 'Violations', href: '/violations' },
                ]}
            />
            <div className="max-w-2xl mx-auto py-5 px-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">How to Extract a Driving License</h1>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Instructions</h2>
                    <ul className="list-disc list-inside space-y-2">
                        <li>Complete the theoretical driving course.</li>
                        <li>Pass the online exam with a score of at least 70%.</li>
                        <li>Visit the traffic unit to complete the practical driving exam.</li>
                        <li>Submit the required documents and pay the fees.</li>
                    </ul>
                    <button
                        onClick={handleRequestCourse}
                        className="mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        disabled={button === "Inactive"}
                        style={button === "Inactive" ? { backgroundColor: 'gray', cursor: 'not-allowed' } : {}}
                        title={button === "Inactive" ? "You have already requested a course." : ""}
                        aria-disabled={button === "Inactive" ? true : false}
                    >
                        Request Driving License Course
                    </button>
                </div>
            </div>
        </>
    );
}