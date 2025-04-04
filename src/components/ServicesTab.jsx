import { FiUsers, FiMessageSquare,FiClock, FiCalendar, FiCheckCircle } from 'react-icons/fi';

const ServicesTab = () => {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-6">Citizen Services</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <MetricCard 
          title="Service Requests" 
          value="1,245" 
          change="+12%" 
          icon={<FiMessageSquare className="text-blue-500" />}
        />
        <MetricCard 
          title="Resolved Issues" 
          value="1,089" 
          change="+8%" 
          icon={<FiCheckCircle className="text-green-500" />}
        />
        <MetricCard 
          title="Avg. Response Time" 
          value="2.1 days" 
          change="-0.3" 
          icon={<FiClock className="text-yellow-500" />}
        />
        <MetricCard 
          title="Citizen Satisfaction" 
          value="87%" 
          change="+2%" 
          icon={<FiUsers className="text-purple-500" />}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-xl shadow-sm lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-medium">Service Request Trends</h4>
            <select className="border rounded-lg px-3 py-1">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
          <div className="h-80 bg-gray-200 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Service Request Chart</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h4 className="text-lg font-medium mb-4">Top Request Types</h4>
          <div className="space-y-4">
            <RequestType 
              type="Waste Collection" 
              count="342" 
              trend="up"
            />
            <RequestType 
              type="Road Repairs" 
              count="289" 
              trend="up"
            />
            <RequestType 
              type="Public Lighting" 
              count="156" 
              trend="down"
            />
            <RequestType 
              type="Water Issues" 
              count="98" 
              trend="stable"
            />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h4 className="text-lg font-medium mb-4">Recent Requests</h4>
          <div className="space-y-4">
            <ServiceRequest 
              id="#SR-2456" 
              type="Pothole Repair" 
              status="In Progress" 
              date="2 hours ago"
            />
            <ServiceRequest 
              id="#SR-2455" 
              type="Street Light Outage" 
              status="Assigned" 
              date="5 hours ago"
            />
            <ServiceRequest 
              id="#SR-2454" 
              type="Garbage Collection" 
              status="Completed" 
              date="1 day ago"
            />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h4 className="text-lg font-medium mb-4">Upcoming Events</h4>
          <div className="space-y-4">
            <CityEvent 
              title="Community Cleanup Day" 
              date="May 15, 2023" 
              location="Central Park"
            />
            <CityEvent 
              title="Town Hall Meeting" 
              date="May 20, 2023" 
              location="City Hall"
            />
            <CityEvent 
              title="Recycling Workshop" 
              date="May 25, 2023" 
              location="Public Library"
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

const RequestType = ({ type, count, trend }) => {
  const getTrendIcon = () => {
    switch(trend) {
      case 'up': return '↑';
      case 'down': return '↓';
      default: return '→';
    }
  };
  
  const getTrendColor = () => {
    switch(trend) {
      case 'up': return 'text-red-500';
      case 'down': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };
  
  return (
    <div className="flex justify-between items-center">
      <span className="font-medium">{type}</span>
      <div className="flex items-center">
        <span className="font-bold mr-2">{count}</span>
        <span className={`text-xs ${getTrendColor()}`}>{getTrendIcon()}</span>
      </div>
    </div>
  );
};

const ServiceRequest = ({ id, type, status, date }) => {
  const getStatusColor = () => {
    switch(status.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in progress': return 'bg-blue-100 text-blue-800';
      case 'assigned': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="border-b pb-3 last:border-0 last:pb-0">
      <div className="flex justify-between items-center">
        <span className="font-medium">{id}</span>
        <span className={`px-2 py-1 rounded-md text-xs ${getStatusColor()}`}>
          {status}
        </span>
      </div>
      <p className="text-gray-700 mt-1">{type}</p>
      <p className="text-gray-500 text-sm mt-1">{date}</p>
    </div>
  );
};

const CityEvent = ({ title, date, location }) => {
  return (
    <div className="border-b pb-3 last:border-0 last:pb-0">
      <div className="flex items-center">
        <div className="p-2 rounded-lg bg-blue-50 text-blue-500 mr-3">
          <FiCalendar />
        </div>
        <div>
          <h5 className="font-medium">{title}</h5>
          <p className="text-gray-500 text-sm mt-1">{date} • {location}</p>
        </div>
      </div>
    </div>
  );
};

export default ServicesTab;

// import { FiMessageSquare, FiCheckCircle, FiUsers, FiCalendar, FiClock } from 'react-icons/fi';
// import { FaHandsHelping, FaClipboardCheck } from 'react-icons/fa';

// const ServicesTab = () => {
//   return (
//     <div className="p-6 bg-gray-50">
//       {/* Header with community-themed gradient */}
//       <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 p-6 mb-8">
//         <div className="absolute inset-0 opacity-20">
//           <div className="community-pattern"></div>
//         </div>
//         <div className="relative z-10">
//           <h1 className="text-3xl font-bold text-white">Citizen Services Hub</h1>
//           <p className="text-purple-100 mt-2">Connecting citizens with city services</p>
//         </div>
//       </div>

//       {/* Service Status Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
//         <ServiceStatusCard 
//           title="Open Requests" 
//           value="1,245" 
//           change="+12%" 
//           icon={<FiMessageSquare className="text-indigo-500" />}
//           color="indigo"
//         />
//         <ServiceStatusCard 
//           title="Resolved" 
//           value="1,089" 
//           change="+8%" 
//           icon={<FiCheckCircle className="text-green-500" />}
//           color="green"
//         />
//         <ServiceStatusCard 
//           title="Avg. Response" 
//           value="2.1 days" 
//           change="-0.3" 
//           icon={<FiClock className="text-amber-500" />}
//           color="amber"
//         />
//         <ServiceStatusCard 
//           title="Satisfaction" 
//           value="87%" 
//           change="+2%" 
//           icon={<FiUsers className="text-purple-500" />}
//           color="purple"
//         />
//       </div>

//       {/* Main Content Area */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
//         {/* Service Requests */}
//         <div className="bg-white rounded-2xl shadow-lg p-6 lg:col-span-2">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-xl font-semibold">Recent Service Requests</h2>
//             <div className="flex space-x-2">
//               <select className="bg-gray-100 border-0 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-indigo-300">
//                 <option>Last 7 Days</option>
//                 <option>Last 30 Days</option>
//                 <option>This Year</option>
//               </select>
//               <button className="px-3 py-1 bg-indigo-500 text-white rounded-lg text-sm hover:bg-indigo-600">
//                 + New Request
//               </button>
//             </div>
//           </div>
          
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="text-left text-gray-500 text-sm border-b">
//                   <th className="pb-3">ID</th>
//                   <th className="pb-3">Type</th>
//                   <th className="pb-3">Status</th>
//                   <th className="pb-3">Date</th>
//                   <th className="pb-3"></th>
//                 </tr>
//               </thead>
//               <tbody>
//                 <ServiceRequestRow 
//                   id="#SR-2456" 
//                   type="Pothole Repair" 
//                   status="In Progress" 
//                   date="2 hours ago"
//                 />
//                 <ServiceRequestRow 
//                   id="#SR-2455" 
//                   type="Street Light" 
//                   status="Assigned" 
//                   date="5 hours ago"
//                 />
//                 <ServiceRequestRow 
//                   id="#SR-2454" 
//                   type="Garbage" 
//                   status="Completed" 
//                   date="1 day ago"
//                 />
//                 <ServiceRequestRow 
//                   id="#SR-2453" 
//                   type="Park Maintenance" 
//                   status="Pending" 
//                   date="2 days ago"
//                 />
//                 <ServiceRequestRow 
//                   id="#SR-2452" 
//                   type="Noise Complaint" 
//                   status="Resolved" 
//                   date="3 days ago"
//                 />
//               </tbody>
//             </table>
//           </div>
          
//           <button className="mt-4 w-full py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
//             View All Requests
//           </button>
//         </div>

//         {/* Community Section */}
//         <div className="space-y-6">
//           <div className="bg-white rounded-2xl shadow-lg p-6">
//             <h2 className="text-xl font-semibold mb-4">Community Events</h2>
//             <div className="space-y-4">
//               <CommunityEvent 
//                 title="Cleanup Day" 
//                 date="May 15, 2023" 
//                 location="Central Park"
//                 category="Environment"
//               />
//               <CommunityEvent 
//                 title="Town Hall" 
//                 date="May 20, 2023" 
//                 location="City Hall"
//                 category="Government"
//               />
//               <CommunityEvent 
//                 title="Workshop" 
//                 date="May 25, 2023" 
//                 location="Library"
//                 category="Education"
//               />
//             </div>
//             <button className="mt-4 w-full py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
//               View All Events
//             </button>
//           </div>

//           <div className="bg-white rounded-2xl shadow-lg p-6">
//             <h2 className="text-xl font-semibold mb-4">Quick Services</h2>
//             <div className="grid grid-cols-2 gap-3">
//               <ServiceButton 
//                 icon={<FaClipboardCheck className="text-indigo-500" />}
//                 label="Submit Request"
//               />
//               <ServiceButton 
//                 icon={<FiCalendar className="text-green-500" />}
//                 label="Event Calendar"
//               />
//               <ServiceButton 
//                 icon={<FaHandsHelping className="text-amber-500" />}
//                 label="Volunteer"
//               />
//               <ServiceButton 
//                 icon={<FiUsers className="text-purple-500" />}
//                 label="Community"
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Analytics Section */}
//       <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
//         <h2 className="text-xl font-semibold mb-6">Service Analytics</h2>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <ServiceAnalytic 
//             title="Request Types" 
//             data={[
//               { name: 'Infrastructure', value: 42 },
//               { name: 'Utilities', value: 28 },
//               { name: 'Environment', value: 18 },
//               { name: 'Other', value: 12 }
//             ]}
//             color="indigo"
//           />
//           <ServiceAnalytic 
//             title="Resolution Time" 
//             data={[
//               { name: '<1 Day', value: 35 },
//               { name: '1-3 Days', value: 45 },
//               { name: '>3 Days', value: 20 }
//             ]}
//             color="green"
//           />
//           <ServiceAnalytic 
//             title="Satisfaction" 
//             data={[
//               { name: 'Happy', value: 65 },
//               { name: 'Neutral', value: 25 },
//               { name: 'Unhappy', value: 10 }
//             ]}
//             color="amber"
//           />
//         </div>
//       </div>

//       {/* Feedback Section */}
//       <div className="bg-white rounded-2xl shadow-lg p-6">
//         <h2 className="text-xl font-semibold mb-4">Give Feedback</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <h3 className="text-lg font-medium mb-3">How are we doing?</h3>
//             <p className="text-gray-500 mb-4">Help us improve our services by sharing your experience</p>
//             <div className="flex space-x-1 mb-4">
//               {[1, 2, 3, 4, 5].map((star) => (
//                 <button key={star} className="text-2xl text-amber-400">★</button>
//               ))}
//             </div>
//           </div>
//           <div>
//             <textarea 
//               className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-300" 
//               rows="3" 
//               placeholder="Your comments..."
//             ></textarea>
//             <button className="mt-3 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600">
//               Submit Feedback
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const ServiceStatusCard = ({ title, value, change, icon, color }) => {
//   const colorClasses = {
//     indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-200' },
//     green: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200' },
//     amber: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' },
//     purple: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' }
//   };

//   const currentColor = colorClasses[color] || colorClasses.indigo;
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

// const ServiceRequestRow = ({ id, type, status, date }) => {
//   const statusClasses = {
//     'Completed': { bg: 'bg-green-100', text: 'text-green-800' },
//     'In Progress': { bg: 'bg-blue-100', text: 'text-blue-800' },
//     'Assigned': { bg: 'bg-amber-100', text: 'text-amber-800' },
//     'Pending': { bg: 'bg-gray-100', text: 'text-gray-800' },
//     'Resolved': { bg: 'bg-purple-100', text: 'text-purple-800' }
//   };

//   const currentStatus = statusClasses[status] || statusClasses.Pending;

//   return (
//     <tr className="border-b hover:bg-gray-50">
//       <td className="py-3 font-medium">{id}</td>
//       <td className="py-3">{type}</td>
//       <td className="py-3">
//         <span className={`px-2 py-1 rounded-full text-xs ${currentStatus.bg} ${currentStatus.text}`}>
//           {status}
//         </span>
//       </td>
//       <td className="py-3 text-gray-500">{date}</td>
//       <td className="py-3 text-right">
//         <button className="text-indigo-500 hover:text-indigo-700 text-sm">
//           View
//         </button>
//       </td>
//     </tr>
//   );
// };

// const CommunityEvent = ({ title, date, location, category }) => {
//   const categoryClasses = {
//     'Environment': { bg: 'bg-green-100', text: 'text-green-800' },
//     'Government': { bg: 'bg-blue-100', text: 'text-blue-800' },
//     'Education': { bg: 'bg-purple-100', text: 'text-purple-800' }
//   };

//   const currentCategory = categoryClasses[category] || { bg: 'bg-gray-100', text: 'text-gray-800' };

//   return (
//     <div className="flex items-start">
//       <div className="p-2 rounded-lg bg-indigo-50 text-indigo-500 mr-3">
//         <FiCalendar />
//       </div>
//       <div className="flex-1">
//         <h3 className="font-medium">{title}</h3>
//         <div className="flex items-center mt-1">
//           <span className={`text-xs px-2 py-0.5 rounded-full ${currentCategory.bg} ${currentCategory.text} mr-2`}>
//             {category}
//           </span>
//           <span className="text-xs text-gray-500">{date} • {location}</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// const ServiceButton = ({ icon, label }) => {
//   return (
//     <button className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
//       <div className="p-2 rounded-full bg-white shadow-sm mb-2">
//         {icon}
//       </div>
//       <span className="text-sm text-gray-700">{label}</span>
//     </button>
//   );
// };

// const ServiceAnalytic = ({ title, data, color }) => {
//   const colorClasses = {
//     indigo: { bg: 'bg-indigo-500', text: 'text-indigo-600' },
//     green: { bg: 'bg-green-500', text: 'text-green-600' },
//     amber: { bg: 'bg-amber-500', text: 'text-amber-600' }
//   };

//   const currentColor = colorClasses[color] || colorClasses.indigo;

//   return (
//     <div className="bg-white p-4 rounded-lg border border-gray-100">
//       <h3 className="font-medium mb-3">{title}</h3>
//       <div className="space-y-3">
//         {data.map((item, index) => (
//           <div key={index}>
//             <div className="flex justify-between text-sm mb-1">
//               <span className="text-gray-600">{item.name}</span>
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

// export default ServicesTab;