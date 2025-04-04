import { FiDroplet, FiAlertCircle } from 'react-icons/fi';

const WaterTab = () => {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-6">Water Resource Management</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <MetricCard 
          title="Total Consumption" 
          value="120 ML" 
          change="+0.8%" 
          icon={<FiDroplet className="text-blue-400" />}
        />
        <MetricCard 
          title="Reservoir Levels" 
          value="78%" 
          change="-2.1%" 
          icon={<FiDroplet className="text-blue-600" />}
        />
        <MetricCard 
          title="Water Quality" 
          value="Excellent" 
          change="+1.2%" 
          icon={<FiDroplet className="text-green-500" />}
        />
        <MetricCard 
          title="Leakage Rate" 
          value="8.2%" 
          change="-0.3%" 
          icon={<FiAlertCircle className="text-red-500" />}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-xl shadow-sm lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-medium">Water Distribution Network</h4>
            <select className="border rounded-lg px-3 py-1">
              <option>Pressure</option>
              <option>Flow Rate</option>
              <option>Quality</option>
            </select>
          </div>
          <div className="h-80 bg-gray-200 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Water Network Visualization</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h4 className="text-lg font-medium mb-4">Reservoir Status</h4>
          <div className="space-y-4">
            <ReservoirItem 
              name="North Reservoir" 
              level="82%" 
              trend="up"
            />
            <ReservoirItem 
              name="Central Reservoir" 
              level="65%" 
              trend="down"
            />
            <ReservoirItem 
              name="South Reservoir" 
              level="91%" 
              trend="stable"
            />
            <ReservoirItem 
              name="East Reservoir" 
              level="74%" 
              trend="up"
            />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h4 className="text-lg font-medium mb-4">Consumption by Sector</h4>
          <div className="h-64 flex items-center justify-center">
            <div className="w-full">
              <div className="flex justify-between mb-1">
                <span>Residential</span>
                <span>45%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div className="bg-blue-500 h-4 rounded-full" style={{width: '45%'}}></div>
              </div>
              
              <div className="flex justify-between mb-1 mt-4">
                <span>Commercial</span>
                <span>30%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div className="bg-green-500 h-4 rounded-full" style={{width: '30%'}}></div>
              </div>
              
              <div className="flex justify-between mb-1 mt-4">
                <span>Industrial</span>
                <span>20%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div className="bg-yellow-500 h-4 rounded-full" style={{width: '20%'}}></div>
              </div>
              
              <div className="flex justify-between mb-1 mt-4">
                <span>Public</span>
                <span>5%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div className="bg-red-500 h-4 rounded-full" style={{width: '5%'}}></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h4 className="text-lg font-medium mb-4">Recent Water Alerts</h4>
          <div className="space-y-4">
            <WaterAlert 
              type="leak" 
              location="Main St & 5th Ave" 
              time="2 hours ago"
            />
            <WaterAlert 
              type="quality" 
              location="North District" 
              time="5 hours ago"
            />
            <WaterAlert 
              type="pressure" 
              location="Industrial Zone" 
              time="1 day ago"
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

const ReservoirItem = ({ name, level, trend }) => {
  const getTrendIcon = () => {
    switch(trend) {
      case 'up': return '↑';
      case 'down': return '↓';
      default: return '→';
    }
  };
  
  const getTrendColor = () => {
    switch(trend) {
      case 'up': return 'text-green-500';
      case 'down': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center">
        <h5 className="font-medium">{name}</h5>
        <span className={`font-bold ${getTrendColor()}`}>
          {level} <span className="text-xs">{getTrendIcon()}</span>
        </span>
      </div>
      <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full ${
            parseInt(level) > 80 ? 'bg-green-500' : 
            parseInt(level) > 50 ? 'bg-yellow-500' : 'bg-red-500'
          }`}
          style={{width: level}}
        ></div>
      </div>
    </div>
  );
};

const WaterAlert = ({ type, location, time }) => {
  const getTypeColor = () => {
    switch(type) {
      case 'leak': return 'bg-red-100 text-red-800';
      case 'quality': return 'bg-yellow-100 text-yellow-800';
      case 'pressure': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getTypeText = () => {
    switch(type) {
      case 'leak': return 'LEAK DETECTED';
      case 'quality': return 'QUALITY ISSUE';
      case 'pressure': return 'LOW PRESSURE';
      default: return 'ALERT';
    }
  };
  
  return (
    <div className="flex items-start">
      <div className={`px-2 py-1 rounded-md text-xs ${getTypeColor()}`}>
        {getTypeText()}
      </div>
      <div className="ml-3 flex-1">
        <p className="font-medium">{location}</p>
        <p className="text-gray-500 text-sm">{time}</p>
      </div>
    </div>
  );
};

export default WaterTab;

// import { FiDroplet, FiAlertCircle, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
// import { WiRaindrop } from 'react-icons/wi';

// const WaterTab = () => {
//   return (
//     <div className="p-6">
//       {/* Header with animated water wave background */}
//       <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 p-6 mb-8">
//         <div className="absolute inset-0 opacity-20">
//           <div className="water-wave"></div>
//         </div>
//         <div className="relative z-10">
//           <h1 className="text-3xl font-bold text-white">Water Resource Intelligence</h1>
//           <p className="text-blue-100 mt-2">Real-time monitoring and analytics</p>
//         </div>
//       </div>

//       {/* Quick Stats with water-themed cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
//         <div className="bg-white rounded-2xl shadow-lg p-5 border-l-4 border-blue-400">
//           <div className="flex items-center">
//             <div className="p-3 rounded-full bg-blue-50 text-blue-500 mr-4">
//               <FiDroplet size={24} />
//             </div>
//             <div>
//               <p className="text-gray-500 text-sm">Total Consumption</p>
//               <p className="text-2xl font-bold">120 ML</p>
//             </div>
//           </div>
//           <div className="flex items-center mt-3 text-sm">
//             <FiTrendingUp className="text-green-500 mr-1" />
//             <span className="text-green-500">+0.8%</span>
//             <span className="text-gray-400 ml-2">from yesterday</span>
//           </div>
//         </div>

//         <div className="bg-white rounded-2xl shadow-lg p-5 border-l-4 border-cyan-400">
//           <div className="flex items-center">
//             <div className="p-3 rounded-full bg-cyan-50 text-cyan-500 mr-4">
//               <WiRaindrop size={28} className="-mt-1" />
//             </div>
//             <div>
//               <p className="text-gray-500 text-sm">Reservoir Levels</p>
//               <p className="text-2xl font-bold">78%</p>
//             </div>
//           </div>
//           <div className="flex items-center mt-3 text-sm">
//             <FiTrendingDown className="text-red-500 mr-1" />
//             <span className="text-red-500">-2.1%</span>
//             <span className="text-gray-400 ml-2">weekly change</span>
//           </div>
//         </div>

//         <div className="bg-white rounded-2xl shadow-lg p-5 border-l-4 border-emerald-400">
//           <div className="flex items-center">
//             <div className="p-3 rounded-full bg-emerald-50 text-emerald-500 mr-4">
//               <FiDroplet size={24} />
//             </div>
//             <div>
//               <p className="text-gray-500 text-sm">Water Quality</p>
//               <p className="text-2xl font-bold">Excellent</p>
//             </div>
//           </div>
//           <div className="flex items-center mt-3 text-sm">
//             <FiTrendingUp className="text-green-500 mr-1" />
//             <span className="text-green-500">+1.2%</span>
//             <span className="text-gray-400 ml-2">improvement</span>
//           </div>
//         </div>

//         <div className="bg-white rounded-2xl shadow-lg p-5 border-l-4 border-rose-400">
//           <div className="flex items-center">
//             <div className="p-3 rounded-full bg-rose-50 text-rose-500 mr-4">
//               <FiAlertCircle size={24} />
//             </div>
//             <div>
//               <p className="text-gray-500 text-sm">Leakage Rate</p>
//               <p className="text-2xl font-bold">8.2%</p>
//             </div>
//           </div>
//           <div className="flex items-center mt-3 text-sm">
//             <FiTrendingDown className="text-green-500 mr-1" />
//             <span className="text-green-500">-0.3%</span>
//             <span className="text-gray-400 ml-2">reduction</span>
//           </div>
//         </div>
//       </div>

//       {/* Main Content Area */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
//         {/* Water Network Map */}
//         <div className="bg-white rounded-2xl shadow-lg p-6 lg:col-span-2">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-xl font-semibold">Water Distribution Network</h2>
//             <div className="flex space-x-2">
//               <button className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">Pressure</button>
//               <button className="px-3 py-1 text-gray-500 rounded-full text-sm">Flow Rate</button>
//               <button className="px-3 py-1 text-gray-500 rounded-full text-sm">Quality</button>
//             </div>
//           </div>
//           <div className="h-96 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl flex items-center justify-center">
//             <div className="text-center">
//               <div className="w-24 h-24 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
//                 <FiDroplet size={40} className="text-blue-500" />
//               </div>
//               <p className="text-gray-500">Interactive water network visualization</p>
//               <button className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
//                 View Full Map
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Reservoir Status */}
//         <div className="space-y-6">
//           <div className="bg-white rounded-2xl shadow-lg p-6">
//             <h2 className="text-xl font-semibold mb-4">Reservoir Status</h2>
//             <div className="space-y-5">
//               <ReservoirStatus 
//                 name="North Reservoir" 
//                 level={82} 
//                 trend="up" 
//                 capacity="120ML"
//               />
//               <ReservoirStatus 
//                 name="Central Reservoir" 
//                 level={65} 
//                 trend="down" 
//                 capacity="80ML"
//               />
//               <ReservoirStatus 
//                 name="South Reservoir" 
//                 level={91} 
//                 trend="stable" 
//                 capacity="150ML"
//               />
//             </div>
//           </div>

//           <div className="bg-white rounded-2xl shadow-lg p-6">
//             <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
//             <div className="grid grid-cols-2 gap-3">
//               <button className="p-3 bg-blue-50 text-blue-600 rounded-lg flex flex-col items-center">
//                 <FiAlertCircle size={20} />
//                 <span className="mt-1 text-sm">Report Issue</span>
//               </button>
//               <button className="p-3 bg-green-50 text-green-600 rounded-lg flex flex-col items-center">
//                 <FiDroplet size={20} />
//                 <span className="mt-1 text-sm">Water Quality</span>
//               </button>
//               <button className="p-3 bg-purple-50 text-purple-600 rounded-lg flex flex-col items-center">
//                 <FiTrendingUp size={20} />
//                 <span className="mt-1 text-sm">Usage Stats</span>
//               </button>
//               <button className="p-3 bg-amber-50 text-amber-600 rounded-lg flex flex-col items-center">
//                 <FiAlertCircle size={20} />
//                 <span className="mt-1 text-sm">Alerts</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Bottom Section */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div className="bg-white rounded-2xl shadow-lg p-6">
//           <h2 className="text-xl font-semibold mb-4">Consumption by Sector</h2>
//           <div className="h-64">
//             <PieChart />
//           </div>
//         </div>

//         <div className="bg-white rounded-2xl shadow-lg p-6">
//           <h2 className="text-xl font-semibold mb-4">Recent Water Alerts</h2>
//           <div className="space-y-4">
//             <WaterAlert 
//               type="leak" 
//               location="Main St & 5th Ave" 
//               time="2 hours ago" 
//               severity="high"
//             />
//             <WaterAlert 
//               type="quality" 
//               location="North District" 
//               time="5 hours ago" 
//               severity="medium"
//             />
//             <WaterAlert 
//               type="pressure" 
//               location="Industrial Zone" 
//               time="1 day ago" 
//               severity="low"
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const ReservoirStatus = ({ name, level, trend, capacity }) => {
//   const getTrendIcon = () => {
//     switch(trend) {
//       case 'up': return <FiTrendingUp className="text-green-500" />;
//       case 'down': return <FiTrendingDown className="text-red-500" />;
//       default: return <span className="text-gray-400">→</span>;
//     }
//   };

//   return (
//     <div>
//       <div className="flex justify-between items-center mb-2">
//         <h3 className="font-medium">{name}</h3>
//         <div className="flex items-center">
//           <span className="font-bold mr-2">{level}%</span>
//           {getTrendIcon()}
//         </div>
//       </div>
//       <div className="w-full bg-gray-100 rounded-full h-2.5">
//         <div 
//           className={`h-2.5 rounded-full ${
//             level > 80 ? 'bg-green-500' : 
//             level > 50 ? 'bg-yellow-500' : 'bg-red-500'
//           }`}
//           style={{width: `${level}%`}}
//         ></div>
//       </div>
//       <div className="flex justify-between text-xs text-gray-500 mt-1">
//         <span>0%</span>
//         <span>Capacity: {capacity}</span>
//         <span>100%</span>
//       </div>
//     </div>
//   );
// };

// const WaterAlert = ({ type, location, time, severity }) => {
//   const getSeverityStyles = () => {
//     switch(severity) {
//       case 'high': return {
//         bg: 'bg-red-50',
//         text: 'text-red-600',
//         border: 'border-red-200',
//         icon: <FiAlertCircle className="text-red-500" />
//       };
//       case 'medium': return {
//         bg: 'bg-amber-50',
//         text: 'text-amber-600',
//         border: 'border-amber-200',
//         icon: <FiAlertCircle className="text-amber-500" />
//       };
//       default: return {
//         bg: 'bg-blue-50',
//         text: 'text-blue-600',
//         border: 'border-blue-200',
//         icon: <FiAlertCircle className="text-blue-500" />
//       };
//     }
//   };

//   const severityStyles = getSeverityStyles();

//   return (
//     <div className={`p-3 rounded-lg border ${severityStyles.border} ${severityStyles.bg} flex items-start`}>
//       <div className={`p-2 rounded-full ${severityStyles.bg} mr-3`}>
//         {severityStyles.icon}
//       </div>
//       <div className="flex-1">
//         <div className="flex justify-between">
//           <span className={`font-medium ${severityStyles.text}`}>{type.toUpperCase()}</span>
//           <span className="text-xs text-gray-500">{time}</span>
//         </div>
//         <p className="text-gray-700 mt-1">{location}</p>
//       </div>
//     </div>
//   );
// };

// // Placeholder for pie chart component
// const PieChart = () => {
//   return (
//     <div className="flex items-center justify-center h-full">
//       <div className="relative w-40 h-40">
//         <div className="absolute inset-0 rounded-full border-[20px] border-blue-400"></div>
//         <div className="absolute inset-0 rounded-full border-[20px] border-green-400 rotate-90"></div>
//         <div className="absolute inset-0 rounded-full border-[20px] border-yellow-400 rotate-180"></div>
//         <div className="absolute inset-0 rounded-full border-[20px] border-red-400 rotate-270"></div>
//         <div className="absolute inset-0 flex items-center justify-center">
//           <div className="text-center">
//             <p className="text-2xl font-bold">100%</p>
//             <p className="text-sm text-gray-500">Total</p>
//           </div>
//         </div>
//       </div>
//       <div className="ml-8">
//         <div className="flex items-center mb-2">
//           <div className="w-3 h-3 rounded-full bg-blue-400 mr-2"></div>
//           <span>Residential (45%)</span>
//         </div>
//         <div className="flex items-center mb-2">
//           <div className="w-3 h-3 rounded-full bg-green-400 mr-2"></div>
//           <span>Commercial (30%)</span>
//         </div>
//         <div className="flex items-center mb-2">
//           <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></div>
//           <span>Industrial (20%)</span>
//         </div>
//         <div className="flex items-center">
//           <div className="w-3 h-3 rounded-full bg-red-400 mr-2"></div>
//           <span>Public (5%)</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default WaterTab;