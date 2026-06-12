import React, { useState } from 'react';
import { EnvelopeIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const EmailNotifications = () => {
  const [emailConfig, setEmailConfig] = useState({
    smtp_host: 'smtp.gmail.com',
    smtp_port: 587,
    smtp_user: '',
    smtp_password: '',
    from_email: 'noreply@vidyabharati.edu.in'
  });

  const [testEmail, setTestEmail] = useState('');
  const [sending, setSending] = useState(false);

  const handleSaveConfig = async () => {
    toast.success('Email configuration saved!');
  };

  const handleSendTest = async () => {
    if (!testEmail) {
      toast.error('Please enter test email address');
      return;
    }
    setSending(true);
    setTimeout(() => {
      setSending(false);
      toast.success('Test email sent successfully!');
    }, 1500);
  };

  const notificationTemplates = [
    { id: 'fee_reminder', name: 'Fee Reminder', subject: 'Fee Payment Due', enabled: true },
    { id: 'exam_schedule', name: 'Exam Schedule', subject: 'Upcoming Examinations', enabled: true },
    { id: 'event_notification', name: 'Event Notification', subject: 'School Event Update', enabled: false },
    { id: 'result_published', name: 'Result Published', subject: 'Exam Results Available', enabled: true },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <EnvelopeIcon className="h-6 w-6" />
          Email Configuration
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Host</label>
            <input
              type="text"
              value={emailConfig.smtp_host}
              onChange={(e) => setEmailConfig({...emailConfig, smtp_host: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Port</label>
            <input
              type="number"
              value={emailConfig.smtp_port}
              onChange={(e) => setEmailConfig({...emailConfig, smtp_port: parseInt(e.target.value)})}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Username</label>
            <input
              type="email"
              value={emailConfig.smtp_user}
              onChange={(e) => setEmailConfig({...emailConfig, smtp_user: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Password</label>
            <input
              type="password"
              value={emailConfig.smtp_password}
              onChange={(e) => setEmailConfig({...emailConfig, smtp_password: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">From Email</label>
            <input
              type="email"
              value={emailConfig.from_email}
              onChange={(e) => setEmailConfig({...emailConfig, from_email: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleSaveConfig}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Save Configuration
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-bold mb-4">Send Test Email</h3>
        <div className="flex gap-4">
          <input
            type="email"
            placeholder="test@example.com"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            className="flex-1 px-3 py-2 border rounded-lg"
          />
          <button
            onClick={handleSendTest}
            disabled={sending}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
          >
            <PaperAirplaneIcon className="h-4 w-4" />
            {sending ? 'Sending...' : 'Send Test'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-bold mb-4">Notification Templates</h3>
        <div className="space-y-3">
          {notificationTemplates.map(template => (
            <div key={template.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-800">{template.name}</p>
                <p className="text-xs text-gray-500">{template.subject}</p>
              </div>
              <span className={`px-3 py-1 rounded text-sm ${
                template.enabled
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {template.enabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmailNotifications;
