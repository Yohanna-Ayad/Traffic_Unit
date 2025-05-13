import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import Layout from '../../components/Layout';
import axios from 'axios';

export default function TheoreticalCoursePage() {
    const [courseMaterial, setCourseMaterial] = useState(null);
    const [examRequest, setExamRequest] = useState(false);

    const [button, setButton] = useState("Active");
    
    useEffect(() => {
        const checkCoursePermission = async () => {
            try {
                const res = await axios.get('http://localhost:8626/users/me/course/permission', {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (res.data.permission) {
                    setExamRequest(true);
                } else {
                    setExamRequest(false);
                    window.location.href = '/driving-license-public';
                }
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to check course permission. Please try again later.');
            }
        };
        checkCoursePermission();

        const fetchPendingRequest = async () => {
            try {
                const res = await axios.get('http://localhost:8626/users/me/request/drivingLicenseExam', {
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



    const handleRequestExam = async () => {
        try {
            const res = await axios.post('http://localhost:8626/users/me/request/drivingLicenseExam', {
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
            <div className="container mx-auto py-8 px-5 max-w-2xl">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Theoretical Driving Course</h1>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Course Material</h2>
                    <p className="mb-4">
                        Please review the theoretical driving course material before proceeding to the exam.
                    </p>
                    <a
                        href="/path/to/theoretical-course.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:underline"
                    >
                        Download Theoretical Course PDF
                    </a>
                    <button
                        onClick={handleRequestExam}
                        className="mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        disabled={button === "Inactive"}
                        style={button === "Inactive" ? { backgroundColor: 'gray', cursor: 'not-allowed' } : {}}
                        title={button === "Inactive" ? "You have already requested a course." : ""}
                        aria-disabled={button === "Inactive" ? true : false}
                    >
                        Request Online Exam
                    </button>
                </div>
            </div>
        </>
    );
}