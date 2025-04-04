import { FiUsers, FiZap, FiDroplet, FiSun, FiAlertCircle } from 'react-icons/fi';

const OverviewTab = () => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <MetricCard 
          title="Population" 
          value="1.2M" 
          change="+2.3%" 
          icon={<FiUsers className="text-blue-500" />}
        />
        <MetricCard 
          title="Energy Usage" 
          value="4.2GW" 
          change="-1.1%" 
          icon={<FiZap className="text-green-500" />}
        />
        <MetricCard 
          title="Water Consumption" 
          value="120ML" 
          change="+0.8%" 
          icon={<FiDroplet className="text-blue-400" />}
        />
        <MetricCard 
          title="Air Quality" 
          value="Good" 
          change="+5%" 
          icon={<FiSun className="text-yellow-500" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-xl shadow-sm lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">City Map Overview</h3>
          <div className="h-80 bg-gray-200 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Interactive City Map Visualization</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Recent Alerts</h3>
          <div className="space-y-4">
            <AlertItem 
              type="traffic" 
              title="Heavy traffic on Main St" 
              time="15 min ago"
            />
            <AlertItem 
              type="power" 
              title="Power outage in District 5" 
              time="1 hour ago"
            />
            <AlertItem 
              type="water" 
              title="Water pipe repair scheduled" 
              time="3 hours ago"
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Key Performance Indicators</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPIItem 
            title="Public Transport Usage" 
            value="68%" 
            target="75%"
          />
          <KPIItem 
            title="Renewable Energy" 
            value="42%" 
            target="50%"
          />
          <KPIItem 
            title="Recycling Rate" 
            value="55%" 
            target="60%"
          />
          <KPIItem 
            title="Green Spaces" 
            value="18%" 
            target="20%"
          />
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ title, value, change, icon }) => {
  const isPositive = change.startsWith('+');
  
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex justify-between">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
          {icon}
        </div>
      </div>
      <p className={`mt-3 text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
        {change} from last month
      </p>
    </div>
  );
};

const AlertItem = ({ type, title, time }) => {
  const getColor = () => {
    switch(type) {
      case 'traffic': return 'bg-yellow-100 text-yellow-800';
      case 'power': return 'bg-red-100 text-red-800';
      case 'water': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="flex items-start">
      <div className={`px-2 py-1 rounded-md text-xs ${getColor()}`}>
        {type.toUpperCase()}
      </div>
      <div className="ml-3 flex-1">
        <p className="font-medium">{title}</p>
        <p className="text-gray-500 text-sm">{time}</p>
      </div>
    </div>
  );
};

const KPIItem = ({ title, value, target }) => {
  const percentage = parseInt(value);
  const targetPercentage = parseInt(target);
  const progress = (percentage / targetPercentage) * 100;
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
      <h4 className="font-medium text-gray-700">{title}</h4>
      <div className="flex items-end mt-2">
        <span className="text-2xl font-bold">{value}</span>
        <span className="text-gray-500 ml-1">/ {target} target</span>
      </div>
      <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full ${progress >= 90 ? 'bg-green-500' : progress >= 70 ? 'bg-blue-500' : 'bg-yellow-500'}`}
          style={{width: `${Math.min(progress, 100)}%`}}
        ></div>
      </div>
    </div>
  );
};

export default OverviewTab;