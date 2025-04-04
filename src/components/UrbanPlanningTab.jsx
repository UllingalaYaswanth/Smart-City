const UrbanPlanningTab = () => {
    return (
      <div>
        <h3 className="text-xl font-semibold mb-6">Urban Development Planning</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-6 rounded-xl shadow-sm lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-medium">Zoning Map</h4>
              <select className="border rounded-lg px-3 py-1">
                <option>Residential</option>
                <option>Commercial</option>
                <option>Industrial</option>
                <option>Mixed Use</option>
              </select>
            </div>
            <div className="h-96 bg-gray-200 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Interactive Zoning Map Visualization</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h4 className="text-lg font-medium mb-4">Development Projects</h4>
              <div className="space-y-3">
                <ProjectItem 
                  name="Central Park Expansion" 
                  status="In Progress" 
                  completion="65%"
                />
                <ProjectItem 
                  name="Downtown Redevelopment" 
                  status="Planning" 
                  completion="15%"
                />
                <ProjectItem 
                  name="Northside Housing" 
                  status="Completed" 
                  completion="100%"
                />
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h4 className="text-lg font-medium mb-4">Population Density</h4>
              <div className="h-40 bg-gray-200 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Population Density Heatmap</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h4 className="text-lg font-medium mb-4">Land Use Distribution</h4>
            <div className="h-64 flex items-center justify-center">
              <div className="w-48 h-48 rounded-full border-8 border-blue-400 relative">
                <div className="absolute w-48 h-48 rounded-full border-8 border-green-400 rotate-90"></div>
                <div className="absolute w-48 h-48 rounded-full border-8 border-yellow-400 rotate-180"></div>
                <div className="absolute w-48 h-48 rounded-full border-8 border-red-400 rotate-270"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-2xl font-bold">100%</p>
                    <p className="text-sm">Total Land</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center space-x-6 mt-4">
              <LegendItem color="bg-blue-400" label="Residential" />
              <LegendItem color="bg-green-400" label="Commercial" />
              <LegendItem color="bg-yellow-400" label="Industrial" />
              <LegendItem color="bg-red-400" label="Public" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h4 className="text-lg font-medium mb-4">Building Permits</h4>
            <div className="h-64 flex items-center justify-center">
              <div className="w-full">
                <div className="flex justify-between mb-1">
                  <span>Q1</span>
                  <span>120</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div className="bg-blue-500 h-4 rounded-full" style={{width: '60%'}}></div>
                </div>
                
                <div className="flex justify-between mb-1 mt-4">
                  <span>Q2</span>
                  <span>145</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div className="bg-blue-500 h-4 rounded-full" style={{width: '72%'}}></div>
                </div>
                
                <div className="flex justify-between mb-1 mt-4">
                  <span>Q3</span>
                  <span>98</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div className="bg-blue-500 h-4 rounded-full" style={{width: '49%'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  const ProjectItem = ({ name, status, completion }) => {
    const getStatusColor = () => {
      switch(status) {
        case 'Completed': return 'bg-green-100 text-green-800';
        case 'In Progress': return 'bg-blue-100 text-blue-800';
        case 'Planning': return 'bg-yellow-100 text-yellow-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    };
    
    return (
      <div>
        <div className="flex justify-between items-center">
          <h5 className="font-medium">{name}</h5>
          <span className={`px-2 py-1 rounded-md text-xs ${getStatusColor()}`}>
            {status}
          </span>
        </div>
        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
          <div 
            className="h-2 rounded-full bg-blue-500" 
            style={{width: completion}}
          ></div>
        </div>
        <p className="text-right text-xs text-gray-500 mt-1">{completion}</p>
      </div>
    );
  };
  
  const LegendItem = ({ color, label }) => {
    return (
      <div className="flex items-center">
        <div className={`w-3 h-3 rounded-full ${color} mr-1`}></div>
        <span className="text-sm">{label}</span>
      </div>
    );
  };
  
  export default UrbanPlanningTab;