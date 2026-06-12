import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserIcon, LockClosedIcon, AcademicCapIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const StudentLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();
    
    try {
      console.log('Attempting login with:', trimmedUsername);
      
      const response = await fetch('http://localhost:8000/api/auth/student/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          username: trimmedUsername, 
          password: trimmedPassword 
        })
      });
      
      const data = await response.json();
      console.log('Login response:', data);
      
      if (response.ok && data.access_token) {
        localStorage.setItem('student_token', data.access_token);
        localStorage.setItem('student_info', JSON.stringify(data.student));
        toast.success(`Welcome ${data.student.name}!`);
        navigate('/student/dashboard');
      } else {
        const errorMsg = data.detail || 'Invalid Student ID or Password';
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Cannot connect to server. Make sure backend is running on port 8000');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
            <AcademicCapIcon className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">Student Portal</h2>
          <p className="text-blue-100 text-sm mt-1">Access your study materials & track progress</p>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Student ID / Roll Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your Student ID"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockClosedIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <span className="text-gray-400 text-sm">
                  {showPassword ? '🙈' : '👁️'}
                </span>
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1">Default password: <strong>student123</strong></p>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login to Portal'}
          </button>
        </form>
        
        {/* Demo Credentials */}
        <div className="bg-gray-50 px-6 py-4 border-t">
          <div className="text-center">
            <p className="text-sm text-gray-600 font-semibold mb-2">📌 Demo Credentials</p>
            <p className="text-sm text-gray-500">Username: <strong>demo</strong></p>
            <p className="text-sm text-gray-500">Password: <strong>student123</strong></p>
            <p className="text-xs text-gray-400 mt-2">Or use your registered Student ID</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;
