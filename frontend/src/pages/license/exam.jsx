import { useEffect, useState, useRef } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import Layout from '../../components/Layout';

export default function OnlineExamPage() {
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 mins
    const [examCompleted, setExamCompleted] = useState(false);
    const [score, setScore] = useState(null);
    const timerRef = useRef(null);
    const [examReRequest, setExamReRequest] = useState(false);
    const isAnswered = answers[questions[currentQuestion]?.id];


    useEffect(() => {
        const checkExamPermission = async () => {
            try {
                const res = await axios.get('http://localhost:8626/users/me/exam/permission', {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                console.log(res.data);
                console.log(res.data.permission);
                if (!res.data.permission) {
                    toast.error('You are not allowed to take the exam. Please complete the course first.');
                    setTimeout(() => {
                        window.location.href = '/driving-license-public';
                    }, 3000);
                }
            } catch (error) {
                toast.error('Failed to check exam permission. Please try again later.');
            }
        };
        checkExamPermission();
        const fetchQuestions = async () => {
            try {
                const res = await axios.get('http://localhost:8626/users/me/drivingLicenseExam/questions', {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                console.log(res.data);
                if (res.data.questions && res.data.questions.length > 0) {
                    setQuestions(res.data.questions);
                } else {
                    toast.error('No questions received from the server');
                }
            } catch (error) {
                toast.error('Failed to load exam questions');
            }
        };

        fetchQuestions();
    }, []);

    useEffect(() => {
        if (questions.length > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current);
                        submitExam();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [questions]);
    const handleAnswer = (questionId, selectedOptionIndex) => {
        const optionLetter = String.fromCharCode(65 + selectedOptionIndex);
        setAnswers((prev) => ({
            ...prev,
            [questionId]: optionLetter,
        }));

        // Auto-advance to next question
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        }
    };
    const submitExam = async () => {
        try {
            clearInterval(timerRef.current);

            const correctCount = questions.reduce((count, q) => {
                return answers[q.id] === q.correctAnswer ? count + 1 : count;
            }, 0);

            const total = questions.length;
            const finalScore = Math.round((correctCount / total) * 100);

            setScore(finalScore);
            setExamCompleted(true);

            const response = await axios.post(
                'http://localhost:8626/users/me/request/practicalDrivingLicenseExam',
                {
                    score: finalScore,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            console.log(response.data);

            if (response.status === 200 && response.data.message === "Request sent successfully") {
                toast.success('Exam submitted successfully!');
                toast.success(`Your score: ${finalScore}%`);
                toast.success('You may now proceed to the practical exam request.');
                setTimeout(() => {
                    window.location.href = '/driving-license-public';
                }, 3000);
            } else {
                toast.error(response.data.message || 'Failed to submit exam');
                setExamReRequest(true);
                // setTimeout(() => {
                //     window.location.href = '/driving-license-public';
                // }, 3000);
            }

        } catch (error) {
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                'Failed to submit exam';
            toast.error(errorMessage);
            setExamReRequest(true);
            // setTimeout(() => {
            //     window.location.href = '/driving-license-public';
            // }, 3000);
        }
    };

    const handleReRequestExam = async () => {
        try {
            console.log(score);
            const response = await axios.post(
                'http://localhost:8626/users/me/request/practicalDrivingLicenseExam',
                {
                    score: score,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            console.log(response.data);
            if (response.status === 200) {
                toast.success('Exam re-requested successfully!');
                setTimeout(() => {
                    window.location.href = '/driving-license-public';
                }, 3000);
            } else {
                toast.error(response.data.message || 'Failed to re-request exam');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                'Failed to re-request exam';
            toast.error(errorMessage);
        }
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

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
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Online Exam</h1>
                {examCompleted ? (
                    <div className="bg-white p-6 rounded-lg shadow text-center">
                        <h2 className="text-2xl font-bold mb-4">Exam Completed!</h2>
                        <p className="text-xl mb-4">Your Score: {score}%</p>
                        <p className="text-lg">
                            {score >= 70
                                ? 'Congratulations! You passed. Visit the traffic unit for the practical exam.'
                                : 'You did not pass. Please try again after a month.'}
                        </p>
                    </div>
                ) : questions.length === 0 ? (
                    <div className="text-center py-10">Loading questions...</div>
                ) : (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold">Online Exam</h2>
                            <div className="text-xl font-semibold text-primary-600">
                                Time Left: {formatTime(timeLeft)}
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow">
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold mb-4">
                                    Question {currentQuestion + 1} of {questions.length}
                                </h3>
                                <p className="text-lg mb-4">{questions[currentQuestion]?.question}</p>
                                <div className="space-y-3">
                                    {questions[currentQuestion]?.options.map((option, index) => (
                                        <label key={index} className="flex items-center space-x-3">
                                            <input
                                                type="radio"
                                                name={`question-${questions[currentQuestion].id}`}
                                                value={option}
                                                checked={answers[questions[currentQuestion].id] === String.fromCharCode(65 + index)}
                                                onChange={() => handleAnswer(questions[currentQuestion].id, index)}
                                                className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                                            />
                                            <span className="text-gray-700">{option}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div className="flex justify-between">
                                <button
                                    onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                                    disabled={currentQuestion === 0}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50"
                                >
                                    Previous
                                </button>

                                {/* Add this "Next" button */}
                                <button
                                    onClick={() =>
                                        setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1))
                                    }
                                    disabled={currentQuestion === questions.length - 1}
                                    // disabled={isAnswered ? false : true}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                                >
                                    Next
                                </button>

                                <button
                                    onClick={submitExam}
                                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                                >
                                    Submit Exam
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {examReRequest && (
                    <div className="bg-white p-6 rounded-lg shadow text-center mt-6">
                        <h2 className="text-2xl font-bold mb-4">Exam Re-request</h2>
                        <p className="text-lg">
                            Click the button below to re-request the exam.
                            <br />
                            You can only re-request the exam after a month.
                        </p>
                        <div className='mt-4 gap-4'>
                            <button
                                onClick={handleReRequestExam}
                                className="mt-4 px-4 py-2 mx-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                                disabled={true}
                            >
                                Re-request Exam
                            </button>
                            <button
                                onClick={() => {
                                    window.location.href = '/driving-license-public';
                                }}
                                className="mt-4 px-4 py-2 mx-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                            >
                                Back to Home
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}