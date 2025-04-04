import { useState } from 'react';
import { 
  FiHome, 
  FiMap, 
  FiTrendingUp, 
  FiUsers, 
  FiSettings,
  FiAlertCircle,
  FiBarChart2,
  FiZap,
  FiDroplet,
  FiSun
} from 'react-icons/fi';

import OverviewTab from './OverviewTab';
import UrbanPlanningTab from './UrbanPlanningTab';
import EnergyTab from './EnergyTab';
import WaterTab from './WaterTab';
import TrafficTab from './TrafficTab';
import ServicesTab from './ServicesTab';
import EmergencyTab from './EmergencyTab';
import SettingsTab from './SettingsTab';
import Maps from './Maps';

const SmartCityDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-blue-800 text-white transition-all duration-300`}>
        <div className="p-4 flex items-center justify-between">
          {sidebarOpen ? (
            <h1 className="text-xl font-bold">SmartCity Planner</h1>
          ) : (
            <h1 className="text-xl font-bold">SC</h1>
          )}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 rounded-lg hover:bg-blue-700"
          >
            {sidebarOpen ? '«' : '»'}
          </button>
        </div>
        
        <nav className="mt-8">
          <NavItem 
            icon={<FiHome />} 
            text="Overview" 
            active={activeTab === 'overview'} 
            onClick={() => setActiveTab('overview')}
            sidebarOpen={sidebarOpen}
          />
          <NavItem 
            icon={<FiMap />} 
            text="Urban Planning" 
            active={activeTab === 'urban'} 
            onClick={() => setActiveTab('urban')}
            sidebarOpen={sidebarOpen}
          />
           <NavItem 
            icon={<FiZap />} 
            text="Maps" 
            active={activeTab === 'maps'} 
            onClick={() => setActiveTab('maps')}
            sidebarOpen={sidebarOpen}
          />
          <NavItem 
            icon={<FiZap />} 
            text="Energy" 
            active={activeTab === 'energy'} 
            onClick={() => setActiveTab('energy')}
            sidebarOpen={sidebarOpen}
          />
          <NavItem 
            icon={<FiDroplet />} 
            text="Water" 
            active={activeTab === 'water'} 
            onClick={() => setActiveTab('water')}
            sidebarOpen={sidebarOpen}
          />
          <NavItem 
            icon={<FiBarChart2 />} 
            text="Traffic" 
            active={activeTab === 'traffic'} 
            onClick={() => setActiveTab('traffic')}
            sidebarOpen={sidebarOpen}
          />
          <NavItem 
            icon={<FiUsers />} 
            text="Citizen Services" 
            active={activeTab === 'services'} 
            onClick={() => setActiveTab('services')}
            sidebarOpen={sidebarOpen}
          />
          <NavItem 
            icon={<FiAlertCircle />} 
            text="Emergency" 
            active={activeTab === 'emergency'} 
            onClick={() => setActiveTab('emergency')}
            sidebarOpen={sidebarOpen}
          />
          <NavItem 
            icon={<FiSettings />} 
            text="Settings" 
            active={activeTab === 'settings'} 
            onClick={() => setActiveTab('settings')}
            sidebarOpen={sidebarOpen}
          />
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800 capitalize">
            {activeTab.replace('-', ' ')}
          </h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <svg 
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
              AD
            </div>
          </div>
        </header>

        <main className="p-6">
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'urban' && <UrbanPlanningTab />}
          {activeTab === 'maps' && <Maps />}
          {activeTab === 'energy' && <EnergyTab />}
          {activeTab === 'water' && <WaterTab />}
          {activeTab === 'traffic' && <TrafficTab />}
          {activeTab === 'services' && <ServicesTab />}
          {activeTab === 'emergency' && <EmergencyTab />}
          {activeTab === 'settings' && <SettingsTab />}
        </main>
      </div>
    </div>
  );
};

const NavItem = ({ icon, text, active, onClick, sidebarOpen }) => {
  return (
    <div 
      onClick={onClick}
      className={`flex items-center p-4 cursor-pointer ${active ? 'bg-blue-700' : 'hover:bg-blue-700'}`}
    >
      <div className="text-xl">{icon}</div>
      {sidebarOpen && <span className="ml-3">{text}</span>}
    </div>
  );
};

export default SmartCityDashboard;