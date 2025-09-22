import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { ScrollArea } from "./ui/scroll-area";
import { 
  TrendingUp, Activity, Thermometer, Droplets, BarChart3, 
  ChevronDown, ChevronUp, Filter, RefreshCw, Download,
  Layers, ArrowLeftRight, LineChart, Settings, Eye
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useFilters } from "./FilterContext";

// Mock profile data
const mockProfiles = [
  {
    id: "5906298",
    region: "North Atlantic",
    date: "2024-01-15",
    depths: [0, 10, 20, 50, 100, 200, 500, 1000, 1500, 2000],
    temperature: [18.5, 18.2, 17.8, 16.5, 14.2, 11.8, 8.5, 5.2, 3.8, 2.9],
    salinity: [35.2, 35.3, 35.4, 35.6, 35.8, 35.9, 35.7, 35.1, 34.9, 34.8],
    pressure: [0, 10, 20, 50, 100, 200, 500, 1000, 1500, 2000],
  },
  {
    id: "5906299",
    region: "North Atlantic",
    date: "2024-01-14",
    depths: [0, 10, 20, 50, 100, 200, 500, 1000, 1500, 1800],
    temperature: [15.2, 15.0, 14.8, 14.2, 12.8, 10.5, 7.8, 4.9, 3.5, 2.8],
    salinity: [35.8, 35.9, 36.0, 36.1, 36.0, 35.8, 35.5, 35.0, 34.8, 34.7],
    pressure: [0, 10, 20, 50, 100, 200, 500, 1000, 1500, 1800],
  },
  {
    id: "5906300",
    region: "Indian Ocean",
    date: "2024-01-13",
    depths: [0, 10, 20, 50, 100, 200, 500, 1000, 1500, 1850],
    temperature: [22.8, 22.5, 21.9, 20.1, 17.8, 14.2, 9.8, 6.1, 4.2, 3.1],
    salinity: [34.6, 34.7, 34.8, 35.0, 35.2, 35.4, 35.1, 34.8, 34.6, 34.5],
    pressure: [0, 10, 20, 50, 100, 200, 500, 1000, 1500, 1850],
  },
];

