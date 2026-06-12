import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [schoolName, setSchoolName] = useState('Vidya Bharati Public School');

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
        setSchoolName(data.name);
      }
    } catch (error) {
      console.log('Using default school name');
    }
  };

  const menuItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Academics', path: '/academics' },
    { name: 'Admissions', path: '/admissions' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Events', path: '/events' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="bg-gradient-to-r from-blue-900 to-blue-700 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-3xl">🏫</div>
            <div>
              <div className="text-xl font-bold">{schoolName}</div>
              <div className="text-xs text-blue-200">विद्या परम भूषणम्</div>
            </div>
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 items-center">
            {menuItems.map(item => (
              <Link key={item.path} to={item.path} className="hover:text-blue-200 transition">
                {item.name}
              </Link>
            ))}
            
            {/* Student Login Button - NEW */}
            <Link 
              to="/student/login" 
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-semibold"
            >
              👨‍🎓 Student Login
            </Link>
            
            {/* Admin Login Button */}
            <Link 
              to="/admin/login" 
              className="bg-yellow-500 text-blue-900 px-4 py-2 rounded-lg hover:bg-yellow-400 transition font-semibold"
            >
              Admin Login
            </Link>
          </div>
          
          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-blue-800">
            {menuItems.map(item => (
              <Link key={item.path} to={item.path} className="block py-2 hover:text-blue-200" onClick={() => setIsOpen(false)}>
                {item.name}
              </Link>
            ))}
            <Link 
              to="/student/login" 
              className="block mt-2 bg-green-600 text-white px-4 py-2 rounded-lg text-center hover:bg-green-700"
              onClick={() => setIsOpen(false)}
            >
              👨‍🎓 Student Login
            </Link>
            <Link 
              to="/admin/login" 
              className="block mt-2 bg-yellow-500 text-blue-900 px-4 py-2 rounded-lg text-center hover:bg-yellow-400"
              onClick={() => setIsOpen(false)}
            >
              Admin Login
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
