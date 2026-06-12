import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { getStudents } from '../../services/api';
import toast from 'react-hot-toast';
import { DevicePhoneMobileIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';

const WhatsAppPanel = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState(null);

  useEffect(() => {
    loadStudents();
    loadStatus();
  }, []);

  const loadStudents = async () => {
    try {
      const data = await getStudents();
      setStudents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load students:', error);
    }
  };

  const loadStatus = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:8000/api/whatsapp/status', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setStatus(data);
      }
    } catch (error) {
      console.error('Failed to load status:', error);
    }
  };

  const sendCustomMessage = async () => {
    if (!message) {
      toast.error('Please enter a message');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');

      if (selectedStudents.length > 0) {
        for (const studentId of selectedStudents) {
          const student = students.find(s => s.id === studentId);
          if (student?.phone) {
            await fetch('http://localhost:8000/api/whatsapp/send', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                phone: student.phone,
                message: message
              })
            });
          }
        }
        toast.success(`Messages sent to ${selectedStudents.length} students`);
      } else if (selectedClass) {
        const response = await fetch('http://localhost:8000/api/whatsapp/broadcast-to-class', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            class_name: selectedClass,
            message: message
          })
        });
        const data = await response.json();
        toast.success(data.message);
      } else {
        toast.error('Please select students or a class');
      }
      
      setMessage('');
      setSelectedStudents([]);
    } catch (error) {
      console.error('Send error:', error);
      toast.error('Failed to send messages');
    } finally {
      setLoading(false);
    }
  };

  const testWhatsApp = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:8000/api/whatsapp/test', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        toast.success('Test message sent! Check console for demo output');
      } else {
        toast.error('Test failed');
      }
    } catch (error) {
      toast.error('Test failed');
    } finally {
      setLoading(false);
    }
  };

  const classes = [...new Set(students.map(s => s.class_name))];

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-auto p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">WhatsApp Integration</h1>
            <p className="text-gray-600 mt-1">Send notifications and alerts via WhatsApp</p>
          </div>
          <button onClick={testWhatsApp} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
            Test WhatsApp
          </button>
        </div>

        {status && (
          <div className="p-4 rounded-lg mb-6 bg-yellow-50 border border-yellow-200">
            <div className="flex items-center">
              <DevicePhoneMobileIcon className="h-6 w-6 text-yellow-600 mr-2" />
              <div>
                <h3 className="font-semibold text-yellow-800">
                  ⚠️ Demo Mode
                </h3>
                <p className="text-sm text-gray-600">Messages will appear in console for testing</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <label className="block font-semibold mb-2">Target Audience</label>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <select 
                  className="input-field"
                  value={selectedClass}
                  onChange={(e) => {
                    setSelectedClass(e.target.value);
                    setSelectedStudents([]);
                  }}
                >
                  <option value="">Select Class (All Students)</option>
                  {classes.map(c => (
                    <option key={c} value={c}>Class {c}</option>
                  ))}
                </select>
              </div>
              <div>
                <select 
                  className="input-field"
                  multiple
                  value={selectedStudents}
                  onChange={(e) => {
                    const values = Array.from(e.target.selectedOptions, option => parseInt(option.value));
                    setSelectedStudents(values);
                    if (values.length > 0) setSelectedClass('');
                  }}
                  size={3}
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.first_name} {s.last_name} - Class {s.class_name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">Hold Ctrl to select multiple students</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="block font-semibold mb-2">Message</label>
            <textarea
              rows={6}
              className="input-field"
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <button
            onClick={sendCustomMessage}
            disabled={loading || (!message || (!selectedStudents.length && !selectedClass))}
            className="btn-primary flex items-center justify-center w-full md:w-auto"
          >
            <PaperAirplaneIcon className="h-5 w-5 mr-2" />
            {loading ? 'Sending...' : 'Send Message'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppPanel;
