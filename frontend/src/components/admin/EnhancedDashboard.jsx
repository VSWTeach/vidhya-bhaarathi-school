import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { 
  CalendarIcon, TrendingUpIcon, UsersIcon, CurrencyRupeeIcon,
  BookOpenIcon, UserGroupIcon, AcademicCapIcon, CheckCircleIcon,
  ClockIcon, EyeIcon, DownloadIcon, PlusIcon, BellIcon,
  ChartBarIcon, DocumentTextIcon, ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const EnhancedDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    monthlyRevenue: 0,
    pendingFees: 0,
    attendanceRate: 0,
    activeClasses: 0,
    materialsCount: 0
  });

  const [revenueData, setRevenueData] = useState([
    { month: 'Jan', revenue: 850000, target: 800000, expense: 450000, profit: 400000 },
    { month: 'Feb', revenue: 920000, target: 850000, expense: 480000, profit: 440000 },
    { month: 'Mar', revenue: 880000, target: 900000, expense: 460000, profit: 420000 },
    { month: 'Apr', revenue: 950000, target: 920000, expense: 490000, profit: 460000 },
    { month: 'May', revenue: 1020000, target: 980000, expense: 510000, profit: 510000 },
    { month: 'Jun', revenue: 980000, target: 950000, expense: 500000, profit: 480000 },
  ]);

  const [classDistribution, setClassDistribution] = useState([
    { name: 'Pre-Primary', value: 450, color: '#3b82f6', students: 450 },
    { name: 'Primary (1-5)', value: 850, color: '#10b981', students: 850 },
    { name: 'Middle (6-8)', value: 650, color: '#f59e0b', students: 650 },
    { name: 'Secondary (9-10)', value: 400, color: '#ef4444', students: 400 },
    { name: 'Senior (11-12)', value: 300, color: '#8b5cf6', students: 300 },
  ]);

  const [recentActivities, setRecentActivities] = useState([
    { id: 1, action: 'New student enrollment', user: 'Admin', time: '2 mins ago', type: 'success', icon: '👨‍🎓' },
    { id: 2, action: 'Fee payment received', user: 'Aarav Sharma', amount: '₹15,000', time: '1 hour ago', type: 'payment', icon: '💰' },
    { id: 3, action: 'Study material uploaded', user: 'Teacher', subject: 'Mathematics', time: '3 hours ago', type: 'upload', icon: '📚' },
  ]);

  const [upcomingEvents, setUpcomingEvents] = useState([
    { id: 1, title: 'Parent-Teacher Meeting', date: '2024-12-20', attendees: 120, status: 'upcoming' },
    { id: 2, title: 'Annual Sports Day', date: '2024-12-25', attendees: 500, status: 'upcoming' },
    { id: 3, title: 'Winter Break', date: '2024-12-25', attendees: 0, status: 'holiday' },
  ]);

  const [notices, setNotices] = useState([
    { id: 1, title: 'Admissions Open 2025-26', date: '2024-12-01', priority: 'high' },
    { id: 2, title: 'Fee Payment Deadline Extended', date: '2024-12-05', priority: 'medium' },
    { id: 3, title: 'Holiday on Dec 25', date: '2024-12-10', priority: 'low' },
  ]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:8000/api/dashboard/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setStats({
          totalStudents: data.total_students || 1250,
          totalTeachers: 45,
          monthlyRevenue: data.fees_collected || 980000,
          pendingFees: data.fees_pending || 250000,
          attendanceRate: 94,
          activeClasses: 28,
          materialsCount: 156
        });
      } else {
        // Fallback data
        setStats({
          totalStudents: 1250,
          totalTeachers: 45,
          monthlyRevenue: 980000,
          pendingFees: 250000,
          attendanceRate: 94,
          activeClasses: 28,
          materialsCount: 156
        });
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data');
      setStats({
        totalStudents: 1250,
        totalTeachers: 45,
        monthlyRevenue: 980000,
        pendingFees: 250000,
        attendanceRate: 94,
        activeClasses: 28,
        materialsCount: 156
      });
    }
  };

  const StatCard = ({ title, value, icon, color, trend, suffix = '' }) => (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-800">
            {value !== undefined && value !== null ? value : 0}{suffix}
          </p>
          {trend && (
            <p className={`text-xs mt-2 flex items-center gap-1 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% from last month
            </p>
          )}
        </div>
        <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  const totalStudents = classDistribution.reduce((sum, c) => sum + (c.students || 0), 0);
  const totalRevenue = revenueData.reduce((sum, m) => sum + (m.revenue || 0), 0);
  const totalProfit = revenueData.reduce((sum, m) => sum + (m.profit || 0), 0);

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Welcome back, Admin!</h2>
            <p className="text-blue-100 mt-1">Here's your school performance overview</p>
          </div>
          <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg">
            <CalendarIcon className="h-5 w-5" />
            <span className="text-sm">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>
      </div>

      {/* Stats Grid - Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={stats.totalStudents?.toLocaleString()}
          icon={<UsersIcon className="h-6 w-6 text-white" />}
          color="bg-gradient-to-r from-blue-500 to-blue-600"
          trend={8}
        />
        <StatCard
          title="Total Teachers"
          value={stats.totalTeachers}
          icon={<AcademicCapIcon className="h-6 w-6 text-white" />}
          color="bg-gradient-to-r from-green-500 to-green-600"
          trend={5}
        />
        <StatCard
          title="Monthly Revenue"
          value={`₹${((stats.monthlyRevenue || 0) / 1000).toFixed(0)}K`}
          icon={<CurrencyRupeeIcon className="h-6 w-6 text-white" />}
          color="bg-gradient-to-r from-purple-500 to-purple-600"
          trend={12}
        />
        <StatCard
          title="Attendance Rate"
          value={stats.attendanceRate}
          icon={<CalendarIcon className="h-6 w-6 text-white" />}
          color="bg-gradient-to-r from-orange-500 to-orange-600"
          suffix="%"
          trend={2}
        />
      </div>

      {/* Stats Grid - Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Pending Fees"
          value={`₹${((stats.pendingFees || 0) / 1000).toFixed(0)}K`}
          icon={<CurrencyRupeeIcon className="h-6 w-6 text-white" />}
          color="bg-gradient-to-r from-red-500 to-red-600"
          trend={-5}
        />
        <StatCard
          title="Active Classes"
          value={stats.activeClasses}
          icon={<BookOpenIcon className="h-6 w-6 text-white" />}
          color="bg-gradient-to-r from-teal-500 to-teal-600"
          trend={0}
        />
        <StatCard
          title="Study Materials"
          value={stats.materialsCount}
          icon={<DocumentTextIcon className="h-6 w-6 text-white" />}
          color="bg-gradient-to-r from-indigo-500 to-indigo-600"
          trend={15}
        />
        <StatCard
          title="Total Revenue (YTD)"
          value={`₹${(totalRevenue / 1000).toFixed(0)}K`}
          icon={<ChartBarIcon className="h-6 w-6 text-white" />}
          color="bg-gradient-to-r from-emerald-500 to-emerald-600"
          trend={18}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Revenue Trend Chart */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800">Revenue Trend</h3>
            <select className="text-sm border rounded-lg px-3 py-1.5 bg-white">
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" tickFormatter={(value) => `₹${value/1000}K`} />
              <Tooltip formatter={(value) => [`₹${value?.toLocaleString()}`, '']} />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#3b82f6" name="Actual Revenue" strokeWidth={2} />
              <Line type="monotone" dataKey="target" stroke="#f59e0b" name="Target" strokeDasharray="5 5" />
              <Line type="monotone" dataKey="profit" stroke="#10b981" name="Profit" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
            <div className="text-center">
              <p className="text-xs text-gray-500">Total Revenue</p>
              <p className="text-lg font-bold text-blue-600">₹{(totalRevenue/1000).toFixed(0)}K</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">Total Expenses</p>
              <p className="text-lg font-bold text-red-600">₹{((totalRevenue - totalProfit)/1000).toFixed(0)}K</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">Net Profit</p>
              <p className="text-lg font-bold text-green-600">₹{(totalProfit/1000).toFixed(0)}K</p>
            </div>
          </div>
        </div>

        {/* Class Distribution Pie Chart */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Student Distribution by Class</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={classDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                labelLine={false}
                label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                dataKey="value"
              >
                {classDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value || 0} students`, 'Count']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t">
            <div className="text-center p-2 bg-blue-50 rounded-lg">
              <p className="text-xs text-gray-500">Total Students</p>
              <p className="text-xl font-bold text-blue-600">{totalStudents}</p>
            </div>
            <div className="text-center p-2 bg-green-50 rounded-lg">
              <p className="text-xs text-gray-500">Average per Class</p>
              <p className="text-xl font-bold text-green-600">{Math.round(totalStudents / classDistribution.length)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">Recent Activities</h3>
          <button className="text-sm text-blue-600 hover:text-blue-700">View All →</button>
        </div>
        <div className="space-y-3">
          {recentActivities.map(activity => (
            <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
              <div className="flex items-center gap-3">
                <div className="text-xl">{activity.icon}</div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                  <p className="text-xs text-gray-500">
                    by {activity.user} {activity.amount && `• ${activity.amount}`} {activity.subject && `• ${activity.subject}`}
                  </p>
                </div>
              </div>
              <span className="text-xs text-gray-400">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EnhancedDashboard;
