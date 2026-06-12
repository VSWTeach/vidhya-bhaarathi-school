import React from 'react';
import { 
  HomeIcon, UsersIcon, CurrencyRupeeIcon, DocumentTextIcon, 
  ChartBarIcon, AcademicCapIcon, XMarkIcon, Bars3Icon, ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline';

const Sidebar = ({ activeModule, setActiveModule, sidebarOpen, setSidebarOpen, admin }) => {
  const menuItems = [
    { id: 'overview', name: 'Dashboard', icon: <HomeIcon className="h-5 w-5" /> },
    { id: 'students', name: 'Students', icon: <UsersIcon className="h-5 w-5" /> },
    { id: 'fees', name: 'Fees', icon: <CurrencyRupeeIcon className="h-5 w-5" /> },
    { id: 'materials', name: 'Study Materials', icon: <DocumentTextIcon className="h-5 w-5" /> },
    { id: 'reports', name: 'Reports', icon: <ChartBarIcon className="h-5 w-5" /> }
  ];

  return (
    <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gray-900 text-white transition-all duration-300 flex flex-col fixed h-full z-20`}>
      <div className="p-4 border-b border-gray-800 flex justify-between items-center">
        {sidebarOpen && (
          <div className="flex items-center gap-2">
            <AcademicCapIcon className="h-8 w-8 text-blue-400" />
            <div>
              <h1 className="font-bold">Vidya Bharati</h1>
              <p className="text-xs text-gray-400">ERP System</p>
            </div>
          </div>
        )}
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 hover:bg-gray-800 rounded">
          {sidebarOpen ? <XMarkIcon className="h-5 w-5" /> : <Bars3Icon className="h-5 w-5" />}
        </button>
      </div>
      
      <nav className="flex-1 py-4">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveModule(item.id)}
            className={`w-full flex items-center ${sidebarOpen ? 'px-4' : 'justify-center'} py-3 my-1 transition-colors ${activeModule === item.id ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
          >
            <div className="h-5 w-5">{item.icon}</div>
            {sidebarOpen && <span className="ml-3 text-sm">{item.name}</span>}
          </button>
        ))}
      </nav>
      
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-sm font-bold">{admin?.full_name?.charAt(0) || 'A'}</span>
          </div>
          {sidebarOpen && (
            <div className="flex-1 text-left">
              <p className="text-sm font-medium">{admin?.full_name || 'Admin'}</p>
              <p className="text-xs text-gray-400">Administrator</p>
            </div>
          )}
          <button onClick={() => { localStorage.clear(); window.location.href = '/admin/login'; }} className="p-1 hover:bg-gray-800 rounded">
            <ArrowLeftOnRectangleIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
