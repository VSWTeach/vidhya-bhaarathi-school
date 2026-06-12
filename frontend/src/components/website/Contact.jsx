import React, { useState } from 'react';
import toast from 'react-hot-toast';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Message sent successfully!');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-8">Contact Us</h1>
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
          <p className="mb-2">📍 123 Education Street, New Delhi - 110001</p>
          <p className="mb-2">📞 +91 1234567890</p>
          <p className="mb-2">✉️ info@vidyabharati.edu.in</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" placeholder="Your Name" className="input-field" 
              value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
            <input type="email" placeholder="Your Email" className="input-field" 
              value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
            <textarea rows="4" placeholder="Your Message" className="input-field" 
              value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} required />
            <button type="submit" className="btn-primary w-full">Send Message</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
