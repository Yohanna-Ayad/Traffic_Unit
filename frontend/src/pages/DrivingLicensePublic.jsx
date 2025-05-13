import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, X } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import Layout from '../components/Layout';
import DrivingLicenseData from './DrivingLicenseData'; // Import your form component

function DrivingLicense() {
    const user = JSON.parse(localStorage.getItem('user'));
    const [showAddModal, setShowAddModal] = useState(false);
    const [showExistingLicenseForm, setShowExistingLicenseForm] = useState(false);
    const [showNewLicenseForm, setShowNewLicenseForm] = useState(false);
    const [licenses, setLicenses] = useState([]);
    const [showApprovedCourse, setShowApprovedCourse] = useState(false);
    const [showApprovedExam, setShowApprovedExam] = useState(false);
    const [showRetakeTheoreticalExam, setShowRetakeTheoreticalExam] = useState(false);
    const [showRetakeTheoreticalExam2, setShowRetakeTheoreticalExam2] = useState(false);
    const [showExamDateSelect, setShowExamDateSelect] = useState(false);
    const [retakeTimeRemaining, setRetakeTimeRemaining] = useState(null);
    const [examDeadlineDate, setExamDeadlineDate] = useState(null);
    const [examTimeRemaining, setExamTimeRemaining] = useState(null);

    const [practicalExamStartDate, setPracticalExamStartDate] = useState(null);
    const [practicalExamEndDate, setPracticalExamEndDate] = useState(null);

    const [licenseFetched, setLicenseFetched] = useState(false);
    const [courseChecked, setCourseChecked] = useState(false);
    const [retakeCheckDone, setRetakeCheckDone] = useState(false);
    const [examApprovedCheckDone, setExamApprovedCheckDone] = useState(false);
    const [examDateSelect, setExamDateSelect] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8626/users/me/Drlicense',
                    {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                    }
                );
                // console.log({ GetDrivingLicenses: response.data })
                if (response.data.message === "No driving license found") {

                    const customToastStyle = {
                        border: '1px solid #FFA040',
                        backgroundColor: '#FFB266',
                        color: 'white',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        padding: '16px 24px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        fontSize: '15px',
                        fontWeight: 500,
                    };
                    toast.custom(
                        (t) => (
                            <div style={customToastStyle} className={t.visible ? 'animate-enter' : 'animate-leave'}>
                                <Plus size={18} color="white" />
                                <span>No driving license found. Please add one.</span>
                                <button
                                    onClick={() => toast.dismiss(t.id)}
                                    style={{
                                        marginLeft: '20px',
                                        background: 'transparent',
                                        border: 'none',
                                        color: 'white',
                                        cursor: 'pointer',
                                    }}
                                >
                                    ×
                                </button>
                            </div>
                        ),
                        {
                            position: 'top-center',
                            duration: 5000,
                        }
                    );
                    setLicenses([]);
                }
                else {
                    setLicenses(response.data);
                }
            } catch (error) {
                console.error(error.response.data.error);
                setError(error.response.data.error);
                setExamDateSelect(true); // Ensure we don't get stuck loading
            }
            finally {
                setLicenseFetched(true);
            }
        };
        fetchData();
    }, [])

    useEffect(() => {
        const checkApprovedCourse = async () => {
            try {
                const response = await axios.get('http://localhost:8626/users/me/course/approved', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                if (response.data.approved) {
                    // toast.success('Course approved!');
                    setShowApprovedCourse(true);
                } else {
                    // console.log('Course not approved yet!');
                    // toast.error('Course not approved yet!');
                }
            } catch (error) {
                // toast.error('Failed to check course approval');
                console.error('Failed to check course approval', error);
                setError(error.response.data.error);
                setExamDateSelect(true); // Ensure we don't get stuck loading
            }
            finally {
                setCourseChecked(true);
            }
        };
        checkApprovedCourse();
    }, []);

    useEffect(() => {
        const check30DaysPassedSinceLastExam = async () => {
            try {
                const response = await axios.get('http://localhost:8626/users/me/request/drivingLicenseExam/30days', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                // console.log(response.data)
                if (response.data.message === "No failed request found") {
                    setRetakeCheckDone(true);
                    return;
                }
                // console.log(response.data.passed.passed)
                if (response.data.passed.passed === true) {
                    setShowRetakeTheoreticalExam(true);
                } else if (response.data.passed.passed === false) {
                    setShowRetakeTheoreticalExam2(true);
                    setRetakeTimeRemaining(response.data.passed.remainingDays);
                }
            } catch (error) {
                // console.error('Failed to check 30 days since last exam', error);
                console.error(error);
                setError(error.response.data.error);
                setExamDateSelect(true); // Ensure we don't get stuck loading
                // toast.error('Failed to check 30 days since last exam');
                // console.error(error.response.data.error);
                // if (error.response.data.error === "No failed request found") {
                //     setRetakeCheckDone(true);
                // }
            }
            finally {
                setRetakeCheckDone(true);
            }
        }
        check30DaysPassedSinceLastExam();
    }, []);
    useEffect(() => {
        const checkApprovedExam = async () => {
            try {
                const response = await axios.get('http://localhost:8626/users/me/drivingLicenseExam/approved', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });

                if (response.data.approved?.approved) {
                    setShowApprovedExam(true);
                    const deadlineDate = new Date(response.data.approved.deadline);
                    // console.log(deadlineDate)
                    setExamDeadlineDate(deadlineDate);
                } else {
                    setShowApprovedExam(false);
                }
            } catch (error) {
                console.error('Failed to check exam approval', error);
                setError(error.response.data.error);
                setExamDateSelect(true); // Ensure we don't get stuck loading
            } finally {
                setExamApprovedCheckDone(true);
            }
        };

        checkApprovedExam();
    }, []);

    useEffect(() => {
        if (
            licenseFetched &&
            courseChecked &&
            retakeCheckDone &&
            examApprovedCheckDone &&
            examDateSelect
        ) {
            setLoading(false);
        } else {
            // Add a timeout fallback in case something gets stuck
            const timeout = setTimeout(() => {
                setLoading(false);
                console.warn('Loading timeout reached - forcing display');
            }, 10000); // 10 second timeout

            return () => clearTimeout(timeout);
        }
    }, [licenseFetched, courseChecked, retakeCheckDone, examApprovedCheckDone, examDateSelect]);
    // useEffect(() => {
    //     console.log({ licenseFetched: licenseFetched })
    //     console.log({ courseChecked: courseChecked })
    //     console.log({ retakeCheckDone: retakeCheckDone })
    //     console.log({ examApprovedCheckDone: examApprovedCheckDone })
    //     console.log({ examDateSelect: examDateSelect })
    //     if (
    //         licenseFetched &&
    //         courseChecked &&
    //         retakeCheckDone &&
    //         examApprovedCheckDone &&
    //         examDateSelect
    //     ) {
    //         setLoading(false);
    //     }
    // }, [licenseFetched, courseChecked, retakeCheckDone, examApprovedCheckDone]);

    // Countdown timer effect (runs once deadlineDate is set)
    useEffect(() => {
        if (!examDeadlineDate) return;
        const calculateTimeRemaining = () => {
            const now = new Date();
            const diff = examDeadlineDate - now;

            if (diff <= 0) {
                setExamTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setExamTimeRemaining({ days, hours, minutes, seconds });
        };

        // Initial calculation
        calculateTimeRemaining();

        // Update every second
        const intervalId = setInterval(calculateTimeRemaining, 1000);

        // Cleanup on unmount
        return () => clearInterval(intervalId);
    }, [examDeadlineDate]);

    useEffect(() => {
        const checkPracticalDrivingLicenseExamRequest = async () => {
            try {
                const response = await axios.get(
                    'http://localhost:8626/users/me/request/practicalDrivingLicenseExam',
                    {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                    }
                );

                console.log(response.data);

                if (response.data.request === false) {
                    setShowExamDateSelect(false);
                } else {
                    if (response.data.request.approved) {
                        const backendDate = new Date(response.data.request.endDate);
                        const currentDate = new Date();

                        if (backendDate < currentDate) {
                            setShowExamDateSelect(false);
                        } else {
                            setPracticalExamStartDate(response.data.request.startDate);
                            setPracticalExamEndDate(response.data.request.endDate);
                            setShowExamDateSelect(true);
                        }
                    } else {
                        setShowExamDateSelect(false);
                    }
                }
            } catch (error) {
                console.error('Failed to check practical driving license exam request', error);
                setError(error.response.data.error);
                setExamDateSelect(true); // Ensure we don't get stuck loading
                setShowExamDateSelect(false);
            } finally {
                setExamDateSelect(true);
            }
        };

        checkPracticalDrivingLicenseExamRequest();
    }, []);

    // useEffect(() => {
    //     const checkPracticalDrivingLicenseExamRequest = async () => {
    //         try {
    //             const response = await axios.get('http://localhost:8626/users/me/request/practicalDrivingLicenseExam', {
    //                 headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    //             });
    //             console.log(response.data)
    //             if (response.data.request === false) {
    //                 setShowExamDateSelect(false);
    //                 setExamDateSelect(true);
    //             }
    //             else {
    //                 if (response.data.request.approved) {
    //                     const backendDate = new Date(response.data.request.endDate);
    //                     const currentDate = new Date();
    //                     // console.log(backendDate, currentDate)
    //                     // 2. Compare Date objects
    //                     // console.log(backendDate < currentDate); // true if backend date is in the past
    //                     if (backendDate < currentDate) {
    //                         setShowExamDateSelect(false);
    //                         setExamDateSelect(true);

    //                     }
    //                     else {
    //                         setPracticalExamStartDate(response.data.request.startDate);
    //                         setPracticalExamEndDate(response.data.request.endDate);
    //                         setShowExamDateSelect(true);
    //                         setExamDateSelect(true);

    //                     }
    //                 } else {
    //                     setShowExamDateSelect(false);
    //                     setExamDateSelect(true);
    //                 }
    //             }
    //         } catch (error) {
    //             console.error('Failed to check practical driving license exam request', error);
    //         }
    //         finally {
    //             setExamDateSelect(true);
    //         }
    //     }
    //     checkPracticalDrivingLicenseExamRequest();
    // }, []);

    // Handle keyboard and click outside events
    const handleKeyDown = (event) => {
        if (event.keyCode === 27) {
            setShowAddModal(false);
            setShowExistingLicenseForm(false);
            setShowNewLicenseForm(false);
        }
    };

    const handleClickOutside = (event) => {
        if (event.target === document.querySelector('.fixed')) {
            setShowAddModal(false);
            setShowExistingLicenseForm(false);
            setShowNewLicenseForm(false);
        }
    }

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('click', handleClickOutside);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const checkLicense = () => {
        if (licenses.endDate < Date.now()) {
            return 'Expired'
        } else {
            return 'Active'
        }
    }

    const handleAddLicense = (type) => {
        if (type === 'add existing') {
            setShowAddModal(false);
            setShowExistingLicenseForm(true);
        } else if (type === 'request new') {
            setShowAddModal(false);
            setShowNewLicenseForm(true);

            // toast.success(`Request to ${type} submitted!`);

        }
    };

    const handleRetakeTheoreticalExam = async () => {
        try {
            const response = await axios.post(
                'http://localhost:8626/users/me/request/drivingLicenseExam/reRequest',
                {}, // Empty body if no payload needed
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            // console.log('Exam retake response:', response.data);

            // Handle response based on data structure
            if (response.data?.error) {
                // Backend returned an error message in the response body
                toast.error(response.data.error);
            } else if (response.status === 200 || response.status === 201) {
                // Success status codes
                toast.success(response.data.message || 'Request submitted successfully!');

                // Optional: Add delay before redirecting or updating UI
                setTimeout(() => {
                    // Add navigation or state update here if needed
                }, 1500);
            } else {
                // Unexpected status code
                toast.error('Failed to process request. Please try again.');
            }

        } catch (error) {
            // Handle network errors or API errors
            if (error.response) {
                // Server responded with a status code outside 2xx
                toast.error(
                    error.response.data?.error ||
                    error.response.data?.message ||
                    'Failed to process request'
                );
            } else if (error.request) {
                // No response received
                toast.error('No response from server. Please check your connection.');
            } else {
                // Other errors (e.g., network issues)
                toast.error('An unexpected error occurred. Please try again.');
            }

            console.error('Exam retake error:', error);
        }
    };
    // const handleRetakeTheoreticalExam = async () => {
    //     const response = await axios.post('http://localhost:8626/users/me/request/drivingLicenseExam/reRequest', {}, {
    //         headers: {
    //             'Content-Type': 'application/json',
    //             Authorization: `Bearer ${localStorage.getItem('token')}`
    //         }
    //     });
    //     console.log(response.data)
    //     // if (response.status === 200) {
    //     //     toast.success(response.data.message || 'Your request has been submitted!');
    //     // } else {
    //     //     toast.error(response.data.error || 'Failed to re-request exam');
    //     // }
    // };

    const handleFormSubmit = () => {
        // console.log("Submit")
        toast.success('Existing license added successfully!');
    };
    return (
        <>
            {loading ? (
                <div className="flex justify-center items-center min-h-screen bg-gray-50">
                    {error ? (
                        <div className="text-red-500 text-center">
                            <p>{error}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="mt-4 px-4 py-2 bg-red-100 rounded-md"
                            >
                                Retry
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
                            <span className="ml-4 text-lg font-medium text-gray-700">Loading data...</span>
                        </>
                    )}
                </div>
            ) : (
                <>
                    <Layout
                        navigation={[
                            { name: 'Dashboard', href: '/dashboard' },
                            { name: 'Driving License', href: '/driving-license-public' },
                            { name: 'Car License', href: '/car-license' },
                            { name: 'Violations', href: '/violations' },
                        ]}
                    />
                    <div className="max-w-6xl mx-auto py-5 px-4">
                        {/* Approved Course Banner */}
                        {showApprovedCourse && (
                            <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg shadow-sm animate-fade-in">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <svg className="h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-green-800">
                                            Your theoretical driving course has been approved!
                                        </p>
                                        <div className="mt-2">
                                            <button
                                                onClick={() => window.location.assign('/driving-license-course')}
                                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-150"
                                            >
                                                Proceed to Course Page
                                                <svg className="ml-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* Approved Exam Banner */}
                        {showApprovedExam && (
                            <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg shadow-sm animate-fade-in">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <svg className="h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-green-800">
                                            Your practical driving exam has been approved!
                                        </p>

                                        {/* Live Countdown Timer */}
                                        {examTimeRemaining && (
                                            <p className="text-sm text-amber-800 mt-1 flex items-center">
                                                <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span className="font-semibold">
                                                    {examTimeRemaining.days > 0 && `${examTimeRemaining.days}d `}
                                                    {examTimeRemaining.hours > 0 && `${examTimeRemaining.hours}h `}
                                                    {examTimeRemaining.minutes > 0 && `${examTimeRemaining.minutes}m `}
                                                    {examTimeRemaining.seconds}s left
                                                </span>
                                                <span className="ml-1">to complete your exam</span>
                                            </p>
                                        )}

                                        <div className="mt-2">
                                            <button
                                                onClick={() => window.location.assign('/driving-license-exam')}
                                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-150"
                                            >
                                                Go to Exam Page
                                                <svg className="ml-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* Retake Theoretical Exam Banner */}
                        {showRetakeTheoreticalExam && (
                            <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg shadow-sm animate-fade-in">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <svg className="h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-green-800">
                                            Your theoretical driving exam has been approved!
                                        </p>
                                    </div>
                                    <div className="ml-3">
                                        <button
                                            onClick={handleRetakeTheoreticalExam}
                                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-150"
                                        >
                                            Proceed to Exam Page
                                            <svg className="ml-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                        {showRetakeTheoreticalExam2 && (
                            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-sm animate-fade-in">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <svg className="h-6 w-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-red-800">
                                            Remaining time to retake your theoretical driving exam!
                                        </p>

                                        <p className="text-sm text-amber-800 mt-1 flex items-center">
                                            <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span className="font-semibold">
                                                {retakeTimeRemaining} Days left
                                                {/* {retakeTimeRemaining.days > 0 && `${retakeTimeRemaining.days}d `}
                {retakeTimeRemaining.hours > 0 && `${retakeTimeRemaining.hours}h `}
                {retakeTimeRemaining.minutes > 0 && `${retakeTimeRemaining.minutes}m `}
                {retakeTimeRemaining.seconds}s left */}
                                            </span>
                                            <span className="ml-1">to Retake your exam</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Approved Exam Banner */}
                        {/* {showApprovedExam && (
                    <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg shadow-sm animate-fade-in">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg className="h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-green-800">
                                    Your practical driving exam has been approved!
                                </p>

                                <p className="text-sm text-amber-800 mt-1 flex items-center">
                                    <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>Please note: This exam will be available for 5 days only. Make sure to complete it before the deadline.</span>
                                </p>

                                <div className="mt-2">
                                    <button
                                        onClick={() => window.location.assign('/driving-license-exam')}
                                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-150"
                                    >
                                        Proceed to Exam Page
                                        <svg className="ml-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )} */}
                        {/* ... existing table and buttons ... */}
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-bold text-gray-800">Driving Licenses</h1>
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                            >
                                <Plus className="w-5 h-5" />
                                <span>Add License</span>
                            </button>
                        </div>
                        {/* Add License Modal */}
                        {/* {showAddModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold text-gray-800">License Options</h2>
                                    <button
                                        onClick={() => setShowAddModal(false)}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )} */}

                        {/* Add License Modal */}
                        {showAddModal && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                                <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                                    <div className="p-6">
                                        <div className="flex justify-between items-center mb-6">
                                            <h2 className="text-xl font-bold text-gray-800">License Options</h2>
                                            <button
                                                onClick={() => setShowAddModal(false)}
                                                className="text-gray-500 hover:text-gray-700"
                                            >
                                                <X className="w-6 h-6" />
                                            </button>
                                        </div>

                                        <div className="space-y-4">
                                            <button
                                                onClick={() => handleAddLicense('add existing')}
                                                className="w-full p-4 bg-indigo-100 hover:bg-indigo-200 rounded-lg text-indigo-700 font-medium transition-colors"
                                            >
                                                Add Existing License
                                            </button>
                                            <button
                                                onClick={() => handleAddLicense('request new')}
                                                className="w-full p-4 bg-green-100 hover:bg-green-200 rounded-lg text-green-700 font-medium transition-colors"
                                            >
                                                Request New License
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {showExistingLicenseForm && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                                <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                                    <div className="p-6">
                                        <div className="flex justify-between items-center mb-6">
                                            <h2 className="text-xl font-bold text-gray-800">Add Existing License</h2>
                                            <button
                                                onClick={() => setShowExistingLicenseForm(false)}
                                                className="text-gray-500 hover:text-gray-700"
                                            >
                                                <X className="w-6 h-6" />
                                            </button>
                                        </div>
                                        <DrivingLicenseData onSubmit={handleFormSubmit} />
                                    </div>
                                </div>
                            </div>
                        )}
                        {showNewLicenseForm && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                                <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                                    <div className="p-6">
                                        <div className="flex justify-between items-center mb-6">
                                            <h2 className="text-xl font-bold text-gray-800">Request New License</h2>
                                            <button
                                                onClick={() => setShowNewLicenseForm(false)}
                                                className="text-gray-500 hover:text-gray-700"
                                            >
                                                <X className="w-6 h-6" />
                                            </button>
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="licenseType" className='block text-sm font-medium text-gray-700'>License Type</label>
                                            <select
                                                id="licenseType"
                                                name="licenseType"
                                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                                            >
                                                <option value="car">Car</option>
                                                <option value="motorcycle">Motorcycle</option>
                                            </select>
                                        </div>
                                        <button
                                            type="submit"
                                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                            onClick={() => {
                                                setShowNewLicenseForm(false);
                                                toast.success('New license request submitted!');
                                                window.location.href = '/driving-license-instructions';
                                            }
                                            }
                                        >
                                            Submit Application
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Licenses Table */}
                        <div className="bg-white rounded-lg shadow overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">License Number</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expiry Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {licenses.map((license) => (
                                        <tr key={license.id}>
                                            <td className="px-6 py-4">{license.licenseNumber}</td>
                                            <td className="px-6 py-4">{license.licenseType}</td>
                                            <td className="px-6 py-4">{license.endDate.split("T")[0]}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${checkLicense(license)
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {checkLicense(license)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {showExamDateSelect && (
                            <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg shadow-sm animate-fade-in">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <svg className="h-6 w-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-yellow-800">
                                            You have a pending request for a practical driving license exam.
                                        </p>
                                    </div>
                                    <div className="ml-auto">
                                        <button
                                            onClick={() => setShowExamDateSelect(false)}
                                            className="text-yellow-500 hover:text-yellow-700"
                                        >
                                            <X className="w-6 h-6" />
                                        </button>
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <p className="text-sm text-yellow-700">
                                        Your exam is scheduled for <b>{practicalExamStartDate.split("T")[0]} to {practicalExamEndDate.split("T")[0]}</b>.
                                    </p>
                                    <p className="text-sm text-yellow-700">
                                        Please make sure to be available during this time.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}
        </>
    );
}

export default DrivingLicense;