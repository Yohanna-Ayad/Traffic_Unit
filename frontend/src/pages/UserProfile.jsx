// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import { toast } from 'react-hot-toast';
// import Layout from '../components/Layout';

// function UserProfile() {
//     const [user, setUser] = useState({});
//     const [userProfile, setUserProfile] = useState('');
//     const [loading, setLoading] = useState(true);
//     const [selectedFile, setSelectedFile] = useState(null);
//     const [previewUrl, setPreviewUrl] = useState('');
//     const [isUploading, setIsUploading] = useState(false);

//     useEffect(() => {
//         const fetchUserData = async () => {
//             try {
//                 const token = localStorage.getItem('token');
//                 if (!token) {
//                     toast.error('Please login to view profile');
//                     window.location.href = '/login';
//                     return;
//                 }

//                 const response = await axios.get('http://localhost:8626/users/me', {
//                     headers: { Authorization: `Bearer ${token}` }
//                 });

//                 setUser(response.data);
//             } catch (error) {
//                 console.error('Profile fetch error:', error);
//                 toast.error(error.response?.data?.message || 'Error fetching profile', {
//                     position: 'top-center',
//                     duration: 5000,
//                 });
//             } finally {
//                 setLoading(false);
//             }
//         };

//         const fetchUserProfile = async () => {
//             try {
//                 const response = await axios.get('http://localhost:8626/users/avatar', {
//                     headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//                 });
//                 setUserProfile(response.data);
//             } catch (error) {
//                 console.error('Profile fetch error:', error);
//                 toast.error(error.response?.data?.error || 'Error fetching profile', {
//                     position: 'top-center',
//                     duration: 5000,
//                 });
//             }
//         }

//         fetchUserData();
//         fetchUserProfile();
//     }, []);

//     const handleFileChange = (e) => {
//         const file = e.target.files[0];
//         if (!file) return;

//         if (!file.type.match(/image\/(jpeg|png|jpg)/)) {
//             toast.error('Please upload a JPG, JPEG, or PNG image');
//             return;
//         }

//         if (file.size > 2 * 1024 * 1024) {
//             toast.error('File size must be less than 2MB');
//             return;
//         }

