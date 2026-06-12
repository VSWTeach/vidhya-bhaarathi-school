import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { getStudents } from '../../services/api';
import toast from 'react-hot-toast';
import { 
  DocumentIcon, UserGroupIcon, ChartBarIcon, CloudArrowUpIcon, 
  PaperAirplaneIcon, DevicePhoneMobileIcon 
} from '@heroicons/react/24/outline';

const StudyMaterials = () => {
  const [materials, setMaterials] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [distributionType, setDistributionType] = useState('class');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [dueDate, setDueDate] = useState('');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [whatsappLoading, setWhatsappLoading] = useState(false);
  
  const [uploadModal, setUploadModal] = useState(false);
  const [distributeModal, setDistributeModal] = useState(false);
  const [viewStatsModal, setViewStatsModal] = useState(false);
  const [whatsappModal, setWhatsappModal] = useState(false);
  
  const [materialData, setMaterialData] = useState({
    title: '', description: '', subject: '', class_name: '', material_type: 'PDF', tags: '', file: null
  });

  useEffect(() => {
    loadMaterials();
    loadStudents();
  }, []);

  const loadMaterials = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:8000/api/materials/materials', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setMaterials(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load materials:', error);
      toast.error('Failed to load materials');
      setMaterials([]);
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

  // WhatsApp Integration Functions
  const sendViaWhatsApp = async (materialId, studentId, studentName, studentPhone) => {
    if (!studentPhone) {
      toast.error('Student phone number not available');
      return;
    }
    
    setWhatsappLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://localhost:8000/api/whatsapp/send-material?student_id=${studentId}&material_id=${materialId}`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        toast.success(`WhatsApp notification sent to ${studentName}`);
      } else {
        const error = await response.json();
        toast.error(error.detail || 'Failed to send WhatsApp message');
      }
    } catch (error) {
      console.error('WhatsApp send error:', error);
      toast.error('Failed to send WhatsApp message');
    } finally {
      setWhatsappLoading(false);
    }
  };

  const broadcastToClassWhatsApp = async (materialId, className) => {
    if (!className) {
      toast.error('Please select a class');
      return;
    }
    
    setWhatsappLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://localhost:8000/api/whatsapp/broadcast-material?class_name=${className}&material_id=${materialId}`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        toast.success(data.message);
      } else {
        const error = await response.json();
        toast.error(error.detail || 'Failed to broadcast');
      }
    } catch (error) {
      console.error('Broadcast error:', error);
      toast.error('Failed to send WhatsApp messages');
    } finally {
      setWhatsappLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', materialData.title);
    formData.append('description', materialData.description);
    formData.append('subject', materialData.subject);
    formData.append('class_name', materialData.class_name);
    formData.append('material_type', materialData.material_type);
    formData.append('tags', materialData.tags);
    if (materialData.file) {
      formData.append('file', materialData.file);
    }
    
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:8000/api/materials/upload-material', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      
      if (response.ok) {
        toast.success('Material uploaded successfully!');
        setUploadModal(false);
        setMaterialData({ title: '', description: '', subject: '', class_name: '', material_type: 'PDF', tags: '', file: null });
        loadMaterials();
      } else {
        toast.error('Failed to upload material');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload material');
    }
  };

  const distributeToClass = async () => {
    if (!selectedMaterial || !selectedClass) {
      toast.error('Please select material and class');
      return;
    }
    
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:8000/api/materials/distribute-to-class', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          material_id: selectedMaterial.id,
          class_name: selectedClass,
          due_date: dueDate
        })
      });
      
      const data = await response.json();
      toast.success(data.message);
      setDistributeModal(false);
      loadMaterials();
    } catch (error) {
      console.error('Distribution error:', error);
      toast.error('Failed to distribute');
    }
  };

  const distributeBulk = async () => {
    if (!selectedMaterial || selectedStudents.length === 0) {
      toast.error('Please select material and students');
      return;
    }
    
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:8000/api/materials/distribute-bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          material_id: selectedMaterial.id,
          student_ids: selectedStudents,
          due_date: dueDate
        })
      });
      
      const data = await response.json();
      toast.success(data.message);
      setDistributeModal(false);
      setSelectedStudents([]);
      loadMaterials();
    } catch (error) {
      console.error('Distribution error:', error);
      toast.error('Failed to distribute');
    }
  };

  const loadStats = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:8000/api/materials/distribution-stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setStats(data);
      setViewStatsModal(true);
    } catch (error) {
      console.error('Failed to load stats:', error);
      toast.error('Failed to load stats');
    }
  };

  const classes = [...new Set(students.map(s => s.class_name))];

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-xl">Loading materials...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-auto p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Study Materials</h1>
            <p className="text-gray-600 mt-1">Upload, manage, and distribute learning resources</p>
          </div>
          <div className="flex space-x-3">
            <button onClick={loadStats} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center">
              <ChartBarIcon className="h-5 w-5 mr-2" />
              Statistics
            </button>
            <button onClick={() => setUploadModal(true)} className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center">
              <CloudArrowUpIcon className="h-5 w-5 mr-2" />
              Upload Material
            </button>
          </div>
        </div>

        {/* Materials Grid */}
        {materials.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-bold mb-2">No Materials Yet</h3>
            <p className="text-gray-600 mb-4">Click "Upload Material" to add your first study material</p>
            <button onClick={() => setUploadModal(true)} className="btn-primary">
              Upload First Material
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {materials.map(material => (
              <div key={material.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <DocumentIcon className="h-10 w-10 text-primary-600 mr-3" />
                    <div>
                      <h3 className="text-lg font-bold">{material.title}</h3>
                      <p className="text-sm text-gray-500">{material.subject} - Class {material.class_name}</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">{material.material_type}</span>
                </div>
                <p className="text-gray-600 text-sm mb-3">{material.description}</p>
                <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                  <span>📥 {material.total_downloads || 0} downloads</span>
                  <span>📅 {new Date(material.upload_date).toLocaleDateString()}</span>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => { setSelectedMaterial(material); setDistributeModal(true); }}
                    className="flex-1 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 flex items-center justify-center"
                  >
                    <UserGroupIcon className="h-5 w-5 mr-2" />
                    Distribute
                  </button>
                  <button 
                    onClick={() => { setSelectedMaterial(material); setWhatsappModal(true); }}
                    className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700"
                    title="Send via WhatsApp"
                  >
                    <DevicePhoneMobileIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* WhatsApp Broadcast Modal */}
        {whatsappModal && selectedMaterial && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4">Send via WhatsApp</h2>
              <p className="text-gray-600 mb-4">Material: <strong>{selectedMaterial.title}</strong></p>
              
              <div className="mb-4">
                <label className="block font-semibold mb-2">Send To</label>
                <div className="space-y-3">
                  <button 
                    onClick={() => broadcastToClassWhatsApp(selectedMaterial.id, selectedClass)}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                    disabled={whatsappLoading}
                  >
                    📱 Send to Entire Class
                  </button>
                  <div className="relative">
                    <select 
                      className="input-field w-full"
                      onChange={(e) => {
                        if (e.target.value) {
                          const student = students.find(s => s.id === parseInt(e.target.value));
                          if (student) {
                            sendViaWhatsApp(selectedMaterial.id, student.id, `${student.first_name} ${student.last_name}`, student.phone);
                          }
                        }
                      }}
                      disabled={whatsappLoading}
                    >
                      <option value="">Select Individual Student</option>
                      {students.map(s => (
                        <option key={s.id} value={s.id}>
                          {s.first_name} {s.last_name} - Class {s.class_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="bg-yellow-50 p-3 rounded-lg mb-4">
                <p className="text-sm text-yellow-800">
                  ℹ️ WhatsApp messages will be sent in demo mode. 
                  For production, configure WhatsApp Business API.
                </p>
              </div>
              
              <button onClick={() => setWhatsappModal(false)} className="btn-secondary w-full">
                Close
              </button>
            </div>
          </div>
        )}

        {/* Upload Modal */}
        {uploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 w-full max-w-md max-h-screen overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">Upload Study Material</h2>
              <form onSubmit={handleFileUpload}>
                <input type="text" placeholder="Title" className="input-field mb-3" 
                  value={materialData.title} onChange={e => setMaterialData({...materialData, title: e.target.value})} required />
                <textarea placeholder="Description" className="input-field mb-3" rows="3"
                  value={materialData.description} onChange={e => setMaterialData({...materialData, description: e.target.value})} />
                <input type="text" placeholder="Subject" className="input-field mb-3"
                  value={materialData.subject} onChange={e => setMaterialData({...materialData, subject: e.target.value})} required />
                <select className="input-field mb-3"
                  value={materialData.class_name} onChange={e => setMaterialData({...materialData, class_name: e.target.value})} required>
                  <option value="">Select Class</option>
                  {classes.map(c => <option key={c} value={c}>Class {c}</option>)}
                </select>
                <select className="input-field mb-3"
                  value={materialData.material_type} onChange={e => setMaterialData({...materialData, material_type: e.target.value})}>
                  <option value="PDF">PDF</option>
                  <option value="Video">Video</option>
                  <option value="Assignment">Assignment</option>
                  <option value="Notes">Notes</option>
                  <option value="Quiz">Quiz</option>
                </select>
                <input type="file" className="input-field mb-4" 
                  onChange={e => setMaterialData({...materialData, file: e.target.files[0]})} accept=".pdf,.mp4,.doc,.docx" />
                <div className="flex space-x-3">
                  <button type="submit" className="btn-primary flex-1">Upload</button>
                  <button type="button" onClick={() => setUploadModal(false)} className="btn-secondary flex-1">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Distribute Modal */}
        {distributeModal && selectedMaterial && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 w-full max-w-2xl max-h-screen overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">Distribute: {selectedMaterial?.title}</h2>
              
              <div className="mb-6">
                <label className="block font-semibold mb-2">Distribution Type</label>
                <div className="flex space-x-4">
                  <button onClick={() => setDistributionType('class')} 
                    className={`px-4 py-2 rounded ${distributionType === 'class' ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}>
                    Entire Class
                  </button>
                  <button onClick={() => setDistributionType('bulk')} 
                    className={`px-4 py-2 rounded ${distributionType === 'bulk' ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}>
                    Multiple Students
                  </button>
                </div>
              </div>
              
              {distributionType === 'class' && (
                <div className="mb-4">
                  <label className="block font-semibold mb-2">Select Class</label>
                  <select className="input-field" value={selectedClass} onChange={e => setSelectedClass(e.target.value)}>
                    <option value="">Select Class</option>
                    {classes.map(c => <option key={c} value={c}>Class {c}</option>)}
                  </select>
                  <p className="text-sm text-gray-500 mt-2">
                    This will distribute to all {students.filter(s => s.class_name === selectedClass).length} students in the class
                  </p>
                </div>
              )}
              
              {distributionType === 'bulk' && (
                <div className="mb-4">
                  <label className="block font-semibold mb-2">Select Students</label>
                  <div className="border rounded-lg p-4 max-h-60 overflow-y-auto">
                    {students.map(student => (
                      <label key={student.id} className="flex items-center space-x-2 mb-2">
                        <input type="checkbox" value={student.id} 
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedStudents([...selectedStudents, student.id]);
                            } else {
                              setSelectedStudents(selectedStudents.filter(id => id !== student.id));
                            }
                          }} />
                        <span>{student.first_name} {student.last_name} - Class {student.class_name}</span>
                      </label>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Selected: {selectedStudents.length} students</p>
                </div>
              )}
              
              <div className="mb-4">
                <label className="block font-semibold mb-2">Due Date (Optional)</label>
                <input type="date" className="input-field" value={dueDate} onChange={e => setDueDate(e.target.value)} />
              </div>
              
              <div className="flex space-x-3">
                <button onClick={distributionType === 'class' ? distributeToClass : distributeBulk} 
                  className="btn-primary flex-1">
                  Distribute
                </button>
                <button onClick={() => { setDistributeModal(false); setSelectedStudents([]); }} 
                  className="btn-secondary flex-1">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Statistics Modal */}
        {viewStatsModal && stats && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4">Distribution Statistics</h2>
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{stats.total_distributed || 0}</div>
                  <div className="text-gray-600">Total Materials Distributed</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{stats.completed || 0}</div>
                    <div className="text-gray-600">Completed</div>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">{stats.in_progress || 0}</div>
                    <div className="text-gray-600">In Progress</div>
                  </div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-lg font-semibold">Average Completion Rate</div>
                  <div className="text-2xl font-bold text-purple-600">{stats.average_completion_rate || 0}%</div>
                </div>
              </div>
              <button onClick={() => setViewStatsModal(false)} className="btn-primary w-full mt-6">Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyMaterials;
