import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { getStudents } from '../../services/api';
import toast from 'react-hot-toast';

const StudentFollowups = () => {
  const [followups, setFollowups] = useState([]);
  const [students, setStudents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    student_id: '', 
    follow_up_type: 'academic', 
    title: '', 
    description: '', 
    scheduled_date: '', 
    priority: 'medium'
  });

  useEffect(() => {
    loadFollowups();
    loadStudents();
  }, []);

  const loadFollowups = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:8000/api/followups/followups', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Followups data:', data);
      
      // Ensure data is an array
      if (Array.isArray(data)) {
        setFollowups(data);
      } else {
        console.error('Followups data is not an array:', data);
        setFollowups([]);
      }
    } catch (error) {
      console.error('Failed to load follow-ups:', error);
      toast.error('Failed to load follow-ups');
      setFollowups([]);
    } finally {
      setLoading(false);
    }
  };

  const loadStudents = async () => {
    try {
      const data = await getStudents();
      setStudents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load students:', error);
      setStudents([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:8000/api/followups/followups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        toast.success('Follow-up scheduled successfully');
        setModalOpen(false);
        setFormData({
          student_id: '', 
          follow_up_type: 'academic', 
          title: '', 
          description: '', 
          scheduled_date: '', 
          priority: 'medium'
        });
        loadFollowups();
      } else {
        const error = await response.json();
        toast.error(error.detail || 'Failed to schedule follow-up');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to schedule follow-up');
    }
  };

  const completeFollowUp = async (id, title) => {
    const outcomeText = prompt(`Enter outcome for: ${title}`);
    if (outcomeText) {
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch(`http://localhost:8000/api/followups/followups/${id}/complete?outcome=${encodeURIComponent(outcomeText)}`, {
          method: 'PUT',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          toast.success('Follow-up completed');
          loadFollowups();
        } else {
          toast.error('Failed to complete follow-up');
        }
      } catch (error) {
        console.error('Error:', error);
        toast.error('Failed to complete follow-up');
      }
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-green-600 bg-green-100';
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-xl">Loading follow-ups...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-auto p-8">
        <div className="flex justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Student Follow-ups</h1>
            <p className="text-gray-600 mt-1">Track and manage student follow-ups</p>
          </div>
          <button onClick={() => setModalOpen(true)} className="btn-primary">
            + Schedule Follow-up
          </button>
        </div>

        {/* Follow-ups List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {followups.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-xl font-bold mb-2">No Follow-ups Yet</h3>
              <p className="text-gray-600">Click "Schedule Follow-up" to create one</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scheduled Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {followups.map((followup) => {
                  const student = students.find(s => s.id === followup.student_id);
                  return (
                    <tr key={followup.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {student ? `${student.first_name} ${student.last_name}` : 'N/A'}
                      </td>
                      <td className="px-6 py-4 capitalize whitespace-nowrap">
                        {followup.follow_up_type}
                      </td>
                      <td className="px-6 py-4">
                        {followup.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(followup.scheduled_date).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${getPriorityColor(followup.priority)}`}>
                          {followup.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          followup.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {followup.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {followup.status !== 'completed' && (
                          <button 
                            onClick={() => completeFollowUp(followup.id, followup.title)} 
                            className="text-green-600 hover:text-green-800"
                          >
                            Mark Complete
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Schedule Follow-up Modal */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 w-full max-w-md max-h-screen overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">Schedule Follow-up</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1">Student *</label>
                  <select 
                    className="input-field" 
                    value={formData.student_id} 
                    onChange={e => setFormData({...formData, student_id: e.target.value})} 
                    required
                  >
                    <option value="">Select Student</option>
                    {students.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.first_name} {s.last_name} - Class {s.class_name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1">Follow-up Type *</label>
                  <select 
                    className="input-field" 
                    value={formData.follow_up_type} 
                    onChange={e => setFormData({...formData, follow_up_type: e.target.value})}
                  >
                    <option value="academic">Academic</option>
                    <option value="behavioral">Behavioral</option>
                    <option value="attendance">Attendance</option>
                    <option value="general">General</option>
                  </select>
                </div>
                
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1">Title *</label>
                  <input 
                    type="text" 
                    placeholder="Enter title" 
                    className="input-field" 
                    value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value})} 
                    required 
                  />
                </div>
                
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea 
                    placeholder="Enter description" 
                    className="input-field" 
                    rows="3"
                    value={formData.description} 
                    onChange={e => setFormData({...formData, description: e.target.value})} 
                  />
                </div>
                
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1">Scheduled Date & Time *</label>
                  <input 
                    type="datetime-local" 
                    className="input-field" 
                    value={formData.scheduled_date} 
                    onChange={e => setFormData({...formData, scheduled_date: e.target.value})} 
                    required 
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Priority</label>
                  <select 
                    className="input-field" 
                    value={formData.priority} 
                    onChange={e => setFormData({...formData, priority: e.target.value})}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                
                <div className="flex space-x-3">
                  <button type="submit" className="btn-primary flex-1">Schedule</button>
                  <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary flex-1">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentFollowups;
