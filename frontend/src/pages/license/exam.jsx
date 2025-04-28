import { useEffect, useState, useRef } from 'react';
import { toast } from 'react-hot-toast';
import Layout from '../../components/Layout';

export default function OnlineExamPage() {
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 mins
    const [examCompleted, setExamCompleted] = useState(false);
    const [score, setScore] = useState(null);
    const timerRef = useRef(null);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const res = await fetch('/api/license/exam-questions');
                const data = await res.json();
                setQuestions(data.questions);
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

        return () => clearInterval(timerRef.current);
    }, [questions]);

    const handleAnswer = (questionId, answer) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: answer
        }));
    };

    const submitExam = async () => {
        try {
            const res = await fetch('/api/license/submit-exam', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ answers })
            });
            const data = await res.json();
            setScore(data.score);
            setExamCompleted(true);
            toast.success(`Your score: ${data.score}%`);
        } catch (error) {
            toast.error('Failed to submit exam');
        }
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

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
                                                checked={answers[questions[currentQuestion].id] === option}
                                                onChange={() =>
                                                    handleAnswer(questions[currentQuestion].id, option)
                                                }
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
            </div>
        </Layout>
    );
}