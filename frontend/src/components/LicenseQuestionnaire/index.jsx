import React, { useState } from 'react';
import axios from 'axios';
import QuestionCard from './QuestionCard';
import ResultMessage from './ResultMessage';

const LicenseQuestionnaire = () => {
    const [hasDrivingLicense, setHasDrivingLicense] = useState(false);
    const [hasCarLicense, setHasCarLicense] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">License Information</h2>
                    <p className="text-gray-600">Please answer the following questions about your licenses</p>
                </div>

                <div className="space-y-6">
                    <QuestionCard
                        question="Do you have a driving license?"
                        isChecked={hasDrivingLicense}
                        onToggle={() => setHasDrivingLicense(!hasDrivingLicense)}
                    />

                    <QuestionCard
                        question="Do you have a car license?"
                        isChecked={hasCarLicense}
                        onToggle={() => setHasCarLicense(!hasCarLicense)}
                    />

                    <ResultMessage
                        hasDrivingLicense={hasDrivingLicense}
                        hasCarLicense={hasCarLicense}
                    />
                </div>
                <button
                    type="button"
                    className="w-[37%] mx-auto mt-6 flex text-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    onClick={() => {
                        var user = JSON.parse(localStorage.getItem('user'))
                        user = { ...user, "hasDrivingLicense": hasDrivingLicense, "hasCarLicense": hasCarLicense }
                        localStorage.setItem('user', JSON.stringify(user));
                        if (hasDrivingLicense && hasCarLicense || hasDrivingLicense && !hasCarLicense) {
                            window.location.href = "/driving-license-data"
                        }
                        else if (hasCarLicense && !hasDrivingLicense) {
                            window.location.href = "/car-license-data"
                        }
                        else {
                            try {
                                axios.post('http://localhost:8626/users', {
                                    user: JSON.parse(localStorage.getItem('user'))
                                }, {
                                    headers: {
                                        'Content-Type': 'application/json'
                                    }
                                })
                                    .then(response => {
                                        console.log(response.data)
                                        localStorage.removeItem("CarLicense");
                                        localStorage.removeItem("drivingLicense");
                                        localStorage.removeItem("user");
                                        localStorage.setItem("token", response.data.user.token)
                                        window.location.href = "/dashboard"

                                    })
                                    .catch(error => {
                                        console.error(error);
                                        toast.error('Failed to save car license information. Please try again later.',
                                            {
                                                duration: 4000,
                                                position: 'top-center',
                                                closeButton: true
                                            });
                                    });
                            } catch (error) {
                                console.error('Error:', error.response?.data.message || error.message);
                            }
                        }
                    }}
                >
                    Next
                </button>
            </div>
        </div >
    );
};

export default LicenseQuestionnaire;