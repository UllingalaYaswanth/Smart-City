import { FiBarChart2, FiAlertCircle, FiClock } from 'react-icons/fi';

const TrafficTab = () => {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-6">Traffic Management</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <MetricCard 
          title="Average Speed" 
          value="32 km/h" 
          change="-1.2%" 
          icon={<FiBarChart2 className="text-blue-500" />}
        />
        <MetricCard 
          title="Congestion Level" 
          value="Medium" 
          change="+3.1%" 
          icon={<FiAlertCircle className="text-yellow-500" />}
        />
        <MetricCard 
          title="Public Transport Usage" 
          value="68%" 
          change="+2.8%" 
          icon={<FiBarChart2 className="text-green-500" />}
        />
        <MetricCard 
          title="Average Delay" 
          value="4.2 min" 
          change="-0.5%" 
          icon={<FiClock className="text-red-500" />}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-xl shadow-sm lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-medium">Traffic Heatmap</h4>
            <select className="border rounded-lg px-3 py-1">
              <option>Current</option>
              <option>Peak Hours</option>
              <option>Weekday Average</option>
              <option>Weekend Average</option>
            </select>
          </div>
          <div className="h-80 bg-gray-200 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Traffic Heatmap Visualization</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h4 className="text-lg font-medium mb-4">Traffic Incidents</h4>
          <div className="space-y-4">
            <TrafficIncident 
              type="accident" 
              location="Main St & 3rd Ave" 
              impact="High"
            />
            <TrafficIncident 
              type="construction" 
              location="Highway 5 Northbound" 
              impact="Medium"
            />
            <TrafficIncident 
              type="event" 
              location="Downtown Convention Center" 
              impact="Low"
            />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h4 className="text-lg font-medium mb-4">Peak Hour Analysis</h4>
          <div className="h-64 flex items-center justify-center">
            <div className="w-full">
              <div className="flex justify-between mb-1">
                <span>7-9 AM</span>
                <span>42%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div className="bg-blue-500 h-4 rounded-full" style={{width: '42%'}}></div>
              </div>
              
              <div className="flex justify-between mb-1 mt-4">
                <span>12-2 PM</span>
                <span>28%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div className="bg-blue-500 h-4 rounded-full" style={{width: '28%'}}></div>
              </div>
              
              <div className="flex justify-between mb-1 mt-4">
                <span>5-7 PM</span>
                <span>56%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div className="bg-blue-500 h-4 rounded-full" style={{width: '56%'}}></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h4 className="text-lg font-medium mb-4">Public Transport Status</h4>
          <div className="grid grid-cols-2 gap-4">
            <TransportStatus 
              mode="Subway" 
              status="Normal" 
              delays="2%"
            />
            <TransportStatus 
              mode="Buses" 
              status="Minor Delays" 
              delays="12%"
            />
            <TransportStatus 
              mode="Trams" 
              status="Normal" 
              delays="3%"
            />
            <TransportStatus 
              mode="Ferries" 
              status="On Time" 
              delays="0%"
            />
          </div>
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

const TrafficIncident = ({ type, location, impact }) => {
  const getImpactColor = () => {
    switch(impact.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getTypeIcon = () => {
    switch(type.toLowerCase()) {
      case 'accident': return '🚗💥';
      case 'construction': return '🚧';
      case 'event': return '🎪';
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
          <span className={`px-2 py-1 rounded-md text-xs ${getImpactColor()}`}>
            {impact.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
};

const TransportStatus = ({ mode, status, delays }) => {
  const getStatusColor = () => {
    switch(status.toLowerCase()) {
      case 'normal': return 'bg-green-100 text-green-800';
      case 'minor delays': return 'bg-yellow-100 text-yellow-800';
      case 'major delays': return 'bg-red-100 text-red-800';
      case 'on time': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="bg-gray-50 p-3 rounded-lg">
      <h5 className="font-medium">{mode}</h5>
      <div className="flex justify-between items-center mt-2">
        <span className={`px-2 py-1 rounded-md text-xs ${getStatusColor()}`}>
          {status}
        </span>
        <span className="text-sm font-medium">{delays}</span>
      </div>
    </div>
  );
};

export default TrafficTab;

// import { FiBarChart2, FiAlertTriangle, FiClock, FiMap } from 'react-icons/fi';
// import { FaCar, FaBus, FaSubway, FaTrafficLight } from 'react-icons/fa';

// const TrafficTab = () => {
//   return (
//     <div className="p-6 bg-gray-50">
//       {/* Header with traffic-themed gradient */}
//       <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 p-6 mb-8">
//         <div className="absolute inset-0 opacity-20">
//           <div className="traffic-pattern"></div>
//         </div>
//         <div className="relative z-10">
//           <h1 className="text-3xl font-bold text-white">Urban Mobility Dashboard</h1>
//           <p className="text-amber-100 mt-2">Real-time traffic insights and management</p>
//         </div>
//       </div>

//       {/* Traffic Pulse Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
//         <TrafficPulseCard 
//           title="Average Speed" 
//           value="32 km/h" 
//           change="-1.2%" 
//           icon={<FaCar className="text-blue-500" />}
//           color="blue"
//         />
//         <TrafficPulseCard 
//           title="Congestion Level" 
//           value="Medium" 
//           change="+3.1%" 
//           icon={<FaTrafficLight className="text-amber-500" />}
//           color="amber"
//         />
//         <TrafficPulseCard 
//           title="Public Transport" 
//           value="68%" 
//           change="+2.8%" 
//           icon={<FaBus className="text-green-500" />}
//           color="green"
//         />
//         <TrafficPulseCard 
//           title="Avg. Delay" 
//           value="4.2 min" 
//           change="-0.5%" 
//           icon={<FiClock className="text-purple-500" />}
//           color="purple"
//         />
//       </div>

//       {/* Main Content Area */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
//         {/* Traffic Heatmap */}
//         <div className="bg-white rounded-2xl shadow-lg p-6 lg:col-span-2">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-xl font-semibold">Live Traffic Heatmap</h2>
//             <div className="flex space-x-2">
//               <select className="bg-gray-100 border-0 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-amber-300">
//                 <option>Current</option>
//                 <option>Peak Hours</option>
//                 <option>Historical</option>
//               </select>
//               <button className="p-1 bg-gray-100 rounded-lg">
//                 <FiMap className="text-gray-500" />
//               </button>
//             </div>
//           </div>
//           <div className="h-96 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center">
//             <div className="text-center">
//               <div className="w-24 h-24 mx-auto mb-4 bg-amber-100 rounded-full flex items-center justify-center">
//                 <FaTrafficLight size={32} className="text-amber-500" />
//               </div>
//               <p className="text-gray-500">Interactive traffic visualization</p>
//               <button className="mt-3 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition">
//                 View Full Map
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Incidents and Transport */}
//         <div className="space-y-6">
//           <div className="bg-white rounded-2xl shadow-lg p-6">
//             <h2 className="text-xl font-semibold mb-4">Active Incidents</h2>
//             <div className="space-y-4">
//               <TrafficIncident 
//                 type="Accident" 
//                 location="Main St & 3rd Ave" 
//                 impact="High"
//                 time="15 min ago"
//               />
//               <TrafficIncident 
//                 type="Construction" 
//                 location="Highway 5 Northbound" 
//                 impact="Medium"
//                 time="1 hour ago"
//               />
//               <TrafficIncident 
//                 type="Event" 
//                 location="Convention Center" 
//                 impact="Low"
//                 time="3 hours ago"
//               />
//             </div>
//             <button className="mt-4 w-full py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
//               View All Incidents
//             </button>
//           </div>

//           <div className="bg-white rounded-2xl shadow-lg p-6">
//             <h2 className="text-xl font-semibold mb-4">Transport Status</h2>
//             <div className="grid grid-cols-2 gap-3">
//               <TransportCard 
//                 mode="Subway" 
//                 status="Normal" 
//                 delay="2%"
//                 icon={<FaSubway className="text-blue-500" />}
//               />
//               <TransportCard 
//                 mode="Buses" 
//                 status="Delays" 
//                 delay="12%"
//                 icon={<FaBus className="text-green-500" />}
//               />
//               <TransportCard 
//                 mode="Trams" 
//                 status="Normal" 
//                 delay="3%"
//                 icon={<FaSubway className="text-purple-500" />}
//               />
//               <TransportCard 
//                 mode="Ferries" 
//                 status="On Time" 
//                 delay="0%"
//                 icon={<FaSubway className="text-cyan-500" />}
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Analytics Section */}
//       <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
//         <h2 className="text-xl font-semibold mb-6">Traffic Flow Analytics</h2>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <AnalyticCard 
//             title="Peak Hours" 
//             data={[
//               { time: '7-9 AM', value: 42 },
//               { time: '12-2 PM', value: 28 },
//               { time: '5-7 PM', value: 56 }
//             ]}
//             color="blue"
//           />
//           <AnalyticCard 
//             title="Congestion Points" 
//             data={[
//               { location: 'Main Intersection', value: 78 },
//               { location: 'Highway Exit', value: 65 },
//               { location: 'School Zone', value: 52 }
//             ]}
//             color="amber"
//           />
//           <AnalyticCard 
//             title="Transport Mode" 
//             data={[
//               { mode: 'Private', value: 58 },
//               { mode: 'Public', value: 32 },
//               { mode: 'Bicycle', value: 10 }
//             ]}
//             color="green"
//           />
//         </div>
//       </div>

//       {/* Quick Actions */}
//       <div className="bg-white rounded-2xl shadow-lg p-6">
//         <h2 className="text-xl font-semibold mb-4">Traffic Management</h2>
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//           <ActionButton 
//             icon={<FiAlertTriangle className="text-red-500" />}
//             label="Report Incident"
//           />
//           <ActionButton 
//             icon={<FaTrafficLight className="text-amber-500" />}
//             label="Signal Control"
//           />
//           <ActionButton 
//             icon={<FiMap className="text-blue-500" />}
//             label="Route Planning"
//           />
//           <ActionButton 
//             icon={<FiBarChart2 className="text-purple-500" />}
//             label="Analytics"
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// const TrafficPulseCard = ({ title, value, change, icon, color }) => {
//   const colorClasses = {
//     blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
//     amber: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' },
//     green: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200' },
//     purple: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' }
//   };

//   const currentColor = colorClasses[color] || colorClasses.blue;
//   const isPositive = change.startsWith('+');

//   return (
//     <div className={`bg-white rounded-2xl shadow-lg p-5 border-t-4 ${currentColor.border}`}>
//       <div className="flex items-center mb-4">
//         <div className={`p-3 rounded-full ${currentColor.bg} mr-3`}>
//           {icon}
//         </div>
//         <h3 className={`font-medium ${currentColor.text}`}>{title}</h3>
//       </div>
//       <div className="flex justify-between items-end">
//         <p className="text-2xl font-bold">{value}</p>
//         <div className={`flex items-center text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
//           {isPositive ? '+' : ''}{change}
//         </div>
//       </div>
//     </div>
//   );
// };

// const TrafficIncident = ({ type, location, impact, time }) => {
//   const impactClasses = {
//     High: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200' },
//     Medium: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' },
//     Low: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' }
//   };

//   const currentImpact = impactClasses[impact] || impactClasses.Low;

//   return (
//     <div className={`p-3 rounded-lg border ${currentImpact.border} ${currentImpact.bg} flex items-start`}>
//       <div className={`p-2 rounded-full ${currentImpact.bg} mr-3`}>
//         <FiAlertTriangle className={currentImpact.text} />
//       </div>
//       <div className="flex-1">
//         <div className="flex justify-between">
//           <span className={`font-medium ${currentImpact.text}`}>{type}</span>
//           <span className="text-xs text-gray-500">{time}</span>
//         </div>
//         <p className="text-gray-700 mt-1">{location}</p>
//         <div className="flex justify-between items-center mt-2">
//           <span className="text-xs text-gray-500">Impact: {impact}</span>
//           <button className="text-xs text-blue-500 hover:text-blue-700">Details →</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const TransportCard = ({ mode, status, delay, icon }) => {
//   const statusClasses = {
//     Normal: { bg: 'bg-green-50', text: 'text-green-600' },
//     Delays: { bg: 'bg-amber-50', text: 'text-amber-600' },
//     'On Time': { bg: 'bg-blue-50', text: 'text-blue-600' }
//   };

//   const currentStatus = statusClasses[status] || statusClasses.Normal;

//   return (
//     <div className="bg-gray-50 p-3 rounded-lg">
//       <div className="flex items-center">
//         <div className="p-2 rounded-lg bg-white shadow-sm mr-3">
//           {icon}
//         </div>
//         <div>
//           <h4 className="font-medium">{mode}</h4>
//           <div className="flex items-center mt-1">
//             <span className={`text-xs px-2 py-0.5 rounded-full ${currentStatus.bg} ${currentStatus.text}`}>
//               {status}
//             </span>
//             <span className="text-xs text-gray-500 ml-2">{delay} delay</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const AnalyticCard = ({ title, data, color }) => {
//   const colorClasses = {
//     blue: { bg: 'bg-blue-500', text: 'text-blue-600' },
//     amber: { bg: 'bg-amber-500', text: 'text-amber-600' },
//     green: { bg: 'bg-green-500', text: 'text-green-600' }
//   };

//   const currentColor = colorClasses[color] || colorClasses.blue;

//   return (
//     <div className="bg-white p-4 rounded-lg border border-gray-100">
//       <h3 className="font-medium mb-3">{title}</h3>
//       <div className="space-y-3">
//         {data.map((item, index) => (
//           <div key={index}>
//             <div className="flex justify-between text-sm mb-1">
//               <span className="text-gray-600">{item.time || item.location || item.mode}</span>
//               <span className="font-medium">{item.value}%</span>
//             </div>
//             <div className="w-full bg-gray-100 rounded-full h-2">
//               <div 
//                 className={`h-2 rounded-full ${currentColor.bg}`}
//                 style={{width: `${item.value}%`}}
//               ></div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// const ActionButton = ({ icon, label }) => {
//   return (
//     <button className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
//       <div className="p-2 rounded-full bg-white shadow-sm mb-2">
//         {icon}
//       </div>
//       <span className="text-sm text-gray-700">{label}</span>
//     </button>
//   );
// };

// export default TrafficTab;