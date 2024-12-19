import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import Layout from '../components/Layout'

const drivingLicense = JSON.parse(localStorage.getItem('user')).hasDrivingLicense

const mockQuestions = [
  {
    id: 1,
    question: 'What does a red traffic light mean?',
    options: ['Stop', 'Go', 'Slow down', 'Turn right'],
    correctAnswer: 'Stop'
  },
  {
    id: 2,
    question: 'What is the speed limit in residential areas?',
    options: ['30 km/h', '50 km/h', '70 km/h', '100 km/h'],
    correctAnswer: '50 km/h'
  },
  // Add more questions as needed
]

function OnlineExam() {
  const [isExamStarted, setIsExamStarted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(30 * 60) // 30 minutes in seconds
  const [examCompleted, setExamCompleted] = useState(false)

  useEffect(() => {
    if (isExamStarted && !examCompleted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            submitExam()
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [isExamStarted, examCompleted, timeLeft])

  const startExam = () => {
    setIsExamStarted(true)
    toast.success('Exam started! Good luck!')
  }

  const handleAnswer = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const submitExam = () => {
    setExamCompleted(true)
    const score = calculateScore()
    toast.success(`Exam completed! Your score: ${score}`)
  }

  const calculateScore = () => {
    let correct = 0
    mockQuestions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) correct++
    })
    return Math.round((correct / mockQuestions.length) * 100)
  }

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  if (!isExamStarted) {
    return (
      <>
        <Layout navigation={[
          { name: 'Dashboard', href: '/dashboard' },
          drivingLicense ? null : { name: 'Driving License', href: '/driving-license' },
          { name: 'Car License', href: '/car-license' },
          { name: 'Violations', href: '/violations' },
          drivingLicense ? null : { name: 'Online Exam', href: '/online-exam' },
          { name: 'Digital Sticker', href: '/digital-sticker' },
        ]} />
        <div className="max-w-2xl mx-auto text-center py-5">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Online Driving License Exam</h1>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Exam Instructions</h2>
            <ul className="text-left list-disc list-inside mb-6">
              <li>You will have 30 minutes to complete the exam</li>
              <li>The exam consists of multiple-choice questions</li>
              <li>You must score at least 70% to pass</li>
              <li>You cannot pause or restart the exam once started</li>
            </ul>
            <button
              onClick={startExam}
              className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700"
            >
              Start Exam
            </button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Layout navigation={[
        { name: 'Dashboard', href: '/dashboard' },
        drivingLicense ? null : { name: 'Driving License', href: '/driving-license' },
        { name: 'Car License', href: '/car-license' },
        { name: 'Violations', href: '/violations' },
        drivingLicense ? null : { name: 'Online Exam', href: '/online-exam' },
        { name: 'Digital Sticker', href: '/digital-sticker' },
      ]} />
      <div className="max-w-2xl mx-auto py-5">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Online Exam</h1>
          <div className="text-xl font-semibold text-primary-600">
            Time Left: {formatTime(timeLeft)}
          </div>
        </div>

        {!examCompleted ? (
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">
                Question {currentQuestion + 1} of {mockQuestions.length}
              </h2>
              <p className="text-lg mb-4">{mockQuestions[currentQuestion].question}</p>
              <div className="space-y-3">
                {mockQuestions[currentQuestion].options.map((option, index) => (
                  <label key={index} className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name={`question-${mockQuestions[currentQuestion].id}`}
                      value={option}
                      checked={answers[mockQuestions[currentQuestion].id] === option}
                      onChange={() => handleAnswer(mockQuestions[currentQuestion].id, option)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                disabled={currentQuestion === 0}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50"
              >
                Previous
              </button>
              {currentQuestion === mockQuestions.length - 1 ? (
                <button
                  onClick={submitExam}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                >
                  Submit Exam
                </button>
              ) : (
                <button
                  onClick={() => setCurrentQuestion(prev => Math.min(mockQuestions.length - 1, prev + 1))}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <h2 className="text-2xl font-bold mb-4">Exam Completed!</h2>
            <p className="text-xl mb-4">Your Score: {calculateScore()}%</p>
            <p className="text-lg">
              {calculateScore() >= 70 ?
                'Congratulations! You passed the exam.' :
                'Unfortunately, you did not pass. Please try again later.'}
            </p>
          </div>
        )}
      </div>
    </>
  )
}

export default OnlineExam