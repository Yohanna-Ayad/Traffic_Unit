import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios'
import { Plus, Trash2, Edit } from 'lucide-react';

export function ManageAdmins() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [increment, setIncrement] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:8626/admin/getAllAdmins',
      {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      }
    )
      .then(response => {
        setAdmins(response.data);
        console.log(response.data);
        setIncrement(false);
      })
      .catch(error => {
        console.error(error);
        toast.error(error.response.data.error,
          {
            duration: 4000,
            position: 'top-center',
          }
        );
      })
  }, [, increment]);


  const togglePopup = useCallback(() => {
    setShowPopup(prev => {
      const newState = !prev;
      if (!newState) {
        setFullName('');
        setEmail('');
        setPassword('');
      }
      return newState;
    });
  }, []);

  const handleAddAdmin = (e) => {
    e.preventDefault();
    const newAdmin = {
      // id: String(admins[admins.length-1].id + 1),
      name: fullName,
      email,
      password,
      role: 'Admin'
    };
    axios.post('http://localhost:8626/admin/createAdmin', newAdmin,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      }
    )
      .then(response => {
        toast.success(response.data.message,
          {
            duration: 4000,
            position: 'top-center',
          }
        );
        setIncrement(true);
      })
      .catch(error => {
        console.error(error);
        toast.error(error.response.data.error,
          {
            duration: 4000,
            position: 'top-center',
          }
        );
      })
    if (admins.some(admin => admin.email === email)) {
      toast.error('Admin with this email already exists', {
        duration: 4000,
        position: 'top-center',
      });
      return;
    }
    setAdmins([...admins, newAdmin]);
    togglePopup();
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:8626/admin/deleteAdmin/${id}`,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      }
    )
      .then(response => {
        toast.success(response.data.message,
          {
            duration: 4000,
            position: 'top-center',
          }
        );
      })
      .catch(error => {
        console.error(error);
        toast.error(error.response.data.error,
          {
            duration: 4000,
            position: 'top-center',
          }
        );
      })
    setAdmins(admins.filter(admin => admin.id !== id));
  };


  // ESC key handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && showPopup) {
        togglePopup();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showPopup, togglePopup]);

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Manage Admins</h1>
        <button
          className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          onClick={togglePopup}
        >
          <Plus className="w-5 h-5" />
          <span>Add Admin</span>
        </button>
      </div>

      {showPopup && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && togglePopup()}
        >
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl p-8 space-y-6">
            <div className="float-end">
              <button onClick={togglePopup}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-700 hover:text-gray-900"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div>
              <h1 className="text-4xl font-bold text-gray-900 text-center">ADD Admin</h1>
            </div>
            <form className="space-y-6" onSubmit={handleAddAdmin}>
              <div className="space-y-6">
                {/* Inputs stacked vertically */}
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <label className="block text-xl font-medium text-gray-700 text-left">Full Name</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="eg: Mohamed Ali Ahmed Mohamed"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xl font-medium text-gray-700 text-left">Email</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jane@framer.com"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xl font-medium text-gray-700 text-left">Password</label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="*********"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Buttons side-by-side below inputs */}
                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    type="button"
                    onClick={togglePopup}
                    className="px-8 py-3.5 rounded-xl font-semibold text-lg border border-gray-200 bg-white text-gray-600 hover:text-gray-800 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-10 py-3.5 rounded-xl font-semibold text-lg bg-gradient-to-br from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95 transform focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Add Admin
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )
      }

      <div className="bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {admins.map((admin) => (
              <tr key={admin.id}>
                <td className="px-6 py-4 whitespace-nowrap">{admin.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{admin.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{admin.role}</td>
                <td className="px-10 py-4 whitespace-nowrap text-right">
                  <button className="text-red-600 hover:text-red-900">
                    <Trash2 className="w-5 h-5" onClick={() => handleDelete(admin.id)} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div >
  );
} 