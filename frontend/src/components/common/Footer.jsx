import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [schoolInfo, setSchoolInfo] = useState({
    name: 'Vidya Bharati Public School',
    contact: {
      address: '123 Education Street, Civil Lines, New Delhi - 110001',
      phone: '+91 1234567890',
      email: 'info@vidyabharati.edu.in'
    }
  });

  useEffect(() => {
    fetchSchoolInfo();
  }, []);

  const fetchSchoolInfo = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const response = await fetch('http://localhost:8000/api/school/school-info', {
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        setSchoolInfo(data);
      }
    } catch (error) {
      console.log('Using default school info');
    }
  };

  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">{schoolInfo.name}</h3>
            <p className="text-gray-400 text-sm">
              विद्या परम भूषणम्<br />
              Knowledge is the Ultimate Ornament
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link to="/about" className="hover:text-white">About Us</Link></li>
              <li><Link to="/admissions" className="hover:text-white">Admissions</Link></li>
              <li><Link to="/academics" className="hover:text-white">Academics</Link></li>
              <li><Link to="/gallery" className="hover:text-white">Gallery</Link></li>
              <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Contact Info</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>📍 {schoolInfo.contact?.address || '123 Education Street, New Delhi'}</li>
              <li>📞 {schoolInfo.contact?.phone || '+91 1234567890'}</li>
              <li>✉️ {schoolInfo.contact?.email || 'info@vidyabharati.edu.in'}</li>
              <li>🕐 School: 8:00 AM - 2:30 PM</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-500">Facebook</a>
              <a href="#" className="text-gray-400 hover:text-blue-400">Twitter</a>
              <a href="#" className="text-gray-400 hover:text-pink-500">Instagram</a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; 2024 {schoolInfo.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
