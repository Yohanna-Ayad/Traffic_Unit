import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import Layout from '../../components/Layout';
import { Upload, Loader2 } from 'lucide-react';

export default function LicenseInstructionsPage() {
    const [button, setButton] = useState("Active");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("");
    const [paymentReceipt, setPaymentReceipt] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [paymentAmount] = useState(100); // Fixed amount for driving license course

    useEffect(() => {
        const fetchPendingRequest = async () => {
            try {
                setLoading(true);
                const res = await axios.get('http://localhost:8626/users/me/request/drivingLicense', {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (res.data.request === false) {
                    setButton("Inactive");
                } else {
                    setButton("Active");
                }
            } catch (error) {
                setError(error.message);
                toast.error(error.response?.data?.message || 'Failed to fetch request status. Please try again later.');
            }
            finally {
                setLoading(false);
            }
        };
        fetchPendingRequest();
    }, []);

    const handleRequestCourse = () => {
        // Open payment modal first
        setIsPaymentOpen(true);
    };

    const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    // Add this before the try-catch in handlePaymentSubmit
    if (!paymentReceipt) {
        toast.error('Please upload a payment receipt');
        setIsSubmitting(false);
        return;
    }
    setIsSubmitting(true);

    try {
        const formData = new FormData();
        formData.append('payment', paymentReceipt);  // Changed from 'paymentReceipt' to 'payment'
        formData.append('userId', localStorage.getItem('userId'));
        
        // Note: Removed amount and paymentMethod as they're not used in backend
        console.log([...formData.entries()]); // Better way to log FormData

        const response = await axios.post(
            'http://localhost:8626/users/me/request/drivingLicense',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            }
        );

        if (response.status === 200) {
            toast.success('Course request and payment submitted successfully!');
            setButton("Inactive");
            setIsPaymentOpen(false);
            setPaymentMethod("");
            setPaymentReceipt(null);
        }
    } catch (error) {
        toast.error(error.response?.data?.message || error.response?.data?.error || 'Failed to complete the process. Please try again.');
    } finally {
        setIsSubmitting(false);
    }
};

    return (
        <>
        {loading ? (
                <div className="flex justify-center items-center min-h-screen bg-gray-50">
                    {error ? (
                        <div className="text-red-500 text-center">
                            <p>{error}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="mt-4 px-4 py-2 bg-red-100 rounded-md"
                            >
                                Retry
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
                            <span className="ml-4 text-lg font-medium text-gray-700">Loading data...</span>
                        </>
                    )}
                </div>
            ) : (
                <>
            <Layout
                navigation={[
                    { name: 'Dashboard', href: '/dashboard' },
                    { name: 'Driving License', href: '/driving-license-public' },
                    { name: 'Car License', href: '/car-license' },
                    { name: 'Violations', href: '/violations' },
                    { name: 'License Request', href: '/license-request' },
                ]}
            />
            <div className="max-w-2xl mx-auto py-5 px-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">How to Extract a Driving License</h1>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Instructions</h2>
                    <ul className="list-disc list-inside space-y-2">
                        <li>Complete the theoretical driving course.</li>
                        <li>Pass the online exam with a score of at least 70%.</li>
                        <li>Visit the traffic unit to complete the practical driving exam.</li>
                        <li>Submit the required documents and pay the fees.</li>
                    </ul>
                    <button
                        onClick={handleRequestCourse}
                        className="mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        disabled={button === "Inactive"}
                        style={button === "Inactive" ? { backgroundColor: 'gray', cursor: 'not-allowed' } : {}}
                        title={button === "Inactive" ? "You have already requested a course." : ""}
                        aria-disabled={button === "Inactive" ? true : false}
                    >
                        Request Driving License Course
                    </button>
                </div>
            </div>

            {/* Payment Modal */}
            {isPaymentOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                        <div className="p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Details</h2>
                            <p className="text-sm text-gray-600 mb-4">
                                Please complete payment to request your driving license course.
                            </p>

                            <form onSubmit={handlePaymentSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Total Amount: {paymentAmount} L.E
                                    </label>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Payment Method
                                    </label>
                                    <select
                                        value={paymentMethod}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="">Select Payment Method</option>
                                        <option value="instapay">Instapay</option>
                                        <option value="fawry">Fawry</option>
                                    </select>
                                </div>

                                {paymentMethod && (
                                    <div className="bg-blue-50 p-4 rounded-lg">
                                        <p className="text-sm text-blue-800">
                                            {paymentMethod === 'instapay' ? (
                                                <>Transfer to Bank Account: 1234 5678 9012 3456</>
                                            ) : (
                                                <>Use Fawry Code: 987654 at any Fawry outlet</>
                                            )}
                                        </p>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Upload Payment Receipt
                                    </label>
                                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500">
                                        <input
                                            type="file"
                                            accept="image/*,application/pdf"
                                            onChange={(e) => setPaymentReceipt(e.target.files[0])}
                                            className="hidden"
                                            required
                                        />
                                        {paymentReceipt ? (
                                            <span className="text-sm text-gray-600">{paymentReceipt.name}</span>
                                        ) : (
                                            <div className="flex flex-col items-center">
                                                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                                                <span className="text-sm text-gray-600">Click to upload receipt</span>
                                            </div>
                                        )}
                                    </label>
                                </div>

                                <div className="flex justify-end space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsPaymentOpen(false);
                                            setPaymentMethod("");
                                            setPaymentReceipt(null);
                                        }}
                                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        {isSubmitting ? (
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                        ) : (
                                            'Submit Payment & Request'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
            )}
            </>
    );
}
// import { useEffect, useState } from 'react';
// import { toast } from 'react-hot-toast';
// import axios from 'axios';
// import Layout from '../../components/Layout';

// export default function LicenseInstructionsPage() {
//     const [button, setButton] = useState("Active");

//     useEffect(() => {
//         const fetchPendingRequest = async () => {
//             try {
//                 const res = await axios.get('http://localhost:8626/users/me/request/drivingLicense', {
//                     headers: {
//                         'Content-Type': 'application/json',
//                         Authorization: `Bearer ${localStorage.getItem('token')}`
//                     }
//                 });
//                 if (res.data.request === false) {
//                     setButton("Inactive");
//                 } else {
//                     setButton("Active");
//                 }
//             } catch (error) {
//                 toast.error(error.response?.data?.message || 'Failed to fetch request status. Please try again later.');
//             }
//         };
//         fetchPendingRequest();
//     }, []);



//     const handleRequestCourse = async () => {
//         try {
//             const res = await axios.post('http://localhost:8626/users/me/request/drivingLicense', {
//                 userId: localStorage.getItem('userId'),
//             }, {
//                 headers: {
//                     'Content-Type': 'application/json',
//                     Authorization: `Bearer ${localStorage.getItem('token')}`
//                 }
//             });
//             console.log(res.data);
//             if (res.status === 200) {
//                 toast.success(res.data.message);
//                 setButton("Inactive");
//             }
//         } catch (error) {
//             toast.error(error.response?.data?.message || 'Failed to request course. Please try again later.');
//         }
//     }

//     return (
//         <>
//             <Layout
//                 navigation={[
//                     { name: 'Dashboard', href: '/dashboard' },
//                     { name: 'Driving License', href: '/driving-license-public' },
//                     { name: 'Car License', href: '/car-license' },
//                     { name: 'Violations', href: '/violations' },
//                     { name: 'License Request', href: '/license-request' },
//                 ]}
//             />
//             <div className="max-w-2xl mx-auto py-5 px-4">
//                 <h1 className="text-3xl font-bold text-gray-900 mb-8">How to Extract a Driving License</h1>
//                 <div className="bg-white p-6 rounded-lg shadow">
//                     <h2 className="text-xl font-semibold mb-4">Instructions</h2>
//                     <ul className="list-disc list-inside space-y-2">
//                         <li>Complete the theoretical driving course.</li>
//                         <li>Pass the online exam with a score of at least 70%.</li>
//                         <li>Visit the traffic unit to complete the practical driving exam.</li>
//                         <li>Submit the required documents and pay the fees.</li>
//                     </ul>
//                     <button
//                         onClick={handleRequestCourse}
//                         className="mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
//                         disabled={button === "Inactive"}
//                         style={button === "Inactive" ? { backgroundColor: 'gray', cursor: 'not-allowed' } : {}}
//                         title={button === "Inactive" ? "You have already requested a course." : ""}
//                         aria-disabled={button === "Inactive" ? true : false}
//                     >
//                         Request Driving License Course
//                     </button>
//                 </div>
//             </div>
            
//         </>
//     );
// }