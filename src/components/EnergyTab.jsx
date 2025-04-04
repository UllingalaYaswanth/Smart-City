// import { FiZap, FiTrendingUp, FiActivity } from 'react-icons/fi';

// const EnergyTab = () => {
//   return (
//     <div>
//       <h3 className="text-xl font-semibold mb-6">Energy Management</h3>
      
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
//         <MetricCard 
//           title="Total Consumption" 
//           value="4.2 GW" 
//           change="-1.1%" 
//           icon={<FiZap className="text-green-500" />}
//         />
//         <MetricCard 
//           title="Renewable Energy" 
//           value="42%" 
//           change="+3.2%" 
//           icon={<FiTrendingUp className="text-blue-500" />}
//         />
//         <MetricCard 
//           title="Peak Demand" 
//           value="5.1 GW" 
//           change="-0.5%" 
//           icon={<FiActivity className="text-yellow-500" />}
//         />
//         <MetricCard 
//           title="Carbon Emissions" 
//           value="1.2M tons" 
//           change="-2.1%" 
//           icon={<FiActivity className="text-red-500" />}
//         />
//       </div>
      
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
//         <div className="bg-white p-6 rounded-xl shadow-sm lg:col-span-2">
//           <div className="flex justify-between items-center mb-4">
//             <h4 className="text-lg font-medium">Energy Consumption Trends</h4>
//             <select className="border rounded-lg px-3 py-1">
//               <option>Last 24 hours</option>
//               <option>Last 7 days</option>
//               <option>Last 30 days</option>
//               <option>Last year</option>
//             </select>
//           </div>
//           <div className="h-80 bg-gray-200 rounded-lg flex items-center justify-center">
//             <p className="text-gray-500">Energy Consumption Chart</p>
//           </div>
//         </div>
        
//         <div className="bg-white p-6 rounded-xl shadow-sm">
//           <h4 className="text-lg font-medium mb-4">Energy Sources</h4>
//           <div className="h-80 flex flex-col justify-between">
//             <div className="flex items-center justify-between mb-3">
//               <div className="flex items-center">
//                 <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
//                 <span>Solar</span>
//               </div>
//               <span className="font-medium">18%</span>
//             </div>
//             <div className="flex items-center justify-between mb-3">
//               <div className="flex items-center">
//                 <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
//                 <span>Wind</span>
//               </div>
//               <span className="font-medium">24%</span>
//             </div>
//             <div className="flex items-center justify-between mb-3">
//               <div className="flex items-center">
//                 <div className="w-3 h-3 rounded-full bg-gray-500 mr-2"></div>
//                 <span>Coal</span>
//               </div>
//               <span className="font-medium">32%</span>
//             </div>
//             <div className="flex items-center justify-between mb-3">
//               <div className="flex items-center">
//                 <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
//                 <span>Natural Gas</span>
//               </div>
//               <span className="font-medium">22%</span>
//             </div>
//             <div className="flex items-center justify-between">
//               <div className="flex items-center">
//                 <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
//                 <span>Hydro</span>
//               </div>
//               <span className="font-medium">4%</span>
//             </div>
            
//             <div className="mt-6 bg-gray-200 rounded-full h-4">
//               <div 
//                 className="h-4 rounded-full bg-gradient-to-r from-green-500 via-blue-500 to-gray-500" 
//                 style={{width: '100%'}}
//               ></div>
//             </div>
//           </div>
//         </div>
//       </div>
      
//       <div className="bg-white p-6 rounded-xl shadow-sm">
//         <h4 className="text-lg font-medium mb-4">Smart Grid Status</h4>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <GridStatusItem 
//             district="North District" 
//             status="Operational" 
//             usage="72%" 
//             color="green"
//           />
//           <GridStatusItem 
//             district="Central District" 
//             status="High Load" 
//             usage="89%" 
//             color="yellow"
//           />
//           <GridStatusItem 
//             district="South District" 
//             status="Maintenance" 
//             usage="15%" 
//             color="red"
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// const MetricCard = ({ title, value, change, icon }) => {
//   const isPositive = change.startsWith('+');
  
//   return (
//     <div className="bg-white p-6 rounded-xl shadow-sm">
//       <div className="flex justify-between">
//         <div>
//           <p className="text-gray-500 text-sm">{title}</p>
//           <p className="text-2xl font-bold mt-1">{value}</p>
//         </div>
//         <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
//           {icon}
//         </div>
//       </div>
//       <p className={`mt-3 text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
//         {change} from last month
//       </p>
//     </div>
//   );
// };

// const GridStatusItem = ({ district, status, usage, color }) => {
//   const getColor = () => {
//     switch(color) {
//       case 'green': return 'bg-green-100 text-green-800';
//       case 'yellow': return 'bg-yellow-100 text-yellow-800';
//       case 'red': return 'bg-red-100 text-red-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };
  
//   return (
//     <div className="bg-gray-50 p-4 rounded-lg">
//       <h5 className="font-medium">{district}</h5>
//       <div className="flex justify-between items-center mt-2">
//         <span className={`px-2 py-1 rounded-md text-xs ${getColor()}`}>
//           {status}
//         </span>
//         <span className="font-bold">{usage}</span>
//       </div>
//       <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
//         <div 
//           className={`h-2 rounded-full ${
//             color === 'green' ? 'bg-green-500' : 
//             color === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'
//           }`}
//           style={{width: usage}}
//         ></div>
//       </div>
//     </div>
//   );
// };

// export default EnergyTab;

import { FiZap, FiTrendingUp, FiActivity, FiAlertCircle, FiInfo } from 'react-icons/fi';

