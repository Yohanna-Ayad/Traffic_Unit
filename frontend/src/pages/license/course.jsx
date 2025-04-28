import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import Layout from '../../components/Layout';

export default function TheoreticalCoursePage() {
    const [courseMaterial, setCourseMaterial] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const res = await fetch('/api/license/course-material');
                const data = await res.json();
                setCourseMaterial(data);
            } catch (error) {
                toast.error('Failed to load course material');
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, []);

    return (
        <Layout
            navigation={[
                { name: 'Dashboard', href: '/dashboard' },
                { name: 'Driving License', href: '/driving-license-public' },
                { name: 'Car License', href: '/car-license' },
                { name: 'Violations', href: '/violations' },
            ]}
        >
            <div className="max-w-2xl mx-auto py-5 px-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Theoretical Driving Course</h1>

                {loading ? (
                    <p>Loading course material...</p>
                ) : (
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-4">Course Material</h2>
                        <p className="mb-4">{courseMaterial?.description || 'Review the driving rules and regulations.'}</p>

                        <a
                            href={courseMaterial?.pdfUrl || "/docs/theoretical-course.pdf"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-600 hover:underline"
                        >
                            Download Theoretical Course PDF
                        </a>

                        <a
                            href="/license/exam"
                            className="mt-6 block w-full text-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                        >
                            Start Exam
                        </a>
                    </div>
                )}
            </div>
        </Layout>
    );
}