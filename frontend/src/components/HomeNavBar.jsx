import React, { useEffect, useState } from 'react';

import EgyptLogo from '../assets/EgyptLogo.png';
const HomeNavBar = () => {

    const [time, setTime] = useState(new Date().toLocaleTimeString());
    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date().toLocaleTimeString());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="bg-[#fffdf6] h-11 p-2 flex items-center justify-between">
                    <div className="m-0 p-2 flex items-center gap-5">
                        <img src={EgyptLogo} alt="Egypt Logo" className="h-8" />
                        <a href="/home"
                            className="text-gray-800 mr-10 hover:text-gray-900 hover:text-lg rounded-lg transition-all duration-900 ease-in-out">
                            Return Home
                        </a>
                    </div>
                    <p className="text-gray-800 m-1 p-2">{time}</p>
                </div>
            </nav>
        </div>
    );
}

export default HomeNavBar;