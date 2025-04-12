// ForgotPassword.jsx
import { useState } from "react";
import HomeNavBar from "../components/HomeNavBar";
import axios from 'axios';
import toast from "react-hot-toast";

const ForgotPassword = () => {
    const [email, setEmail] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8626/users/forgot', { email });
            toast.success('Reset code sent to your email!', {
                duration: 4000,
                position: 'top-center'
            });
            localStorage.setItem('email', email)
            window.location.href = '/reset-password';
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to send reset code', {
                duration: 4000,
                position: 'top-center'
            });
        }
    };

    document.body.style.backgroundImage = "url('src/assets/tahrir.png')";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundAttachment = "fixed";
    document.body.style.backgroundPosition = "center";

    return (
        <>
            <HomeNavBar />
            <div className="max-w-md mx-auto bg-white/50 p-10 mt-32 rounded-3xl">
                <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Forgot Password</h1>
                <form className="max-w-md mx-auto" onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            placeholder="Enter your registered email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                        Send Reset Code
                    </button>
                </form>
            </div>
        </>
    );
};

export default ForgotPassword;