//         setSelectedFile(file);
//         setPreviewUrl(URL.createObjectURL(file));
//     };

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setUser(prev => ({
//             ...prev,
//             [name]: value,
//         }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setIsUploading(true);

//         try {
//             const token = localStorage.getItem('token');
//             const formData = new FormData();

//             if (selectedFile) {
//                 formData.append('avatar', selectedFile);
//             }

//             formData.append('name', user.name);
//             formData.append('email', user.email);
//             formData.append('phone', user.phone);
//             formData.append('address', user.address);

//             const response = await axios.patch(
//                 'http://localhost:8626/users/me',
//                 formData,
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     }
//                 }
//             );

//             setUser(response.data);
//             setUserProfile(response.data.avatarUrl); // Update with the new avatar URL
//             localStorage.setItem('user', JSON.stringify(response.data));
//             setSelectedFile(null);

//             toast.success('Profile updated successfully!', {
//                 position: 'top-center',
//                 duration: 5000,
//             });
//         } catch (error) {
//             console.error('Update error:', error);
//             toast.error(error.response?.data?.message || 'Error updating profile', {
//                 position: 'top-center',
//                 duration: 5000,
//             });
//         } finally {
//             setIsUploading(false);
//         }
//     };

//     if (loading) return <div className="text-center p-8">Loading profile...</div>;

//     return (
//         <>
//             <Layout navigation={[
//                 { name: 'Dashboard', href: '/dashboard' },
//             ]} />

//             <div className="max-w-4xl mx-auto py-4 px-4">
//                 <h1 className="text-3xl font-bold text-gray-900">User Profile</h1>

//                 <div className="bg-white p-5 rounded-lg shadow">
//                     <div className="flex flex-col items-center space-y-4">
//                         <div className="relative">
//                             <img
//                                 src={previewUrl || userProfile || "https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_1280.png"}
//                                 alt="Profile"
//                                 className="w-32 h-32 rounded-full object-cover border-2 border-gray-300"
//                             />
//                             {isUploading && (
//                                 <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
//                                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
//                                 </div>
//                             )}
//                         </div>
//                         <h2 className="text-2xl font-semibold text-gray-900">{user.name}</h2>
//                     </div>

//                     <form onSubmit={handleSubmit} className="mt-8 space-y-6">
//                         <div>
//                             <label htmlFor="name" className="block text-sm font-medium text-gray-700">
//                                 Full Name
//                             </label>
//                             <input
//                                 type="text"
//                                 name="name"
//                                 id="name"
//                                 required
//                                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
//                                 value={user.name || ''}
//                                 onChange={handleChange}
//                             />
//                         </div>

//                         <div>
//                             <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//                                 Email Address
//                             </label>
//                             <input
//                                 type="email"
//                                 name="email"
//                                 id="email"
//                                 required
//                                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
//                                 value={user.email || ''}
//                                 onChange={handleChange}
//                             />
//                         </div>

//                         <div>
//                             <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
//                                 Phone Number
//                             </label>
//                             <input
//                                 type="tel"
//                                 name="phone"
//                                 id="phone"
//                                 required
//                                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
//                                 value={user.phone || ''}
//                                 onChange={handleChange}
//                             />
//                         </div>

//                         <div>
//                             <label htmlFor="address" className="block text-sm font-medium text-gray-700">
//                                 Address
//                             </label>
//                             <input
//                                 type="text"
//                                 name="address"
//                                 id="address"
//                                 required
//                                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
//                                 value={user.address || ''}
//                                 onChange={handleChange}
//                             />
//                         </div>

//                         <div className="mt-4">
//                             <label className="block text-sm font-medium text-gray-700 mb-2">
//                                 Profile Picture
//                             </label>
//                             <div className="flex items-center gap-4">
//                                 <input
//                                     type="file"
//                                     accept="image/jpeg, image/png, image/jpg"
//                                     onChange={handleFileChange}
//                                     className="hidden"
//                                     id="profileUpload"
//                                     disabled={isUploading}
//                                 />
//                                 <label
//                                     htmlFor="profileUpload"
//                                     className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 cursor-pointer text-sm font-medium disabled:bg-gray-400"
//                                 >
//                                     {selectedFile ? 'Change Image' : 'Upload Image'}
//                                 </label>
//                                 <p className="text-xs text-gray-500">
//                                     JPG, JPEG, or PNG (Max 2MB)
//                                 </p>
//                             </div>
//                         </div>

//                         <button
//                             type="submit"
//                             className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
//                             disabled={isUploading}
//                         >
//                             {isUploading ? 'Updating...' : 'Update Profile'}
//                         </button>
//                     </form>
//                 </div>
//             </div>
//         </>
//     );
// }

// export default UserProfile;




import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Layout from '../components/Layout';

function UserProfile() {
    const [user, setUser] = useState({});
    const [userChange, setUserChange] = useState(false)
    const [userProfile, setUserProfile] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    toast.error('Please login to view profile');
                    window.location.href = '/login';
                    return;
                }

                const response = await axios.get('http://localhost:8626/users/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setUser(response.data);
            } catch (error) {
                console.error('Profile fetch error:', error);
                toast.error(error.response?.data?.message || 'Error fetching profile', {
                    position: 'top-center',
                    duration: 5000,
                });
            } finally {
                setLoading(false);
            }
        };

        const fetchUserProfile = async () => {
            try {
                const response = await axios.get('http://localhost:8626/users/avatar', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                if (response) {
                    setUserProfile(response.data);
                }
            } catch (error) {
                // console.error('Profile fetch error:', error);
                // toast.error(error.response?.data?.message || 'Error fetching profile', {
                //     position: 'top-center',
                //     duration: 5000,
                // });
            } finally {
                setLoading(false);
            }
        }

        fetchUserData();
        fetchUserProfile();
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.match(/image\/(jpeg|png|jpg)/)) {
            toast.error('Please upload a JPG, JPEG, or PNG image');
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            toast.error('File size must be less than 2MB');
            return;
        }

        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prev => ({
            ...prev,
            [name]: value,
        }));
        setUserChange(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsUploading(true);

        try {
            const token = localStorage.getItem('token');

            // Update avatar separately if file is selected
            if (selectedFile) {
                const avatarFormData = new FormData();
                avatarFormData.append('avatar', selectedFile);

                if (userProfile === "" || userProfile === null) {
                    await axios.post('http://localhost:8626/users/me/avatar', avatarFormData, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data',
                        }
                    });
                }
                else {
                    await axios.patch('http://localhost:8626/users/me/avatar', avatarFormData, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data',
                        }
                    });
                }
            }

            // Update user data if changed
            console.log(userChange)
            if (userChange) {
                console.log(user)
                const userResponse = await axios.patch(
                    'http://localhost:8626/users/me',
                    {
                        name: user.name,
                        phone: user.phone,
                        address: user.address
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                // Update state with new data
                setUser(userResponse.data.user);
                console.log(userResponse.data)
                // localStorage.setItem('user', JSON.stringify(userResponse.data));
            }


            // Refresh avatar after update
            if (selectedFile) {
                const avatarResponse = await axios.get('http://localhost:8626/users/avatar', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUserProfile(avatarResponse.data);
            }

            setSelectedFile(null);
            toast.success('Profile updated successfully!', {
                position: 'top-center',
                duration: 5000,
            });
        } catch (error) {
            console.error('Update error:', error);
            toast.error(error.response?.data?.message || 'Error updating profile', {
                position: 'top-center',
                duration: 5000,
            });
        } finally {
            setIsUploading(false);
        }
    };

    if (loading) return <div className="text-center p-8">Loading profile...</div>;

    return (
        <>
            <Layout navigation={[
                { name: 'Dashboard', href: '/dashboard' },
            ]} />

            <div className="max-w-4xl mx-auto py-4 px-4">
                <h1 className="text-3xl font-bold text-gray-900">User Profile</h1>

                <div className="bg-white p-5 rounded-lg shadow">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="relative">
                            <img
                                src={previewUrl || userProfile || "https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_1280.png"}
                                alt="Profile"
                                className="w-32 h-32 rounded-full object-cover border-2 border-gray-300"
                            />
                            {isUploading && (
                                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                                </div>
                            )}
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-900">{user.name}</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                value={user.name || ''}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                required
                                disabled
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                value={user.email || ''}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                id="phone"
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                value={user.phone || ''}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                Address
                            </label>
                            <input
                                type="text"
                                name="address"
                                id="address"
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                value={user.address || ''}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Profile Picture
                            </label>
                            <div className="flex items-center gap-4">
                                <input
                                    type="file"
                                    accept="image/jpeg, image/png, image/jpg"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="profileUpload"
                                    disabled={isUploading}
                                />
                                <label
                                    htmlFor="profileUpload"
                                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 cursor-pointer text-sm font-medium disabled:bg-gray-400"
                                >
                                    {selectedFile ? 'Change Image' : 'Upload Image'}
                                </label>
                                <p className="text-xs text-gray-500">
                                    JPG, JPEG, or PNG (Max 2MB)
                                </p>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            disabled={isUploading}
                        >
                            {isUploading ? 'Updating...' : 'Update Profile'}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default UserProfile;