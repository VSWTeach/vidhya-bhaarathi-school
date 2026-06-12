import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Home from './components/website/Home';
import About from './components/website/About';
import Admissions from './components/website/Admissions';
import Contact from './components/website/Contact';
import Login from './components/admin/Login';
import Dashboard from './components/admin/Dashboard';
import StudentLogin from './components/student/Login';
import StudentDashboard from './components/student/Dashboard';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('access_token');
  return token ? children : <Navigate to="/admin/login" replace />;
};

function App() {
  return (
    <HelmetProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<><Navbar /><Home /><Footer /></>} />
          <Route path="/about" element={<><Navbar /><About /><Footer /></>} />
          <Route path="/admissions" element={<><Navbar /><Admissions /><Footer /></>} />
          <Route path="/contact" element={<><Navbar /><Contact /><Footer /></>} />
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/student/login" element={<StudentLogin />} />
          <Route path="/student/dashboard" element={<StudentDashboard />} />
        </Routes>
      </Router>
    </HelmetProvider>
  );
}

export default App;