export function DashboardProfileView() {
  const { filters } = useFilters();
  const [selectedProfiles, setSelectedProfiles] = useState<string[]>(["5906298"]);
  const [selectedParameter, setSelectedParameter] = useState("temperature");
  const [depthRange, setDepthRange] = useState([0, 2000]);
  const [showComparison, setShowComparison] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [viewMode, setViewMode] = useState<"profiles" | "timeseries">("profiles");

  const toggleProfile = (profileId: string) => {
    setSelectedProfiles(prev => 
      prev.includes(profileId) 
        ? prev.filter(id => id !== profileId)
        : [...prev, profileId]
    );
  };

  const getParameterData = (profile: any, param: string) => {
    switch (param) {
      case "temperature": return profile.temperature;
      case "salinity": return profile.salinity;
      case "pressure": return profile.pressure;
      default: return profile.temperature;
    }
  };

  const getParameterColor = (index: number) => {
    const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];
    return colors[index % colors.length];
  };

  const renderProfileChart = () => {
    const maxDepth = Math.max(...depthRange);
    const selectedData = mockProfiles.filter(p => selectedProfiles.includes(p.id));

    return (
      <div className="relative h-96 bg-gradient-to-b from-blue-50 to-blue-100 rounded-xl p-4 overflow-hidden">
        {/* Chart Background */}
        <div className="absolute inset-4">
          {/* Depth grid lines */}
          {[0, 500, 1000, 1500, 2000].map(depth => (
            <div
              key={depth}
              className="absolute w-full h-px bg-slate-300/50"
              style={{ top: `${(depth / maxDepth) * 100}%` }}
            >
              <span className="absolute -left-12 -top-2 text-xs text-slate-500">{depth}m</span>
            </div>
          ))}
        </div>

        {/* Profile Lines */}
        <svg className="absolute inset-4 w-full h-full">
          {selectedData.map((profile, profileIndex) => {
            const data = getParameterData(profile, selectedParameter);
            const minVal = Math.min(...data);
            const maxVal = Math.max(...data);
            const range = maxVal - minVal;

            return (
              <g key={profile.id}>
                {/* Profile line */}
                <motion.path
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.5, delay: profileIndex * 0.2 }}
                  d={`M ${data.map((value, i) => {
                    const x = ((value - minVal) / range) * 80 + 10; // 10-90% width
                    const y = (profile.depths[i] / maxDepth) * 90; // 0-90% height
                    return `${i === 0 ? 'M' : 'L'} ${x}% ${y}%`;
                  }).join(' ')}`}
                  stroke={getParameterColor(profileIndex)}
                  strokeWidth="3"
                  fill="none"
                  className="drop-shadow-sm"
                />
                
                {/* Data points */}
                {data.map((value, i) => {
                  const x = ((value - minVal) / range) * 80 + 10;
                  const y = (profile.depths[i] / maxDepth) * 90;
                  
                  return (
                    <motion.circle
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: profileIndex * 0.2 + i * 0.1 }}
                      cx={`${x}%`}
                      cy={`${y}%`}
                      r="4"
                      fill={getParameterColor(profileIndex)}
                      className="cursor-pointer hover:scale-125 transition-transform"
                    />
                  );
                })}
              </g>
            );
          })}
        </svg>

        {/* Parameter axis */}
        <div className="absolute bottom-0 left-4 right-4 h-8 flex justify-between items-center text-xs text-slate-600">
          <span>Parameter Values</span>
          <span>{selectedParameter === "temperature" ? "°C" : selectedParameter === "salinity" ? "PSU" : "dbar"}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      <ScrollArea className="flex-1">
        <div className="space-y-4">
      {/* Integrated Controls */}
      <Collapsible open={showFilters} onOpenChange={setShowFilters}>
        <Card className="shadow-lg border-0 bg-white/60 backdrop-blur-sm">
          <CollapsibleTrigger asChild>
            <CardHeader className="pb-3 cursor-pointer hover:bg-white/10 transition-all duration-200">
              <CardTitle className="text-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Filter className="w-4 h-4 text-blue-600" />
                  Profile Analysis Controls
                  <Badge variant="outline" className="text-xs bg-gradient-to-r from-blue-100 to-cyan-100">
                    {selectedProfiles.length} profiles selected
                  </Badge>
                </div>
                {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              {/* View Mode Selection */}
              <div className="flex items-center gap-4">
                <Label className="text-sm font-medium">View Mode:</Label>
                <div className="flex gap-2">
                  <Button
                    variant={viewMode === "profiles" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("profiles")}
                    className={viewMode === "profiles" ? "bg-gradient-to-r from-blue-500 to-cyan-500" : ""}
                  >
                    <Layers className="w-3 h-3 mr-1" />
                    Depth Profiles
                  </Button>
                  <Button
                    variant={viewMode === "timeseries" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("timeseries")}
                    className={viewMode === "timeseries" ? "bg-gradient-to-r from-blue-500 to-cyan-500" : ""}
                  >
                    <LineChart className="w-3 h-3 mr-1" />
                    Time Series
                  </Button>
                </div>
              </div>

              {/* Parameter Selection */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm text-slate-600 mb-2 block">Parameter</Label>
                  <Select value={selectedParameter} onValueChange={setSelectedParameter}>
                    <SelectTrigger className="bg-white/80">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="temperature">
                        <div className="flex items-center gap-2">
                          <Thermometer className="w-3 h-3 text-red-500" />
                          Temperature
                        </div>
                      </SelectItem>
                      <SelectItem value="salinity">
                        <div className="flex items-center gap-2">
                          <Droplets className="w-3 h-3 text-blue-500" />
                          Salinity
                        </div>
                      </SelectItem>
                      <SelectItem value="pressure">
                        <div className="flex items-center gap-2">
                          <Activity className="w-3 h-3 text-green-500" />
                          Pressure
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm text-slate-600 mb-2 block">
                    Depth Range: {depthRange[0]}m - {depthRange[1]}m
                  </Label>
                  <Slider
                    value={depthRange}
                    onValueChange={setDepthRange}
                    min={0} max={2000} step={50}
                    className="w-full"
                  />
                </div>

                <div className="flex items-end gap-2">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="comparison"
                      checked={showComparison}
                      onCheckedChange={setShowComparison}
                    />
                    <Label htmlFor="comparison" className="text-sm">
                      <ArrowLeftRight className="w-3 h-3 inline mr-1" />
                      Multi-Profile
                    </Label>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-xs text-slate-600">
                  📊 Analyzing {selectedProfiles.length} profile(s) • {selectedParameter} parameter
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Refresh
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-3 h-3 mr-1" />
                    Export
                  </Button>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Main Profile Visualization */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Profile Selection Panel */}
        <Card className="lg:col-span-1 shadow-lg border-0 bg-white/60 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Eye className="w-4 h-4 text-blue-600" />
              Available Profiles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {mockProfiles.map((profile, index) => (
              <motion.div
                key={profile.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                  selectedProfiles.includes(profile.id)
                    ? "bg-gradient-to-r from-blue-100 to-cyan-100 border-blue-300 shadow-md"
                    : "bg-white/80 border-slate-200 hover:shadow-md"
                }`}
                onClick={() => toggleProfile(profile.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">#{profile.id}</span>
                  <div 
                    className="w-3 h-3 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: getParameterColor(index) }}
                  />
                </div>
                <div className="text-xs text-slate-600 space-y-1">
                  <div>📍 {profile.region}</div>
                  <div>📅 {profile.date}</div>
                  <div>📊 {profile.depths.length} measurements</div>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        {/* Main Chart Area */}
        <Card className="lg:col-span-3 shadow-xl border-0 bg-white/60 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                {viewMode === "profiles" ? "Depth Profiles" : "Time Series Analysis"}
                <Badge variant="outline" className="text-xs capitalize">
                  {selectedParameter}
                </Badge>
              </div>
              <Button variant="outline" size="sm">
                <BarChart3 className="w-3 h-3 mr-1" />
                View Stats
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {viewMode === "profiles" ? renderProfileChart() : (
              <div className="h-96 bg-gradient-to-r from-slate-100 to-slate-200 rounded-xl flex items-center justify-center">
                <div className="text-center text-slate-600">
                  <LineChart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <div className="text-lg font-medium">Time Series View</div>
                  <div className="text-sm">Surface measurements over time</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Profile Statistics */}
      <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-50/80 to-cyan-50/80 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-600" />
            Profile Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {selectedProfiles.map((profileId, index) => {
              const profile = mockProfiles.find(p => p.id === profileId);
              if (!profile) return null;
              
              const data = getParameterData(profile, selectedParameter);
              const avgValue = (data.reduce((a, b) => a + b, 0) / data.length).toFixed(2);
              const maxValue = Math.max(...data).toFixed(2);
              const minValue = Math.min(...data).toFixed(2);
              
              return (
                <motion.div
                  key={profileId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/70 rounded-lg p-3"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getParameterColor(index) }}
                    />
                    <span className="font-medium text-sm">#{profileId}</span>
                  </div>
                  <div className="text-xs space-y-1 text-slate-600">
                    <div>Avg: {avgValue} {selectedParameter === "temperature" ? "°C" : selectedParameter === "salinity" ? "PSU" : "dbar"}</div>
                    <div>Range: {minValue} - {maxValue}</div>
                    <div>Depth: {Math.max(...profile.depths)}m</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
        </div>
      </ScrollArea>
    </div>
  );
}