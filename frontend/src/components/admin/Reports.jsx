import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { getStudents, getFees } from '../../services/api';
import toast from 'react-hot-toast';

const Reports = () => {
  const [students, setStudents] = useState([]);
  const [payments, setPayments] = useState([]);
  const [reportType, setReportType] = useState('students');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [studentsData, feesData] = await Promise.all([getStudents(), getFees()]);
      setStudents(studentsData);
      setPayments(feesData);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = (data, filename) => {
    const csv = convertToCSV(data);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Report exported successfully!');
  };

  const convertToCSV = (data) => {
    if (!data.length) return '';
    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(',')];
    for (const row of data) {
      const values = headers.map(header => JSON.stringify(row[header] || ''));
      csvRows.push(values.join(','));
    }
    return csvRows.join('\n');
  };

  const getClassDistribution = () => {
    const distribution = {};
    students.forEach(s => {
      distribution[s.class_name] = (distribution[s.class_name] || 0) + 1;
    });
    return Object.entries(distribution).map(([class_name, count]) => ({ class_name, count }));
  };

  const getFeeSummary = () => {
    const total = payments.reduce((sum, p) => sum + p.amount, 0);
    const byMode = {};
    payments.forEach(p => {
      byMode[p.payment_mode] = (byMode[p.payment_mode] || 0) + p.amount;
    });
    return { total, byMode };
  };

  const feeSummary = getFeeSummary();
  const classDistribution = getClassDistribution();

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-xl">Loading reports...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-auto p-8">
        <h1 className="text-3xl font-bold mb-8">Reports & Analytics</h1>
        
        {/* Report Type Selector */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex space-x-4 mb-6">
            <button onClick={() => setReportType('students')} className={`px-4 py-2 rounded ${reportType === 'students' ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}>Student Reports</button>
            <button onClick={() => setReportType('fees')} className={`px-4 py-2 rounded ${reportType === 'fees' ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}>Fee Reports</button>
            <button onClick={() => setReportType('academic')} className={`px-4 py-2 rounded ${reportType === 'academic' ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}>Academic Reports</button>
          </div>
          
          {/* Student Reports */}
          {reportType === 'students' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Student Report</h2>
                <button onClick={() => exportToCSV(students, 'student_report')} className="btn-primary">Export to CSV</button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-bold mb-4">Class Distribution</h3>
                  {classDistribution.map(c => (
                    <div key={c.class_name} className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Class {c.class_name}</span>
                        <span>{c.count} students</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-primary-600 h-2 rounded-full" style={{ width: `${(c.count / students.length) * 100}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-bold mb-4">Statistics</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Total Students:</span>
                      <span className="font-bold">{students.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Active Students:</span>
                      <span className="font-bold">{students.filter(s => s.status === 'active').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average per Class:</span>
                      <span className="font-bold">{(students.length / Object.keys(classDistribution).length).toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left">ID</th>
                      <th className="px-4 py-2 text-left">Name</th>
                      <th className="px-4 py-2 text-left">Class</th>
                      <th className="px-4 py-2 text-left">Parent</th>
                      <th className="px-4 py-2 text-left">Phone</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map(s => (
                      <tr key={s.id} className="border-t">
                        <td className="px-4 py-2">{s.student_id}</td>
                        <td className="px-4 py-2">{s.first_name} {s.last_name}</td>
                        <td className="px-4 py-2">{s.class_name}</td>
                        <td className="px-4 py-2">{s.parent_name}</td>
                        <td className="px-4 py-2">{s.phone}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {/* Fee Reports */}
          {reportType === 'fees' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Fee Collection Report</h2>
                <button onClick={() => exportToCSV(payments, 'fee_report')} className="btn-primary">Export to CSV</button>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg">
                  <div className="text-lg mb-2">Total Collection</div>
                  <div className="text-3xl font-bold">₹{feeSummary.total.toLocaleString()}</div>
                </div>
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg">
                  <div className="text-lg mb-2">Total Transactions</div>
                  <div className="text-3xl font-bold">{payments.length}</div>
                </div>
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg">
                  <div className="text-lg mb-2">Average Payment</div>
                  <div className="text-3xl font-bold">₹{(feeSummary.total / payments.length || 0).toFixed(0)}</div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-8">
                <h3 className="font-bold mb-4">Payment Methods</h3>
                {Object.entries(feeSummary.byMode).map(([mode, amount]) => (
                  <div key={mode} className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="capitalize">{mode}</span>
                      <span>₹{amount.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-primary-600 h-2 rounded-full" style={{ width: `${(amount / feeSummary.total) * 100}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Academic Reports */}
          {reportType === 'academic' && (
            <div>
              <h2 className="text-xl font-bold mb-6">Academic Performance Report</h2>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-xl font-bold mb-2">Coming Soon!</h3>
                <p className="text-gray-600">Advanced academic analytics and performance tracking will be available in the next update.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
