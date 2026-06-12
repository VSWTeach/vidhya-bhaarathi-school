import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import OverviewModule from './modules/OverviewModule';
import StudentsModule from './modules/StudentsModule';
import FeesModule from './modules/FeesModule';
import StudyMaterialsModule from './modules/StudyMaterialsModule';

const Dashboard = () => {
  const [activeModule, setActiveModule] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const adminData = localStorage.getItem('admin');
    
    if (!token) {
      window.location.href = '/admin/login';
      return;
    }
    
    if (adminData) {
      setAdmin(JSON.parse(adminData));
    }
  }, []);

  const renderContent = () => {
    switch(activeModule) {
      case 'overview': return <OverviewModule />;
      case 'students': return <StudentsModule />;
      case 'fees': return <FeesModule />;
      case 'materials': return <StudyMaterialsModule />;
      default: return <OverviewModule />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar 
        activeModule={activeModule}
        setActiveModule={setActiveModule}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        admin={admin}
      />
      
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'} overflow-y-auto`}>
        <div className="p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
