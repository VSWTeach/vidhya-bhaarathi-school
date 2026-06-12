import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { getStudents, createStudent, updateStudent, deleteStudent } from '../../services/api';
import toast from 'react-hot-toast';

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({ first_name: '', last_name: '', email: '', phone: '', class_name: '' });
  
  useEffect(() => {
    loadStudents();
  }, []);
  
  const loadStudents = async () => {
    try {
      const data = await getStudents();
      setStudents(data);
    } catch (error) {
      toast.error('Failed to load students');
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingStudent) {
        await updateStudent(editingStudent.id, formData);
        toast.success('Student updated successfully');
      } else {
        await createStudent(formData);
        toast.success('Student added successfully');
      }
      setModalOpen(false);
      setEditingStudent(null);
      setFormData({ first_name: '', last_name: '', email: '', phone: '', class_name: '' });
      loadStudents();
    } catch (error) {
      toast.error('Operation failed');
    }
  };
  
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await deleteStudent(id);
        toast.success('Student deleted');
        loadStudents();
      } catch (error) {
        toast.error('Delete failed');
      }
    }
  };
  
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-auto p-8">
        <div className="flex justify-between mb-6">
          <h1 className="text-3xl font-bold">Student Management</h1>
          <button onClick={() => setModalOpen(true)} className="btn-primary">+ Add Student</button>
        </div>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">ID</th><th>Name</th><th>Email</th><th>Class</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map(s => (
                <tr key={s.id} className="border-t">
                  <td className="px-6 py-4">{s.student_id}</td>
                  <td className="px-6 py-4">{s.first_name} {s.last_name}</td>
                  <td className="px-6 py-4">{s.email}</td>
                  <td className="px-6 py-4">{s.class_name}</td>
                  <td className="px-6 py-4">
                    <button onClick={() => { setEditingStudent(s); setFormData(s); setModalOpen(true); }} className="text-blue-600 mr-2">Edit</button>
                    <button onClick={() => handleDelete(s.id)} className="text-red-600">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">{editingStudent ? 'Edit Student' : 'Add Student'}</h2>
            <form onSubmit={handleSubmit}>
              <input type="text" placeholder="First Name" className="input-field mb-3" value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} required />
              <input type="text" placeholder="Last Name" className="input-field mb-3" value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} required />
              <input type="email" placeholder="Email" className="input-field mb-3" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
              <input type="tel" placeholder="Phone" className="input-field mb-3" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              <input type="text" placeholder="Class" className="input-field mb-4" value={formData.class_name} onChange={e => setFormData({...formData, class_name: e.target.value})} required />
              <div className="flex space-x-3">
                <button type="submit" className="btn-primary flex-1">{editingStudent ? 'Update' : 'Add'}</button>
                <button type="button" onClick={() => { setModalOpen(false); setEditingStudent(null); }} className="btn-secondary flex-1">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentManagement;
