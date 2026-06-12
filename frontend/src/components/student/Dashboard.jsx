import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HomeIcon, BookOpenIcon, CreditCardIcon, UserCircleIcon, 
  BellIcon, DocumentTextIcon, TrophyIcon, CalendarIcon,
  ArrowRightOnRectangleIcon, AcademicCapIcon, ChevronRightIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const StudentDashboard = () => {
  const [student, setStudent] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [notices, setNotices] = useState([]);
  const [feeDetails, setFeeDetails] = useState({
    admission_fee: { total: 5000, paid: 0, pending: 5000 },
    tuition_fee: { total: 45000, paid: 0, pending: 45000 },
    exam_fee: { total: 3000, paid: 0, pending: 3000 },
    transport_fee: { total: 15000, paid: 0, pending: 15000 },
    library_fee: { total: 2000, paid: 0, pending: 2000 }
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('student_token');
    const studentInfo = localStorage.getItem('student_info');
    
    if (!token || !studentInfo) {
      navigate('/student/login');
      return;
    }
    
    try {
      setStudent(JSON.parse(studentInfo));
    } catch (e) {
      localStorage.removeItem('student_info');
      navigate('/student/login');
      return;
    }
    
    fetchMaterials();
    fetchNotices();
    fetchFeeDetails();
  }, []);

  const fetchMaterials = async () => {
    try {
      const token = localStorage.getItem('student_token');
      const response = await fetch('http://localhost:8000/api/auth/student/materials', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.status === 401) {
        localStorage.removeItem('student_token');
        localStorage.removeItem('student_info');
        navigate('/student/login');
        return;
      }
      
      if (response.ok) {
        const data = await response.json();
        setMaterials(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Failed to load materials:', error);
    }
  };

  const fetchNotices = async () => {
    // Sample notices - in production, fetch from API
    setNotices([
      { id: 1, title: "Winter Break Announcement", date: "2024-12-20", content: "School closed from Dec 25 to Jan 1", priority: "high" },
      { id: 2, title: "Parent-Teacher Meeting", date: "2024-12-15", content: "PTM scheduled on Dec 20, 2024", priority: "medium" },
      { id: 3, title: "Annual Sports Day", date: "2024-12-25", content: "Sports day celebration on Dec 25", priority: "high" }
    ]);
  };

  const fetchFeeDetails = async () => {
    // Sample fee data - in production, fetch from API
    setFeeDetails({
      admission_fee: { total: 5000, paid: 5000, pending: 0 },
      tuition_fee: { total: 45000, paid: 15000, pending: 30000 },
      exam_fee: { total: 3000, paid: 3000, pending: 0 },
      transport_fee: { total: 15000, paid: 0, pending: 15000 },
      library_fee: { total: 2000, paid: 0, pending: 2000 }
    });
    setLoading(false);
  };

  const handlePayment = async () => {
    if (!paymentAmount || paymentAmount <= 0) {
      toast.error('Please enter valid amount');
      return;
    }

    try {
      const token = localStorage.getItem('student_token');
      // Simulate payment
      toast.success(`Payment of ₹${paymentAmount} initiated!`);
      setShowPaymentModal(false);
      setPaymentAmount('');
      fetchFeeDetails();
    } catch (error) {
      toast.error('Payment failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('student_token');
    localStorage.removeItem('student_info');
    toast.success('Logged out successfully');
    navigate('/student/login');
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: HomeIcon, color: 'blue' },
    { id: 'materials', label: 'Study Materials', icon: BookOpenIcon, color: 'green' },
    { id: 'fees', label: 'Fee Payment', icon: CreditCardIcon, color: 'purple' },
    { id: 'notices', label: 'Notices', icon: BellIcon, color: 'orange' },
    { id: 'profile', label: 'My Profile', icon: UserCircleIcon, color: 'indigo' },
  ];

  const totalFees = Object.values(feeDetails).reduce((sum, f) => sum + f.total, 0);
  const totalPaid = Object.values(feeDetails).reduce((sum, f) => sum + f.paid, 0);
  const totalPending = Object.values(feeDetails).reduce((sum, f) => sum + f.pending, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <div className="text-gray-500">Loading your dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-72' : 'w-20'} bg-gradient-to-b from-gray-900 to-gray-800 text-white transition-all duration-300 flex flex-col`}>
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <AcademicCapIcon className="h-6 w-6" />
            </div>
            {sidebarOpen && (
              <div>
                <h2 className="text-lg font-bold">Student Portal</h2>
                <p className="text-xs text-gray-400">{student?.student_id}</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 py-6">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-6 py-3 transition ${
                activeTab === item.id
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              <item.icon className="h-5 w-5" />
              {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Student Info */}
        {sidebarOpen && (
          <div className="p-4 border-t border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                <span className="text-lg font-bold">{student?.name?.charAt(0) || 'S'}</span>
              </div>
              <div>
                <p className="text-sm font-semibold">{student?.name}</p>
                <p className="text-xs text-gray-400">{student?.class_name} - {student?.section}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="mt-4 w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 py-2 rounded-lg transition"
            >
              <ArrowRightOnRectangleIcon className="h-4 w-4" />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white shadow-sm sticky top-0 z-10">
          <div className="px-6 py-4 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Welcome, {student?.name?.split(' ')[0]}!</h1>
              <p className="text-sm text-gray-500">Here's your learning progress today</p>
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition"
            >
              <ChevronRightIcon className={`h-5 w-5 text-gray-600 transition-transform ${sidebarOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-5 text-white">
                  <BookOpenIcon className="h-8 w-8 mb-3 opacity-80" />
                  <p className="text-2xl font-bold">{materials.length}</p>
                  <p className="text-sm opacity-90">Study Materials</p>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-5 text-white">
                  <div className="text-3xl mb-3">✅</div>
                  <p className="text-2xl font-bold">{materials.filter(m => m.status === 'completed').length}</p>
                  <p className="text-sm opacity-90">Completed</p>
                </div>
                <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-5 text-white">
                  <div className="text-3xl mb-3">📖</div>
                  <p className="text-2xl font-bold">{materials.filter(m => m.completion_percentage > 0 && m.completion_percentage < 100).length}</p>
                  <p className="text-sm opacity-90">In Progress</p>
                </div>
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-5 text-white">
                  <CreditCardIcon className="h-8 w-8 mb-3 opacity-80" />
                  <p className="text-2xl font-bold">₹{totalPending.toLocaleString()}</p>
                  <p className="text-sm opacity-90">Pending Fees</p>
                </div>
              </div>

              {/* Recent Materials */}
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <h2 className="text-lg font-bold mb-4">Recently Added Materials</h2>
                {materials.slice(0, 3).map((material, idx) => (
                  <div key={idx} className="flex justify-between items-center py-3 border-b last:border-0">
                    <div>
                      <p className="font-medium">{material.title}</p>
                      <p className="text-sm text-gray-500">{material.subject}</p>
                    </div>
                    <span className="text-sm font-semibold text-blue-600">{material.completion_percentage || 0}%</span>
                  </div>
                ))}
                {materials.length === 0 && (
                  <p className="text-center text-gray-500 py-6">No materials assigned yet</p>
                )}
              </div>

              {/* Fee Summary */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-bold mb-4">Fee Summary</h2>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Total Fees</p>
                    <p className="text-2xl font-bold">₹{totalFees.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-green-600">Paid: ₹{totalPaid.toLocaleString()}</p>
                    <p className="text-sm text-red-600">Pending: ₹{totalPending.toLocaleString()}</p>
                  </div>
                </div>
                <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(totalPaid / totalFees) * 100}%` }}></div>
                </div>
                <button
                  onClick={() => setActiveTab('fees')}
                  className="mt-4 text-blue-600 text-sm hover:underline"
                >
                  View Payment Details →
                </button>
              </div>
            </div>
          )}

          {/* Study Materials Tab */}
          {activeTab === 'materials' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold mb-6">📚 My Study Materials</h2>
              {materials.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📭</div>
                  <h3 className="text-lg font-bold mb-2">No Materials Assigned Yet</h3>
                  <p className="text-gray-500">Your teacher hasn't assigned any study materials.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {materials.map((material, idx) => (
                    <div key={idx} className="border rounded-lg p-4 hover:shadow-md transition">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{material.title}</h3>
                          <p className="text-gray-500 text-sm mt-1">{material.description}</p>
                          <div className="flex gap-4 mt-2 text-sm text-gray-400">
                            <span>📚 {material.subject}</span>
                            {material.due_date && <span>📅 Due: {new Date(material.due_date).toLocaleDateString()}</span>}
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          material.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {material.completion_percentage || 0}%
                        </span>
                      </div>
                      <div className="mt-3">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${material.completion_percentage || 0}%` }}></div>
                        </div>
                        {material.file_url && (
                          <a href={material.file_url} target="_blank" className="mt-3 inline-block text-blue-600 text-sm hover:underline">
                            📄 View Material
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Fee Payment Tab */}
          {activeTab === 'fees' && (
            <div>
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 mb-6 text-white">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm opacity-90">Total Fees</p>
                    <p className="text-2xl font-bold">₹{totalFees.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">Paid: ₹{totalPaid.toLocaleString()}</p>
                    <p className="text-sm">Pending: ₹{totalPending.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {Object.entries(feeDetails).map(([key, fee]) => (
                  <div key={key} className="bg-white rounded-xl shadow-sm p-5">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-bold text-lg capitalize">{key.replace('_', ' ')}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        fee.pending === 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {fee.pending === 0 ? 'Paid' : 'Pending'}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Total:</span>
                        <span className="font-semibold">₹{fee.total.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Paid:</span>
                        <span className="text-green-600">₹{fee.paid.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Pending:</span>
                        <span className="text-red-600 font-bold">₹{fee.pending.toLocaleString()}</span>
                      </div>
                    </div>
                    {fee.pending > 0 && (
                      <button
                        onClick={() => { setSelectedFee(key); setShowPaymentModal(true); }}
                        className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                      >
                        Pay Now
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notices Tab */}
          {activeTab === 'notices' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold mb-6">📢 Notice Board</h2>
              <div className="space-y-4">
                {notices.map(notice => (
                  <div key={notice.id} className={`border-l-4 ${notice.priority === 'high' ? 'border-red-500' : 'border-yellow-500'} bg-gray-50 p-4 rounded-r-lg`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-800">{notice.title}</h3>
                        <p className="text-gray-600 text-sm mt-1">{notice.content}</p>
                        <p className="text-xs text-gray-400 mt-2">📅 {new Date(notice.date).toLocaleDateString()}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        notice.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {notice.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-4xl font-bold text-white mx-auto">
                  {student?.name?.charAt(0) || 'S'}
                </div>
                <h2 className="text-2xl font-bold mt-3">{student?.name}</h2>
                <p className="text-gray-500">Student ID: {student?.student_id}</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">Class & Section</p>
                  <p className="font-semibold text-lg">{student?.class_name} - {student?.section || 'A'}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">Roll Number</p>
                  <p className="font-semibold text-lg">{student?.roll_number || 'N/A'}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">Email Address</p>
                  <p className="font-semibold text-lg break-all">{student?.email}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">Admission Year</p>
                  <p className="font-semibold text-lg">2024</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Pay {selectedFee?.replace('_', ' ').toUpperCase()}</h2>
              <button onClick={() => setShowPaymentModal(false)} className="text-gray-400 text-2xl">✕</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Amount to Pay (₹)</label>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter amount"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Payment Method</label>
                <select className="w-full px-3 py-2 border rounded-lg">
                  <option>Credit/Debit Card</option>
                  <option>UPI (PhonePe, GPay, Paytm)</option>
                  <option>Net Banking</option>
                </select>
              </div>
              <button
                onClick={handlePayment}
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700"
              >
                Pay ₹{parseInt(paymentAmount || 0).toLocaleString()}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;