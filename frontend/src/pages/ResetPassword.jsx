import { useState, useEffect } from "react";
import HomeNavBar from "../components/HomeNavBar";
import axios from 'axios';
import toast from "react-hot-toast";

const ResetPassword = () => {
    const [resetCode, setResetCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [timeLeft, setTimeLeft] = useState(180);
    const [isTimerExpired, setIsTimerExpired] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setIsTimerExpired(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (timeLeft === 0) {
            setIsTimerExpired(true);
        }
    }, [timeLeft]);

    const handleResendCode = async () => {
        const email = localStorage.getItem('email');
        if (!email) {
            toast.error('No email found, please start the reset process again');
            return;
        }

        try {
            await axios.post('http://localhost:8626/users/forgot', { email });
            toast.success('New reset code sent to your email!', {
                duration: 4000,
                position: 'top-center'
            });
            setTimeLeft(180);
            setIsTimerExpired(false);
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to resend code', {
                duration: 4000,
                position: 'top-center'
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isTimerExpired) {
            toast.error('Reset code has expired, please request a new one');
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match!', { position: 'top-center' });
            return;
        }

        const email = localStorage.getItem('email');
        try {
            console.log(email, resetCode, newPassword);
            await axios.post('http://localhost:8626/users/reset', {
                email,
                code: resetCode,
                password: newPassword
            });
            toast.success('Password reset successfully!', { position: 'top-center' });
            localStorage.removeItem('email');
            window.location.href = '/login';
        } catch (error) {
            toast.error(error.response?.data?.error || 'Password reset failed', { position: 'top-center' });
        }
    };

    // Background styling (keep your existing code here)
    document.body.style.backgroundImage = "url('src/assets/tahrir.png')";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundAttachment = "fixed";
    document.body.style.backgroundPosition = "center";

    return (
        <>
            <HomeNavBar />
            <div className="max-w-md mx-auto bg-white/50 p-10 mt-32 rounded-3xl">
                <div className="flex justify-center mb-6">
                    <svg
                        className="animate-bounce w-12 h-12 text-primary-600"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                    >
                        <path fill="currentColor" d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5l8-5v10zm-8-7L4 6h16l-8 5z" />
                    </svg>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">
                    Reset Password
                </h1>
                <p className="text-center text-red-600 mb-4">
                    {isTimerExpired ? 'Code expired' :
                        `Time remaining: ${Math.floor(timeLeft / 60)}:${String(timeLeft % 60).padStart(2, '0')}`}
                </p>
                <form className="max-w-md mx-auto" onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                            Reset Code
                        </label>
                        <input
                            type="text"
                            name="code"
                            id="code"
                            placeholder="Enter reset code"
                            required
                            value={resetCode}
                            onChange={(e) => setResetCode(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            New Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            placeholder="Enter new password"
                            required
                            minLength={8}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            id="confirmPassword"
                            placeholder="Confirm new password"
                            required
                            minLength={8}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        disabled={isTimerExpired}
                    >
                        {isTimerExpired ? 'Code Expired' : 'Reset Password'}
                    </button>

                    {isTimerExpired && (
                        <button
                            type="button"
                            onClick={handleResendCode}
                            className="w-full mt-4 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            Send Code Again
                        </button>
                    )}
                </form>
            </div>
        </>
    );
};

export default ResetPassword;