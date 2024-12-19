import { useState, useEffect } from "react";
import HomeNavBar from "../components/HomeNavBar";
const Signup = () => {
    const [name, setName] = useState('');
    const [nationalId, setNationalId] = useState('');
    const [gender, setGender] = useState('');
    const [nationality, setNationality] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [government, setGovernment] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    useEffect(() => {
        console.log('Name:', name);
        console.log('Email:', email);
        console.log('Password:', password);
    }
        , [email, password]);
    document.getElementsByTagName('body')[0].style.backgroundImage = "url('src/assets/tahrir.png')";
    document.getElementsByTagName('body')[0].style.backgroundSize = "cover";
    document.getElementsByTagName('body')[0].style.backgroundRepeat = "no-repeat";
    document.getElementsByTagName('body')[0].style.backgroundAttachment = "fixed";
    document.getElementsByTagName('body')[0].style.backgroundPosition = "center";

    return (
        <>
            <HomeNavBar />
            <div className="max-w-xl mx-auto bg-white/50 p-10 mt-8 rounded-3xl">
                <h1 className="text-3xl font-bold text-gray-900 mb-7 text-center">Sign up</h1>
                <form className="max-w-xl mx-auto" onSubmit={
                    (e) => {
                        e.preventDefault();
                        if (!name) {
                            alert('Please enter your name');
                        } else if (!email) {
                            alert('Please enter your email');
                        } else if (!password) {
                            alert('Please enter your password');
                        }
                        else if (!confirmPassword) {
                            alert('Please confirm your password');
                        }
                        else if (!nationalId) {
                            alert('Please enter your national ID');
                        }
                        else if (!nationality) {
                            alert('Please enter your nationality');
                        }
                        else if (!phone) {
                            alert('Please enter your phone number');
                        }
                        else if (!address) {
                            alert('Please enter your address');
                        }
                        else if (!government) {
                            alert('Please enter your government');
                        } else if (!email.includes('@') || !email.includes('.com')) {
                            alert('Please enter a valid email');
                        }
                        else if (password.length < 8) {
                            alert('Password must be at least 8 characters');
                        }
                        else if (nationalId.length < 14) {
                            alert('National ID must be 14 characters');
                        }
                        else if (phone.length < 11) {
                            alert('Phone number must be 11 characters');
                        } else
                            if (password === confirmPassword) {
                                console.log('Name:', name);
                                console.log('Email:', email);
                                console.log('Password:', password);
                                console.log('National ID:', nationalId);
                                console.log('Nationality:', nationality);
                                console.log('Phone:', phone);
                                console.log('Address:', address);
                                console.log('Government:', government);
                                localStorage.setItem('user', JSON.stringify({ 
                                    "name": name, 
                                    "email": email, 
                                    "password": password, 
                                    "nationalId": nationalId,
                                    "nationality": nationality,
                                    "phone": phone,
                                    "address": address,
                                    "government": government
                                 }));
                                 console.log('User:', localStorage.getItem('user'));
                                window.location.href = "/licenseQuestionnaire";
                            }
                        
                        // Still need to implement the signup functionality
                        // console.log('Email:', email);
                    }
                }>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                placeholder="eg: Mohamed Ali Ahmed Mohamed"
                                required
                                value={name}
                                onChange={(e) => {
                                    if (e.target.value.split(' ').length <= 4) {
                                        setName(e.target.value)
                                    }
                                }}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="nationalID" className="block text-sm font-medium text-gray-700">National ID/Passport number</label>
                            <input
                                type="number"
                                name="nationalID"
                                id="nationalID"
                                placeholder="3011xxxxxxxx15"
                                required
                                value={nationalId}
                                maxLength={14}
                                minLength={14}
                                onChange={(e) => {
                                    if (e.target.value.length <= 14) {
                                        setNationalId(e.target.value)
                                    }
                                }}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="nationality" className="block text-sm font-medium text-gray-700">Nationality</label>
                            <input
                                type="text"
                                name="nationality"
                                id="nationality"
                                placeholder="eg: Egyptian"
                                required
                                value={nationality}
                                onChange={(e) => setNationality(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
                            <select name="gender"
                                id="gender"
                                value={gender}
                                required
                                onChange={(e) => setGender(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500">
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                            <input
                                type="number"
                                name="phone"
                                id="phone"
                                placeholder="eg: 010xxxxxxxx"
                                required
                                value={phone}
                                maxLength={11}
                                minLength={11}
                                onChange={(e) => {
                                    if (e.target.value.length <= 11) {
                                        setPhone(e.target.value)
                                    }
                                }
                                }
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500" />
                        </div>
                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                            <input
                                type="text"
                                name="address"
                                id="address"
                                placeholder="eg: 123 Tahrir Street, Cairo"
                                required
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="government" className="block text-sm font-medium text-gray-700">Governorate</label>
                            <select
                                name="government"
                                id="government"
                                value={government}
                                required
                                onChange={(e) => setGovernment(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                            >
                                <option value="">Select Governorate</option>
                                <option value="Alexandria">Alexandria</option>
                                <option value="Aswan">Aswan</option>
                                <option value="Assiut">Assiut</option>
                                <option value="Beheira">Beheira</option>
                                <option value="Beni Suef">Beni Suef</option>
                                <option value="Cairo">Cairo</option>
                                <option value="Dakahlia">Dakahlia</option>
                                <option value="Damietta">Damietta</option>
                                <option value="Fayoum">Fayoum</option>
                                <option value="Gharbia">Gharbia</option>
                                <option value="Giza">Giza</option>
                                <option value="Ismailia">Ismailia</option>
                                <option value="Kafr el-Sheikh">Kafr el-Sheikh</option>
                                <option value="Matrouh">Matrouh</option>
                                <option value="Minya">Minya</option>
                                <option value="Menofia">Menofia</option>
                                <option value="New Valley">New Valley</option>
                                <option value="North Sinai">North Sinai</option>
                                <option value="Port Said">Port Said</option>
                                <option value="Qualyubia">Qualyubia</option>
                                <option value="Qena">Qena</option>
                                <option value="Red Sea">Red Sea</option>
                                <option value="Al-Sharqia">Al-Sharqia</option>
                                <option value="Soha">Soha</option>
                                <option value="South Sinai">South Sinai</option>
                                <option value="Suez">Suez</option>
                                <option value="Luxor">Luxor</option>
                            </select>
                        </div>
                        <div>
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
                        <div>
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
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                id="confirmPassword"
                                placeholder="eg: ********"
                                required
                                value={confirmPassword}
                                minLength={8}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-[37%] mx-auto flex text-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                        Signup
                    </button>
                </form>
            </div>
        </>
    );
}
export default Signup;
