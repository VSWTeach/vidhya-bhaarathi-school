import React, { useState, useEffect } from 'react';
import { PlusIcon, MagnifyingGlassIcon, TrashIcon } from '@heroicons/react/24/outline';
import { api } from '../services/api';
import toast from 'react-hot-toast';

const StudentsModule = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', class: '', parent_name: '', phone: '', email: '' });

  useEffect(() => { fetchStudents(); }, []);

  const fetchStudents = async () => {
    try {
      const data = await api.get('/students');
      setStudents(Array.isArray(data) ? data : data.results || []);
    } catch (error) {
      console.error('Failed to fetch students:', error);
    } finally { setLoading(false); }
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
      await fetchStudents();
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
      await fetchStudents();
      toast.success('Student deleted');
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div><h1 className="text-2xl font-bold">Students</h1><p className="text-gray-500">Manage student records</p></div>
        <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"><PlusIcon className="h-5 w-5" /> Add Student</button>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-4 border-b">
          <div className="relative w-64"><MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" /><input type="text" placeholder="Search..." className="pl-10 pr-4 py-2 border rounded-lg w-full" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-sm">Name</th><th className="px-4 py-3 text-left text-sm">Class</th><th className="px-4 py-3 text-left text-sm">Parent</th><th className="px-4 py-3 text-left text-sm">Contact</th><th className="px-4 py-3 text-left text-sm">Actions</th></tr></thead>
            <tbody className="divide-y">
              {students.filter(s => (s.name || `${s.first_name} ${s.last_name}`).toLowerCase().includes(searchTerm.toLowerCase())).map(s => (
                <tr key={s.id} className="hover:bg-gray-50"><td className="px-4 py-3">{s.name || `${s.first_name} ${s.last_name}`}</td><td className="px-4 py-3">{s.class_name || s.class}</td><td className="px-4 py-3">{s.parent_name}</td><td className="px-4 py-3">{s.phone}</td><td className="px-4 py-3"><button onClick={() => handleDeleteStudent(s.id)} className="text-red-600"><TrashIcon className="h-5 w-5" /></button></td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"><div className="bg-white rounded-xl p-6 w-full max-w-md"><div className="flex justify-between mb-4"><h3 className="text-xl font-bold">Add Student</h3><button onClick={() => setShowModal(false)} className="text-gray-500">✕</button></div><form onSubmit={handleAddStudent}><div className="space-y-3"><input placeholder="Full Name" className="w-full p-2 border rounded" required onChange={(e) => setFormData({...formData, name: e.target.value})} /><input placeholder="Class" className="w-full p-2 border rounded" required onChange={(e) => setFormData({...formData, class: e.target.value})} /><input placeholder="Parent Name" className="w-full p-2 border rounded" required onChange={(e) => setFormData({...formData, parent_name: e.target.value})} /><input placeholder="Phone" className="w-full p-2 border rounded" required onChange={(e) => setFormData({...formData, phone: e.target.value})} /><input placeholder="Email" type="email" className="w-full p-2 border rounded" required onChange={(e) => setFormData({...formData, email: e.target.value})} /></div><button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg mt-4">Add Student</button></form></div></div>)}
    </div>
  );
};

export default StudentsModule;
