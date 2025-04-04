import { FiAlertTriangle, FiActivity, FiClock } from 'react-icons/fi';

const EmergencyTab = () => {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-6">Emergency Management</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <MetricCard 
          title="Active Incidents" 
          value="12" 
          change="+2" 
          icon={<FiAlertTriangle className="text-red-500" />}
        />
        <MetricCard 
          title="Avg. Response Time" 
          value="8.2 min" 
          change="-0.5" 
          icon={<FiClock className="text-yellow-500" />}
        />
        <MetricCard 
          title="Resolved Today" 
          value="23" 
          change="+3" 
          icon={<FiActivity className="text-green-500" />}
        />
        <MetricCard 
          title="Resources Deployed" 
          value="18" 
          change="+4" 
          icon={<FiActivity className="text-blue-500" />}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-xl shadow-sm lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-medium">Emergency Map</h4>
            <select className="border rounded-lg px-3 py-1">
              <option>All Incidents</option>
              <option>Medical</option>
              <option>Fire</option>
              <option>Police</option>
            </select>
          </div>
          <div className="h-80 bg-gray-200 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Emergency Map Visualization</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h4 className="text-lg font-medium mb-4">Active Incidents</h4>
          <div className="space-y-4">
            <EmergencyIncident 
              type="Medical" 
              location="Central District" 
              level="High"
            />
            <EmergencyIncident 
              type="Fire" 
              location="Industrial Zone" 
              level="Critical"
            />
            <EmergencyIncident 
              type="Police" 
              location="North District" 
              level="Medium"
            />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h4 className="text-lg font-medium mb-4">Emergency Resources</h4>
          <div className="grid grid-cols-2 gap-4">
            <ResourceStatus 
              type="Ambulances" 
              available="12/15" 
              status="Normal"
            />
            <ResourceStatus 
              type="Fire Trucks" 
              available="8/10" 
              status="Normal"
            />
            <ResourceStatus 
              type="Police Units" 
              available="22/30" 
              status="Strained"
            />
            <ResourceStatus 
              type="Helicopters" 
              available="2/3" 
              status="Normal"
            />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h4 className="text-lg font-medium mb-4">Emergency Protocols</h4>
          <div className="space-y-3">
            <ProtocolItem 
              title="Evacuation Plan A" 
              lastDrill="2 months ago"
            />
            <ProtocolItem 
              title="Medical Emergency" 
              lastDrill="1 month ago"
            />
            <ProtocolItem 
              title="Natural Disaster" 
              lastDrill="3 months ago"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ title, value, change, icon }) => {
  const isPositive = typeof change === 'string' ? change.startsWith('+') : change > 0;
  
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
        {typeof change === 'string' ? change : (isPositive ? `+${change}` : change)}
      </p>
    </div>
  );
};

const EmergencyIncident = ({ type, location, level }) => {
  const getLevelColor = () => {
    switch(level.toLowerCase()) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getTypeIcon = () => {
    switch(type.toLowerCase()) {
      case 'medical': return '🚑';
      case 'fire': return '🚒';
      case 'police': return '🚓';
      default: return '⚠️';
    }
  };
  
  return (
    <div className="flex items-start">
      <div className="text-xl mr-2">{getTypeIcon()}</div>
      <div className="flex-1">
        <p className="font-medium">{location}</p>
        <div className="flex justify-between items-center mt-1">
          <span className="text-sm text-gray-500 capitalize">{type}</span>
          <span className={`px-2 py-1 rounded-md text-xs ${getLevelColor()}`}>
            {level.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
};

const ResourceStatus = ({ type, available, status }) => {
  const getStatusColor = () => {
    switch(status.toLowerCase()) {
      case 'normal': return 'bg-green-100 text-green-800';
      case 'strained': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="bg-gray-50 p-3 rounded-lg">
      <h5 className="font-medium">{type}</h5>
      <div className="flex justify-between items-center mt-2">
        <span className="font-bold">{available}</span>
        <span className={`px-2 py-1 rounded-md text-xs ${getStatusColor()}`}>
          {status}
        </span>
      </div>
    </div>
  );
};

const ProtocolItem = ({ title, lastDrill }) => {
  return (
    <div className="border-b pb-3 last:border-0 last:pb-0">
      <h5 className="font-medium">{title}</h5>
      <p className="text-gray-500 text-sm mt-1">Last drill: {lastDrill}</p>
      <button className="mt-2 text-sm text-blue-500 hover:text-blue-700">
        View Protocol →
      </button>
    </div>
  );
};

export default EmergencyTab;