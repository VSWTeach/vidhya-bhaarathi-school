import React, { useState, useEffect } from 'react';
import { UsersIcon, CurrencyRupeeIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { api } from '../services/api';

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

const OverviewModule = () => {
  const [stats, setStats] = useState({
    totalStudents: 0, totalRevenue: 0, pendingFees: 0, attendanceRate: 94.5
  });
  const [revenueData] = useState([
    { month: 'Jul', revenue: 850000 }, { month: 'Aug', revenue: 920000 },
    { month: 'Sep', revenue: 880000 }, { month: 'Oct', revenue: 950000 },
    { month: 'Nov', revenue: 1020000 }, { month: 'Dec', revenue: 980000 }
  ]);
  const [classData] = useState([
    { name: '8th', value: 120, color: '#3b82f6' }, { name: '9th', value: 135, color: '#10b981' },
    { name: '10th', value: 125, color: '#f59e0b' }, { name: '11th', value: 110, color: '#ef4444' },
    { name: '12th', value: 105, color: '#8b5cf6' }
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.get('/dashboard/stats');
        setStats({
          totalStudents: data.total_students || 0,
          totalRevenue: data.total_revenue || 0,
          pendingFees: data.pending_fees || 0,
          attendanceRate: data.attendance_rate || 94.5
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };
    fetchStats();
  }, []);

  return (
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
};

export default OverviewModule;
