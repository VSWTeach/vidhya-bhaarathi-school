import React, { useState, useEffect } from 'react';
import { EyeIcon, ChatBubbleLeftRightIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const ParentPortal = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:8000/api/students/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error('Failed to fetch students');
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedStudent) return;
    
    try {
      const token = localStorage.getItem('access_token');
      await fetch('http://localhost:8000/api/parent/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          student_id: selectedStudent.id,
          message: newMessage,
          parent_name: selectedStudent.parent_name
        })
      });
      setMessages([{ message: newMessage, sent_by: 'parent', created_at: new Date() }, ...messages]);
      setNewMessage('');
      toast.success('Message sent to teacher');
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Parent Portal</h1>
          <p className="text-gray-600 mt-1">Connect with teachers and track your child's progress</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Students List */}
        <div className="bg-white rounded-xl shadow-md p-4">
          <h2 className="text-lg font-bold mb-4">My Children</h2>
          <div className="space-y-3">
            {students.map(student => (
              <div
                key={student.id}
                onClick={() => setSelectedStudent(student)}
                className={`p-3 rounded-lg cursor-pointer transition ${
                  selectedStudent?.id === student.id
                    ? 'bg-blue-50 border border-blue-200'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <p className="font-semibold text-gray-800">{student.first_name} {student.last_name}</p>
                <p className="text-xs text-gray-500">Class {student.class_name} • Roll No: {student.roll_number}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Communication & Progress */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
          {selectedStudent ? (
            <>
              <div className="flex items-center justify-between mb-6 pb-4 border-b">
                <div>
                  <h2 className="text-xl font-bold">{selectedStudent.first_name} {selectedStudent.last_name}</h2>
                  <p className="text-sm text-gray-500">Class {selectedStudent.class_name} - Section {selectedStudent.section}</p>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 bg-blue-100 rounded-lg">
                    <DocumentTextIcon className="h-5 w-5 text-blue-600" />
                  </button>
                  <button className="p-2 bg-green-100 rounded-lg">
                    <EyeIcon className="h-5 w-5 text-green-600" />
                  </button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">85%</p>
                  <p className="text-xs text-gray-600">Attendance</p>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">A-</p>
                  <p className="text-xs text-gray-600">Overall Grade</p>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <p className="text-2xl font-bold text-yellow-600">12</p>
                  <p className="text-xs text-gray-600">Assignments</p>
                </div>
              </div>

              {/* Message Thread */}
              <div className="border rounded-lg p-4 h-80 overflow-y-auto mb-4">
                <div className="space-y-3">
                  {messages.length === 0 && (
                    <p className="text-center text-gray-500 py-8">No messages yet. Start a conversation with the teacher.</p>
                  )}
                  {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.sent_by === 'parent' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] p-3 rounded-lg ${
                        msg.sent_by === 'parent'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        <p className="text-sm">{msg.message}</p>
                        <p className="text-xs mt-1 opacity-75">{new Date(msg.created_at).toLocaleTimeString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Message Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button
                  onClick={sendMessage}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  <ChatBubbleLeftRightIcon className="h-5 w-5" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-96 text-gray-500">
              Select a student to view details and communicate with teachers
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParentPortal;
