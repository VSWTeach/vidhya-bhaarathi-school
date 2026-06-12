import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { getFees, createFeePayment, getStudents } from '../../services/api';
import toast from 'react-hot-toast';

const FeesManagement = () => {
  const [payments, setPayments] = useState([]);
  const [students, setStudents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ student_id: '', amount: '', payment_mode: 'cash', payment_for: 'tuition', month: '', year: new Date().getFullYear() });
  
  useEffect(() => {
    loadData();
  }, []);
  
  const loadData = async () => {
    try {
      const [feesData, studentsData] = await Promise.all([getFees(), getStudents()]);
      setPayments(feesData);
      setStudents(studentsData);
    } catch (error) {
      toast.error('Failed to load data');
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createFeePayment(formData);
      toast.success('Payment recorded');
      setModalOpen(false);
      setFormData({ student_id: '', amount: '', payment_mode: 'cash', payment_for: 'tuition', month: '', year: new Date().getFullYear() });
      loadData();
    } catch (error) {
      toast.error('Failed to record payment');
    }
  };
  
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-auto p-8">
        <div className="flex justify-between mb-6">
          <h1 className="text-3xl font-bold">Fee Management</h1>
          <button onClick={() => setModalOpen(true)} className="btn-primary">+ Record Payment</button>
        </div>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr><th className="px-6 py-3">Receipt No</th><th>Student</th><th>Amount</th><th>Date</th><th>Mode</th></tr>
            </thead>
            <tbody>
              {payments.map(p => {
                const student = students.find(s => s.id === p.student_id);
                return (
                  <tr key={p.id} className="border-t">
                    <td className="px-6 py-4">{p.receipt_number}</td>
                    <td className="px-6 py-4">{student ? `${student.first_name} ${student.last_name}` : 'N/A'}</td>
                    <td className="px-6 py-4">₹{p.amount}</td>
                    <td className="px-6 py-4">{new Date(p.payment_date).toLocaleDateString()}</td>
                    <td className="px-6 py-4">{p.payment_mode}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Record Fee Payment</h2>
            <form onSubmit={handleSubmit}>
              <select className="input-field mb-3" value={formData.student_id} onChange={e => setFormData({...formData, student_id: e.target.value})} required>
                <option value="">Select Student</option>
                {students.map(s => <option key={s.id} value={s.id}>{s.first_name} {s.last_name} - {s.class_name}</option>)}
              </select>
              <input type="number" placeholder="Amount" className="input-field mb-3" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} required />
              <select className="input-field mb-3" value={formData.payment_mode} onChange={e => setFormData({...formData, payment_mode: e.target.value})}>
                <option value="cash">Cash</option><option value="card">Card</option><option value="online">Online</option>
              </select>
              <input type="text" placeholder="Month (e.g., January)" className="input-field mb-3" value={formData.month} onChange={e => setFormData({...formData, month: e.target.value})} />
              <button type="submit" className="btn-primary w-full">Record Payment</button>
              <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary w-full mt-2">Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeesManagement;
