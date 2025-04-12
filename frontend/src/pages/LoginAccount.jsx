import { useState, useEffect } from "react";
import HomeNavBar from "../components/HomeNavBar";
import axios from 'axios';
import toast from "react-hot-toast";

const LoginAccount = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:8626/users/login', {
                email: email,
                password: password
            });
            localStorage.setItem('token', response.data.user.token);
            if (response.data.user.user.role === 'admin') {
                window.location.href = './admin/manage-admins';
            } else {
                window.location.href = './dashboard';
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response.data.error,
                {
                    duration: 4000,
                    position: 'top-center',
                    // style: {
                    //     borderRadius: '10px',
                    //     background: '#333',
                    //     color: '#fff',
                    // },
                }
            );
        }
    }


    document.getElementsByTagName('body')[0].style.backgroundImage = "url('src/assets/tahrir.png')";
    document.getElementsByTagName('body')[0].style.backgroundSize = "cover";
    document.getElementsByTagName('body')[0].style.backgroundRepeat = "no-repeat";
    document.getElementsByTagName('body')[0].style.backgroundAttachment = "fixed";
    document.getElementsByTagName('body')[0].style.backgroundPosition = "center";

    return (
        <>
            <HomeNavBar />
            <div className="max-w-md mx-auto bg-white/50 p-10 mt-32 rounded-3xl">
                <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Login</h1>
                <form className="max-w-md mx-auto" onSubmit={
                    (e) => {
                        e.preventDefault();
                        console.log('Email:', email);
                    }
                }>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            placeholder="eg: joeDoe@Gmail.com"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            placeholder="eg: ********"
                            required
                            value={password}
                            minLength={8}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        onClick={handleLogin}
                    >
                        Login
                    </button>
                </form>
                <div className="text-center mt-4 grid">
                    <a href="/forgot-password" className="text-center mt-4 text-primary-600 hover:text-primary-700 hover:underline font-bold">Forgot your password?</a>
                    <a href="/signup" className="text-center mt-4 text-primary-600 hover:text-primary-700 hover:underline font-bold">Don't have an account? Register</a>
                </div>
            </div>
        </>
    );
}
export default LoginAccount;