const EnergyTab = () => {
  return (
    <div className="space-y-8">
      {/* Header Section with Key Metrics */}
      <div>
        <h1 className="text-2xl font-bold mb-2">Metro City Energy Management</h1>
        <p className="text-gray-600 mb-6">
          Comprehensive overview of energy production, distribution, and consumption patterns across the metropolitan area.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatCard 
            icon={<FiZap className="text-blue-500" size={24} />}
            title="Total Capacity"
            value="8.4 GW"
            description="Installed generation capacity"
            trend="+2.4% since last year"
          />
          <StatCard 
            icon={<FiTrendingUp className="text-green-500" size={24} />}
            title="Renewable Share"
            value="38%"
            description="Of total energy mix"
            trend="+5.1% annual growth"
          />
          <StatCard 
            icon={<FiActivity className="text-yellow-500" size={24} />}
            title="Peak Demand"
            value="6.2 GW"
            description="Recorded this summer"
            trend="Managing 94% capacity"
          />
        </div>
      </div>

      {/* Energy Production Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Energy Production Portfolio</h2>
            <p className="text-gray-600">
              Breakdown of electricity generation sources and their contribution to the city's power grid
            </p>
          </div>
          <select className="border rounded-lg px-3 py-2 bg-gray-50">
            <option>Current Year Data</option>
            <option>2022 Comparison</option>
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              {/* Placeholder for production mix chart */}
              <div className="text-center p-4">
                <div className="w-40 h-40 rounded-full border-8 border-blue-400 relative mx-auto mb-4">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold">100%</span>
                  </div>
                </div>
                <p className="text-gray-500">Energy Production Mix Visualization</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium mb-3">Key Observations</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start">
                  <FiInfo className="text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Solar generation increased by 18% during summer months</span>
                </li>
                <li className="flex items-start">
                  <FiInfo className="text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Wind farms operating at 72% capacity factor</span>
                </li>
                <li className="flex items-start">
                  <FiAlertCircle className="text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Natural gas plants running at minimum required levels</span>
                </li>
              </ul>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Renewable Targets</h4>
              <div className="mb-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>2023 Goal</span>
                  <span>40% renewable</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="h-2 rounded-full bg-green-500" style={{width: '38%'}}></div>
                </div>
              </div>
              <p className="text-xs text-gray-500">
                On track to meet 45% target by 2025 through new solar farm installations
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Consumption Patterns Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Seasonal Consumption Trends</h2>
          
          <div className="h-64 mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
            {/* Placeholder for seasonal chart */}
            <p className="text-gray-500">Monthly Consumption Pattern Chart</p>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-medium">Analysis</h4>
            <p className="text-sm text-gray-600">
              Summer months show 22% higher consumption due to cooling needs, with peak demand occurring between 2-5 PM.
              Winter evenings see a secondary peak from heating requirements.
            </p>
            <div className="flex items-center text-sm bg-yellow-50 p-3 rounded-lg">
              <FiAlertCircle className="text-yellow-500 mr-2 flex-shrink-0" />
              <span>Critical peak periods require demand response programs</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">District-Level Analysis</h2>
          
          <div className="h-64 mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
            {/* Placeholder for district map */}
            <p className="text-gray-500">Geographical Demand Distribution Map</p>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-medium">Key Findings</h4>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mt-1.5 mr-2 flex-shrink-0"></span>
                <span>Financial district accounts for 28% of daytime demand</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500 mt-1.5 mr-2 flex-shrink-0"></span>
                <span>Residential areas show 40% higher evening consumption</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-red-500 mt-1.5 mr-2 flex-shrink-0"></span>
                <span>Industrial zone maintains steady 24/7 baseline load</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Sustainability Initiatives */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Sustainability Progress</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="font-medium mb-3">Carbon Emissions</h3>
            <div className="h-48 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
              {/* Placeholder for emissions chart */}
              <p className="text-gray-500">Emissions Reduction Timeline</p>
            </div>
            <p className="text-sm text-gray-600">
              The city has reduced CO2 emissions by 1.2 million tons since 2018 through renewable integration
              and energy efficiency programs. Current trajectory puts us on pace for 45% reduction by 2030.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium mb-3">Recent Initiatives</h3>
            <div className="space-y-3">
              <InitiativeCard 
                title="Solar Panel Subsidy Program"
                status="Active"
                participants="4,200 households"
                impact="+18MW capacity"
              />
              <InitiativeCard 
                title="Commercial Building Retrofit"
                status="Pilot Phase"
                participants="32 buildings"
                impact="12% efficiency gain"
              />
              <InitiativeCard 
                title="EV Charging Network"
                status="Expanding"
                participants="85 stations"
                impact="5% transport electrification"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Component for statistic cards
const StatCard = ({ icon, title, value, description, trend }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-start">
        <div className="p-2 bg-gray-50 rounded-lg mr-4">
          {icon}
        </div>
        <div>
          <h3 className="font-medium text-gray-500">{title}</h3>
          <p className="text-2xl font-bold my-1">{value}</p>
          <p className="text-sm text-gray-500">{description}</p>
          <p className="text-xs mt-1 text-green-600">{trend}</p>
        </div>
      </div>
    </div>
  );
};

// Component for initiative cards
const InitiativeCard = ({ title, status, participants, impact }) => {
  const getStatusColor = () => {
    switch(status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pilot phase': return 'bg-blue-100 text-blue-800';
      case 'expanding': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
      <div className="flex justify-between items-start">
        <h4 className="font-medium">{title}</h4>
        <span className={`text-xs px-2 py-1 rounded ${getStatusColor()}`}>
          {status}
        </span>
      </div>
      <div className="flex justify-between mt-2 text-sm text-gray-600">
        <span>{participants}</span>
        <span className="font-medium">{impact}</span>
      </div>
    </div>
  );
};

export default EnergyTab;