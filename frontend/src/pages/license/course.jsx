import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import Layout from '../../components/Layout';

export default function TheoreticalCoursePage() {
    const [courseMaterial, setCourseMaterial] = useState(null);
    const [examRequest, setExamRequest] = useState(false);

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
                        // onClick={}
                        className="mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                        Request Online Exam
                    </button>
                </div>
            </div>
        </>
    );
}