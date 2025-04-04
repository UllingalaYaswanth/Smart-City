import { FiUser, FiLock, FiBell, FiDatabase } from 'react-icons/fi';

const SettingsTab = () => {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-6">Settings</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm lg:col-span-2">
          <h4 className="text-lg font-medium mb-4">Account Settings</h4>
          
          <div className="space-y-6">
            <SettingItem 
              icon={<FiUser className="text-blue-500" />}
              title="Profile Information"
              description="Update your name, email and other profile details"
            />
            <SettingItem 
              icon={<FiLock className="text-red-500" />}
              title="Password & Security"
              description="Change password and manage security settings"
            />
            <SettingItem 
              icon={<FiBell className="text-yellow-500" />}
              title="Notifications"
              description="Configure how you receive notifications"
            />
            <SettingItem 
              icon={<FiDatabase className="text-green-500" />}
              title="Data Preferences"
              description="Manage your data sharing preferences"
            />
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h4 className="text-lg font-medium mb-4">System Preferences</h4>
            <div className="space-y-4">
              <ToggleSetting 
                title="Dark Mode" 
                enabled={false} 
              />
              <ToggleSetting 
                title="High Contrast Mode" 
                enabled={false} 
              />
              <ToggleSetting 
                title="Auto-refresh Data" 
                enabled={true} 
              />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h4 className="text-lg font-medium mb-4">Dashboard Configuration</h4>
            <div className="space-y-3">
              <SelectSetting 
                title="Default View" 
                options={['Overview', 'Urban Planning', 'Traffic']} 
              />
              <SelectSetting 
                title="Data Refresh Rate" 
                options={['5 minutes', '15 minutes', '30 minutes', '1 hour']} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SettingItem = ({ icon, title, description }) => {
  return (
    <div className="flex items-start">
      <div className="p-2 rounded-lg bg-blue-50 text-blue-500 mr-4">
        {icon}
      </div>
      <div className="flex-1">
        <h5 className="font-medium">{title}</h5>
        <p className="text-gray-500 text-sm mt-1">{description}</p>
      </div>
      <button className="text-blue-500 hover:text-blue-700">
        Edit
      </button>
    </div>
  );
};

const ToggleSetting = ({ title, enabled }) => {
  return (
    <div className="flex justify-between items-center">
      <span className="font-medium">{title}</span>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" className="sr-only peer" defaultChecked={enabled} />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
      </label>
    </div>
  );
};

const SelectSetting = ({ title, options }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{title}</label>
      <select className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
        {options.map((option, index) => (
          <option key={index}>{option}</option>
        ))}
      </select>
    </div>
  );
};

export default SettingsTab;