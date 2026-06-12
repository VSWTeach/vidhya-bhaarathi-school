import React, { useState } from 'react';
import toast from 'react-hot-toast';

const Admissions = () => {
  const [formData, setFormData] = useState({ name: '', parentName: '', phone: '', email: '', class: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Inquiry submitted successfully! We will contact you soon.');
    setFormData({ name: '', parentName: '', phone: '', email: '', class: '' });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-8">Admissions Open 2025-26</h1>
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Student Name" className="input-field" 
            value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
          <input type="text" placeholder="Parent Name" className="input-field" 
            value={formData.parentName} onChange={e => setFormData({...formData, parentName: e.target.value})} required />
          <input type="tel" placeholder="Phone" className="input-field" 
            value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required />
          <input type="email" placeholder="Email" className="input-field" 
            value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
          <select className="input-field" value={formData.class} onChange={e => setFormData({...formData, class: e.target.value})} required>
            <option value="">Select Class</option>
            <option>LKG</option><option>UKG</option><option>1</option><option>2</option><option>3</option>
            <option>4</option><option>5</option><option>6</option><option>7</option><option>8</option>
            <option>9</option><option>10</option><option>11</option><option>12</option>
          </select>
          <button type="submit" className="btn-primary w-full">Submit Inquiry</button>
        </form>
      </div>
    </div>
  );
};

export default Admissions;
