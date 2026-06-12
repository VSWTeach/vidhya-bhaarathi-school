import React, { useState, useEffect } from 'react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts';
import { 
  UsersIcon, CurrencyRupeeIcon, CheckCircleIcon,
  HomeIcon, AcademicCapIcon, XMarkIcon, Bars3Icon,
  ArrowLeftOnRectangleIcon, PlusIcon, MagnifyingGlassIcon, TrashIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [admin, setAdmin] = useState(null);
  const [formData, setFormData] = useState({
    name: '', class: '', parent_name: '', phone: '', email: ''
  });

  const [stats, setStats] = useState({
    totalStudents: 0,
    totalRevenue: 0,
    pendingFees: 0,
    attendanceRate: 94.5
  });

  const revenueData = [
    { month: 'Jul', revenue: 850000 }, { month: 'Aug', revenue: 920000 },
    { month: 'Sep', revenue: 880000 }, { month: 'Oct', revenue: 950000 },
    { month: 'Nov', revenue: 1020000 }, { month: 'Dec', revenue: 980000 }
  ];

  const classData = [
    { name: '8th', value: 120, color: '#3b82f6' },
    { name: '9th', value: 135, color: '#10b981' },
    { name: '10th', value: 125, color: '#f59e0b' },
    { name: '11th', value: 110, color: '#ef4444' },
    { name: '12th', value: 105, color: '#8b5cf6' }
  ];

  const menuItems = [
    { id: 'overview', name: 'Dashboard', icon: <HomeIcon className="h-5 w-5" /> },
    { id: 'students', name: 'Students', icon: <UsersIcon className="h-5 w-5" /> },
    { id: 'fees', name: 'Fees', icon: <CurrencyRupeeIcon className="h-5 w-5" /> }
  ];

  const getAuthToken = () => localStorage.getItem('access_token');

  const api = {
    get: async (endpoint) => {
      const token = getAuthToken();
      const response = await fetch(`http://localhost:8000/api${endpoint}`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      if (response.status === 401) {
        localStorage.clear();
        window.location.href = '/admin/login';
        throw new Error('Unauthorized');
      }
      return response.json();
    },
    post: async (endpoint, data) => {
      const token = getAuthToken();
      const response = await fetch(`http://localhost:8000/api${endpoint}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return response.json();
    },
    delete: async (endpoint) => {
      const token = getAuthToken();
      const response = await fetch(`http://localhost:8000/api${endpoint}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      return response.json();
    }
  };

  useEffect(() => {
    const token = getAuthToken();
    const adminData = localStorage.getItem('admin');
    if (!token) {
      window.location.href = '/admin/login';
      return;
    }
    if (adminData) setAdmin(JSON.parse(adminData));
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const statsData = await api.get('/dashboard/stats');
      const studentsData = await api.get('/students');
      setStats({
        totalStudents: statsData.total_students || 0,
        totalRevenue: statsData.total_revenue || 0,
        pendingFees: statsData.pending_fees || 0,
        attendanceRate: statsData.attendance_rate || 94.5
      });
      setStudents(Array.isArray(studentsData) ? studentsData : studentsData.results || []);
    } catch (error) {
      console.error('Failed to fetch:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      const studentData = {
        first_name: formData.name.split(' ')[0],
        last_name: formData.name.split(' ').slice(1).join(' ') || '',
        email: formData.email,
        phone: formData.phone,
        class_name: formData.class,
        parent_name: formData.parent_name,
        status: 'active'
      };
      await api.post('/students/register', studentData);
      await fetchData();
      toast.success(`Student ${formData.name} added!`);
      setShowModal(false);
      setFormData({ name: '', class: '', parent_name: '', phone: '', email: '' });
    } catch (error) {
      toast.error('Failed to add student');
    }
  };

  const handleDeleteStudent = async (id) => {
    if (!window.confirm('Delete this student?')) return;
    try {
      await api.delete(`/students/${id}`);
      await fetchData();
      toast.success('Student deleted');
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const StatCard = ({ title, value, icon, color, change, suffix = '' }) => (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}{suffix}</p>
          {change && <p className={`text-xs mt-1 ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>{change > 0 ? '↑' : '↓'} {Math.abs(change)}%</p>}
        </div>
        <div className={`p-3 rounded-xl bg-${color}-100`}>
          <div className={`h-5 w-5 text-${color}-600`}>{icon}</div>
        </div>
      </div>
    </div>
  );

  const renderOverview = () => (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Dashboard</h1>
      <p className="text-gray-500 mb-6">Manage your school operations efficiently</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <StatCard title="Total Students" value={stats.totalStudents} icon={<UsersIcon />} color="blue" change={8} />
        <StatCard title="Total Revenue" value={`₹${(stats.totalRevenue / 100000).toFixed(1)}L`} icon={<CurrencyRupeeIcon />} color="green" change={12} />
        <StatCard title="Attendance Rate" value={stats.attendanceRate} icon={<CheckCircleIcon />} color="orange" suffix="%" change={2} />
        <StatCard title="Pending Fees" value={`₹${(stats.pendingFees / 1000).toFixed(0)}K`} icon={<CurrencyRupeeIcon />} color="red" change={-5} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h3 className="font-semibold text-gray-800 mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(v) => `₹${v/1000}K`} />
              <Tooltip formatter={(v) => [`₹${v?.toLocaleString()}`, 'Revenue']} />
              <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h3 className="font-semibold text-gray-800 mb-4">Class Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={classData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`} dataKey="value">
                {classData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderStudents = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div><h1 className="text-2xl font-bold">Students</h1><p className="text-gray-500">Manage student records</p></div>
        <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"><PlusIcon className="h-5 w-5" /> Add Student</button>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-4 border-b">
          <div className="relative w-64">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search students..." className="pl-10 pr-4 py-2 border rounded-lg w-full" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Class</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Parent</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Contact</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {students.filter(s => (s.name || `${s.first_name} ${s.last_name}`).toLowerCase().includes(searchTerm.toLowerCase())).map(s => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{s.name || `${s.first_name} ${s.last_name}`}</td>
                  <td className="px-4 py-3">{s.class_name || s.class}</td>
                  <td className="px-4 py-3">{s.parent_name}</td>
                  <td className="px-4 py-3">{s.phone}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleDeleteStudent(s.id)} className="text-red-600 hover:text-red-800">
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {students.length === 0 && (
                <tr><td colSpan="5" className="text-center py-8 text-gray-400">No students found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderFees = () => (
    <div>
      <h1 className="text-2xl font-bold mb-2">Fee Management</h1>
      <p className="text-gray-500 mb-6">Manage fee collection and payments</p>
      <div className="bg-white rounded-xl shadow-sm p-12 text-center">
        <CurrencyRupeeIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-400">Fee management module is under development</p>
      </div>
    </div>
  );

  const renderContent = () => {
    switch(activeTab) {
      case 'overview': return renderOverview();
      case 'students': return renderStudents();
      case 'fees': return renderFees();
      default: return renderOverview();
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gray-900 text-white transition-all duration-300 flex flex-col fixed h-full z-20`}>
        <div className="p-4 border-b border-gray-800 flex justify-between items-center">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <AcademicCapIcon className="h-8 w-8 text-blue-400" />
              <div>
                <h1 className="font-bold">Vidya Bharati</h1>
                <p className="text-xs text-gray-400">ERP System</p>
              </div>
            </div>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 hover:bg-gray-800 rounded">
            {sidebarOpen ? <XMarkIcon className="h-5 w-5" /> : <Bars3Icon className="h-5 w-5" />}
          </button>
        </div>
        
        <nav className="flex-1 py-4">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center ${sidebarOpen ? 'px-4' : 'justify-center'} py-3 my-1 transition-colors ${activeTab === item.id ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
            >
              <div className="h-5 w-5">{item.icon}</div>
              {sidebarOpen && <span className="ml-3 text-sm">{item.name}</span>}
            </button>
          ))}
        </nav>
        
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold">{admin?.full_name?.charAt(0) || 'A'}</span>
            </div>
            {sidebarOpen && (
              <div className="flex-1 text-left">
                <p className="text-sm font-medium">{admin?.full_name || 'Admin'}</p>
                <p className="text-xs text-gray-400">Administrator</p>
              </div>
            )}
            <button onClick={() => { localStorage.clear(); window.location.href = '/admin/login'; }} className="p-1 hover:bg-gray-800 rounded">
              <ArrowLeftOnRectangleIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'} overflow-y-auto`}>
        <div className="p-6">
          {renderContent()}
        </div>
      </div>

      {/* Add Student Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between mb-4">
              <h3 className="text-xl font-bold">Add New Student</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            <form onSubmit={handleAddStudent}>
              <div className="space-y-3">
                <input type="text" placeholder="Full Name" className="w-full p-2 border rounded-lg" required
                  onChange={(e) => setFormData({...formData, name: e.target.value})} />
                <input type="text" placeholder="Class (e.g., 10th)" className="w-full p-2 border rounded-lg" required
                  onChange={(e) => setFormData({...formData, class: e.target.value})} />
                <input type="text" placeholder="Parent Name" className="w-full p-2 border rounded-lg" required
                  onChange={(e) => setFormData({...formData, parent_name: e.target.value})} />
                <input type="tel" placeholder="Phone Number" className="w-full p-2 border rounded-lg" required
                  onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                <input type="email" placeholder="Email" className="w-full p-2 border rounded-lg" required
                  onChange={(e) => setFormData({...formData, email: e.target.value})} />
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg mt-4 hover:bg-blue-700 transition">
                Add Student
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;