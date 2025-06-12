import React, { useState, useEffect } from 'react';
import { FaRobot, FaTimes } from 'react-icons/fa';

const TrafficUnitChatbot = () => {
    // Check if user is logged in (has token)
    const isLoggedIn = localStorage.getItem('token') !== null;

    // Only show if not logged in
    const [isOpen, setIsOpen] = useState(false); // Start as circle (closed)
    const [messages, setMessages] = useState([
        {
            text: "Welcome to the Traffic Unit System! Please log in to access all features. How can I help you?",
            sender: "bot"
        }
    ]);

    // If user is logged in, don't render the chatbot at all
    if (isLoggedIn) {
        return null;
    }

    const quickQuestions = [
        "Request new driving license",
        "Request new car license",
        "Get Driving license course",
        "How to register an account",
        "About the Traffic Unit System"
    ];

    const botResponses = {
        "request new driving license": "Please log in to request a new driving license. You'll need to:\n1. Register an account\n2. Provide personal details\n3. Complete the application process",
        "request new car license": "Car license applications require an account. Please register first to access this service.",
        "get driving license course": "The driving license course includes:\n1. Theoretical training\n2. Practical lessons\n3. Exam preparation\n\nRegister to access all course materials.",
        "how to register an account": "To register:\n1. Click 'Sign Up' on our website\n2. Provide your personal details\n3. Verify your email\n4. Log in to access services\n\nRegistration is free and takes 2 minutes.",
        "about the traffic unit system": "The Traffic Unit System:\n\n- Digital license management\n- Online exams\n- Application tracking\n- Digital licenses\n\nRegister now to get started!"
    };

    const handleQuickQuestion = (question) => {
        const newMessages = [...messages, { text: question, sender: "user" }];
        setMessages(newMessages);

        const botResponse = botResponses[question.toLowerCase()] ||
            "I'm sorry, I don't have information about that yet.";

        setTimeout(() => {
            setMessages(prev => [...prev, { text: botResponse, sender: "bot" }]);
        }, 500);
    };

    return (
        <div className="fixed bottom-8 right-8 z-[1000]">
            {/* Chatbot Button - Always visible as circle when closed */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg hover:bg-blue-700 transition-all duration-300 animate-bounce"
                    aria-label="Open chatbot"
                >
                    <FaRobot className="text-2xl" />
                </button>
            )}

            {/* Chatbot Popup - Shows when clicked */}
            {isOpen && (
                <div className="animate-fade-in">
                    <div className="w-80 h-[500px] bg-white rounded-lg shadow-xl flex flex-col border border-gray-200 overflow-hidden transform transition-all">
                        {/* Header */}
                        <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
                            <h3 className="text-lg font-medium">Traffic Unit Assistant</h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-white hover:text-gray-200 transition-colors"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`mb-4 py-3 px-4 rounded-2xl max-w-[80%] leading-snug ${msg.sender === 'user'
                                        ? 'bg-blue-600 text-white ml-auto rounded-br-none'
                                        : 'bg-gray-200 text-gray-800 mr-auto rounded-bl-none'
                                        }`}
                                >
                                    {msg.text.split('\n').map((line, i) => (
                                        <p key={i}>{line}</p>
                                    ))}
                                </div>
                            ))}
                        </div>

                        {/* Quick Replies */}
                        <div className="p-3 bg-gray-100 border-t border-gray-300">
                            <p className="text-sm text-gray-600 mb-2">Select a question:</p>
                            <div className="flex flex-wrap gap-2">
                                {quickQuestions.map((question, index) => (
                                    <button
                                        key={index}
                                        className="bg-white text-xs border border-gray-300 rounded-full px-3 py-1 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all"
                                        onClick={() => handleQuickQuestion(question)}
                                    >
                                        {question}
                                    </button>
                                ))}
                            </div>
                            <p className="text-xs text-gray-500 mt-3">
                                Register or log in for full access to all features.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TrafficUnitChatbot;