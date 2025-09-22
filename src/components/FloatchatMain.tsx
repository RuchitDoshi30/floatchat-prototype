import { useState, useEffect } from "react";
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
  Waves, Activity, Thermometer, Droplets, BarChart3, 
  ChevronDown, ChevronUp, Filter, RefreshCw, Download,
  Layers, ArrowLeftRight, LineChart, Settings, Eye,
  MapPin, Globe, MessageCircle, TrendingUp, Database,
  PanelRightOpen, PanelRightClose
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useFilters } from "./FilterContext";
import { DedicatedChatPanel } from "./DedicatedChatPanel";
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarTrigger, SidebarInset, useSidebar } from "@/components/ui/sidebar";

// Mock ocean data for Floatchat
const mockFloatData = [
  {
    id: "5906298",
    region: "North Atlantic",
    lat: 45.2,
    lon: -35.8,
    date: "2024-01-15",
    status: "Active",
    lastProfile: "2024-01-15T08:30:00Z",
    depths: [0, 10, 20, 50, 100, 200, 500, 1000, 1500, 2000],
    temperature: [18.5, 18.2, 17.8, 16.5, 14.2, 11.8, 8.5, 5.2, 3.8, 2.9],
    salinity: [35.2, 35.3, 35.4, 35.6, 35.8, 35.9, 35.7, 35.1, 34.9, 34.8],
    profileCount: 145,
    quality: "Good"
  },
  {
    id: "5906299",
    region: "North Atlantic",
    lat: 42.8,
    lon: -28.3,
    date: "2024-01-14",
    status: "Active",
    lastProfile: "2024-01-14T14:15:00Z",
    depths: [0, 10, 20, 50, 100, 200, 500, 1000, 1500, 1800],
    temperature: [15.2, 15.0, 14.8, 14.2, 12.8, 10.5, 7.8, 4.9, 3.5, 2.8],
    salinity: [35.8, 35.9, 36.0, 36.1, 36.0, 35.8, 35.5, 35.0, 34.8, 34.7],
    profileCount: 89,
    quality: "Good"
  },
  {
    id: "5906300",
    region: "Indian Ocean",
    lat: -15.5,
    lon: 68.2,
    date: "2024-01-13",
    status: "Active",
    lastProfile: "2024-01-13T11:45:00Z",
    depths: [0, 10, 20, 50, 100, 200, 500, 1000, 1500, 1850],
    temperature: [22.8, 22.5, 21.9, 20.1, 17.8, 14.2, 9.8, 6.1, 4.2, 3.1],
    salinity: [34.6, 34.7, 34.8, 35.0, 35.2, 35.4, 35.1, 34.8, 34.6, 34.5],
    profileCount: 203,
    quality: "Excellent"
  },
  {
    id: "5906301",
    region: "Pacific Ocean",
    lat: 35.7,
    lon: 140.9,
    date: "2024-01-12",
    status: "Maintenance",
    lastProfile: "2024-01-10T09:20:00Z",
    depths: [0, 10, 20, 50, 100, 200, 500, 1000, 1500, 2000],
    temperature: [19.8, 19.6, 19.2, 18.1, 16.5, 13.8, 9.2, 5.8, 3.9, 2.7],
    salinity: [34.2, 34.3, 34.4, 34.6, 34.8, 35.0, 34.9, 34.7, 34.5, 34.4],
    profileCount: 67,
    quality: "Fair"
  }
];

const globalStats = {
  activeFloats: 3847,
  totalProfiles: 2847592,
  dataQuality: 94.8,
  lastUpdate: "2024-01-15T12:00:00Z",
  regions: ["North Atlantic", "South Atlantic", "Pacific", "Indian", "Southern Ocean", "Arctic"]
};

export function FloatchatMain() {
  const { filters } = useFilters();
  const [selectedFloats, setSelectedFloats] = useState<string[]>(["5906298"]);
  const [selectedParameter, setSelectedParameter] = useState("temperature");
  const [depthRange, setDepthRange] = useState([0, 2000]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(true);
  const [viewMode, setViewMode] = useState<"overview" | "analysis" | "explore">("overview");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [showChatPanel, setShowChatPanel] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setShowChatPanel(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleFloat = (floatId: string) => {
    setSelectedFloats(prev => 
      prev.includes(floatId) 
        ? prev.filter(id => id !== floatId)
        : [...prev, floatId]
    );
  };

  const getParameterData = (float: any, param: string) => {
    switch (param) {
      case "temperature": return float.temperature;
      case "salinity": return float.salinity;
      case "depth": return float.depths;
      default: return float.temperature;
    }
  };

  const getParameterColor = (index: number) => {
    const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];
    return colors[index % colors.length];
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active": return "bg-green-100 text-green-800 border-green-200";
      case "maintenance": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "inactive": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const renderOverviewDashboard = () => (
    <div className="space-y-6">
      {/* Global Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-cyan-50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Waves className="w-4 h-4 text-blue-600" />
                Active Floats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700">{globalStats.activeFloats.toLocaleString()}</div>
              <div className="text-xs text-slate-600 mt-1">Worldwide network</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="shadow-lg border-0 bg-gradient-to-br from-emerald-50 to-teal-50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-600" />
                Total Profiles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-700">{(globalStats.totalProfiles / 1000000).toFixed(1)}M</div>
              <div className="text-xs text-slate-600 mt-1">Oceanographic measurements</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-violet-50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-purple-600" />
                Data Quality
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-700">{globalStats.dataQuality}%</div>
              <div className="text-xs text-slate-600 mt-1">Quality controlled</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="shadow-lg border-0 bg-gradient-to-br from-orange-50 to-coral-50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Globe className="w-4 h-4 text-orange-600" />
                Ocean Basins
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-700">{globalStats.regions.length}</div>
              <div className="text-xs text-slate-600 mt-1">Global coverage</div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Featured Floats Grid */}
      <Card className="shadow-xl border-0 bg-white/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Eye className="w-5 h-5 text-blue-600" />
              Featured Ocean Floats
              <Badge variant="outline" className="bg-gradient-to-r from-blue-100 to-cyan-100">
                {mockFloatData.length} available
              </Badge>
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-3 h-3 mr-1" />
              Filter
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockFloatData.map((float, index) => (
                <motion.div
                  key={float.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                    selectedFloats.includes(float.id)
                      ? "bg-gradient-to-r from-blue-100 to-cyan-100 border-blue-300 shadow-md"
                      : "bg-white/80 border-slate-200 hover:shadow-md hover:border-blue-200"
                  }`}
                  onClick={() => toggleFloat(float.id)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-base">Float #{float.id}</span>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getStatusColor(float.status)}`}
                      >
                        {float.status}
                      </Badge>
                    </div>
                    <div 
                      className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: getParameterColor(index) }}
                    />
                  </div>
                  
                  <div className="space-y-2 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3 h-3" />
                      {float.region} ({float.lat.toFixed(1)}°, {float.lon.toFixed(1)}°)
                    </div>
                    <div className="flex items-center gap-2">
                      <Activity className="w-3 h-3" />
                      {float.profileCount} profiles
                    </div>
                    <div className="flex items-center gap-2">
                      <Thermometer className="w-3 h-3" />
                      Last profile: {new Date(float.lastProfile).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-slate-500">
                      Max depth: {Math.max(...float.depths)}m
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <SidebarProvider>
      <div className="h-full flex">
        {/* Collapsible Sidebar */}
        <Sidebar className="border-r border-slate-200 bg-gradient-to-b from-slate-50 to-cyan-50">
          <SidebarHeader className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
                <Waves className="w-5 h-5 text-white" />
              </div>
              <div className="group-data-[collapsible=icon]:hidden">
                <div className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent font-semibold">
                  Floatchat
                </div>
                <div className="text-xs text-slate-600">Ocean Explorer</div>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-4 space-y-4">
            {/* Quick Stats */}
            <div className="space-y-3">
              <div className="group-data-[collapsible=icon]:hidden">
                <h3 className="text-sm font-medium text-slate-700 mb-2">Quick Stats</h3>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-2 rounded-lg bg-white/60 backdrop-blur-sm">
                  <div className="p-1.5 bg-blue-100 rounded-lg">
                    <Waves className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="group-data-[collapsible=icon]:hidden">
                    <div className="text-sm font-medium">{globalStats.activeFloats.toLocaleString()}</div>
                    <div className="text-xs text-slate-600">Active Floats</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-2 rounded-lg bg-white/60 backdrop-blur-sm">
                  <div className="p-1.5 bg-emerald-100 rounded-lg">
                    <Database className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="group-data-[collapsible=icon]:hidden">
                    <div className="text-sm font-medium">{(globalStats.totalProfiles / 1000000).toFixed(1)}M</div>
                    <div className="text-xs text-slate-600">Profiles</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-2 rounded-lg bg-white/60 backdrop-blur-sm">
                  <div className="p-1.5 bg-purple-100 rounded-lg">
                    <BarChart3 className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="group-data-[collapsible=icon]:hidden">
                    <div className="text-sm font-medium">{globalStats.dataQuality}%</div>
                    <div className="text-xs text-slate-600">Quality</div>
                  </div>
                </div>
              </div>
            </div>

            {/* View Mode Selection */}
            <div className="space-y-3">
              <div className="group-data-[collapsible=icon]:hidden">
                <h3 className="text-sm font-medium text-slate-700 mb-2">Exploration Mode</h3>
              </div>
              
              <div className="space-y-1">
                <Button
                  variant={viewMode === "overview" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("overview")}
                  className={`w-full justify-start gap-2 ${viewMode === "overview" ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white" : ""}`}
                >
                  <Globe className="w-4 h-4" />
                  <span className="group-data-[collapsible=icon]:hidden">Global Overview</span>
                </Button>
                
                <Button
                  variant={viewMode === "analysis" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("analysis")}
                  className={`w-full justify-start gap-2 ${viewMode === "analysis" ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white" : ""}`}
                >
                  <TrendingUp className="w-4 h-4" />
                  <span className="group-data-[collapsible=icon]:hidden">Deep Analysis</span>
                </Button>
                
                <Button
                  variant={viewMode === "explore" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("explore")}
                  className={`w-full justify-start gap-2 ${viewMode === "explore" ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white" : ""}`}
                >
                  <Layers className="w-4 h-4" />
                  <span className="group-data-[collapsible=icon]:hidden">Data Explorer</span>
                </Button>
              </div>
            </div>

            {/* Selected Floats Counter */}
            <div className="space-y-3">
              <div className="group-data-[collapsible=icon]:hidden">
                <h3 className="text-sm font-medium text-slate-700 mb-2">Selection</h3>
              </div>
              
              <div className="flex items-center gap-3 p-2 rounded-lg bg-gradient-to-r from-blue-100 to-cyan-100">
                <div className="p-1.5 bg-blue-500 rounded-lg">
                  <span className="text-white text-xs font-bold">{selectedFloats.length}</span>
                </div>
                <div className="group-data-[collapsible=icon]:hidden">
                  <div className="text-sm font-medium">Floats Selected</div>
                  <div className="text-xs text-slate-600">Ready for analysis</div>
                </div>
              </div>
            </div>
          </SidebarContent>
        </Sidebar>

        {/* Main Content Area */}
        <SidebarInset className="flex-1">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm border-b">
              <div className="flex items-center gap-3">
                <SidebarTrigger className="md:hidden" />
                <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  Floatchat Ocean Data Explorer
                </h1>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowChatPanel(!showChatPanel)}
                className="flex items-center gap-2"
              >
                {showChatPanel ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
                <span className="hidden sm:inline">{showChatPanel ? 'Hide Chat' : 'Show Chat'}</span>
              </Button>
            </div>

            {/* Scrollable Content */}
            <ScrollArea className="flex-1">
              <div className={`transition-all duration-300 ${showChatPanel && !isMobile ? 'mr-96' : ''}`}>
                <div className="p-4 md:p-6 space-y-6">
          {/* Advanced Controls */}
          <Collapsible open={showAdvancedFilters} onOpenChange={setShowAdvancedFilters}>
            <Card className="shadow-lg border-0 bg-white/60 backdrop-blur-sm">
              <CollapsibleTrigger asChild>
                <CardHeader className="pb-3 cursor-pointer hover:bg-white/10 transition-all duration-200">
                  <CardTitle className="text-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
                        <Waves className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                          Floatchat Ocean Data Explorer
                        </div>
                        <div className="text-sm text-slate-600 font-normal">
                          AI-powered ARGO float analysis and exploration
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-gradient-to-r from-blue-100 to-cyan-100">
                        {selectedFloats.length} floats selected
                      </Badge>
                    </div>
                    {showAdvancedFilters ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-4">
                  {/* View Mode Selection */}
                  <div className="flex items-center gap-4">
                    <Label className="font-medium">Exploration Mode:</Label>
                    <div className="flex gap-2">
                      <Button
                        variant={viewMode === "overview" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setViewMode("overview")}
                        className={viewMode === "overview" ? "bg-gradient-to-r from-blue-500 to-cyan-500" : ""}
                      >
                        <Globe className="w-3 h-3 mr-1" />
                        Global Overview
                      </Button>
                      <Button
                        variant={viewMode === "analysis" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setViewMode("analysis")}
                        className={viewMode === "analysis" ? "bg-gradient-to-r from-blue-500 to-cyan-500" : ""}
                      >
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Deep Analysis
                      </Button>
                      <Button
                        variant={viewMode === "explore" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setViewMode("explore")}
                        className={viewMode === "explore" ? "bg-gradient-to-r from-blue-500 to-cyan-500" : ""}
                      >
                        <Layers className="w-3 h-3 mr-1" />
                        Data Explorer
                      </Button>
                    </div>
                  </div>

                  {/* Advanced Filters */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Label className="text-sm text-slate-600 mb-2 block">Ocean Region</Label>
                      <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                        <SelectTrigger className="bg-white/80">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Regions</SelectItem>
                          {globalStats.regions.map(region => (
                            <SelectItem key={region} value={region.toLowerCase()}>
                              {region}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-sm text-slate-600 mb-2 block">Primary Parameter</Label>
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
                          <SelectItem value="depth">
                            <div className="flex items-center gap-2">
                              <Activity className="w-3 h-3 text-green-500" />
                              Depth Profile
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
                          id="real-time"
                          defaultChecked
                        />
                        <Label htmlFor="real-time" className="text-sm">
                          <Activity className="w-3 h-3 inline mr-1" />
                          Real-time Data
                        </Label>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/50">
                    <div className="text-sm text-slate-600">
                      🌊 Exploring {mockFloatData.length} floats • Last update: {new Date(globalStats.lastUpdate).toLocaleTimeString()}
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
                      <Button variant="outline" size="sm">
                        <Settings className="w-3 h-3 mr-1" />
                        Settings
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Main Content Area */}
          <AnimatePresence mode="wait">
            <motion.div
              key={viewMode}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {viewMode === "overview" && renderOverviewDashboard()}
              {viewMode === "analysis" && (
                <div className="space-y-6">
                  {/* Analysis Overview Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="shadow-xl border-0 bg-gradient-to-br from-blue-50 to-cyan-50 backdrop-blur-sm">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-blue-600" />
                          Temperature Trends
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="h-32 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg relative overflow-hidden">
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-full px-4">
                                <div className="h-2 bg-blue-500 rounded-full mb-2" style={{ width: '75%' }}></div>
                                <div className="h-2 bg-cyan-500 rounded-full mb-2" style={{ width: '85%' }}></div>
                                <div className="h-2 bg-blue-400 rounded-full" style={{ width: '65%' }}></div>
                              </div>
                            </div>
                            <div className="absolute top-2 left-2 text-xs font-medium text-blue-700">+0.3°C</div>
                            <div className="absolute bottom-2 right-2 text-xs text-blue-600">6 months</div>
                          </div>
                          <div className="text-xs text-slate-600">
                            <div className="flex justify-between mb-1">
                              <span>North Atlantic:</span>
                              <span className="text-blue-600 font-medium">Warming</span>
                            </div>
                            <div className="flex justify-between mb-1">
                              <span>Pacific:</span>
                              <span className="text-green-600 font-medium">Stable</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Southern Ocean:</span>
                              <span className="text-orange-600 font-medium">Cooling</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="shadow-xl border-0 bg-gradient-to-br from-emerald-50 to-teal-50 backdrop-blur-sm">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Droplets className="w-4 h-4 text-emerald-600" />
                          Salinity Patterns
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="h-32 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-lg relative overflow-hidden">
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-full px-4 space-y-2">
                                <div className="flex items-center gap-2">
                                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                                  <div className="flex-1 h-1 bg-emerald-200 rounded"></div>
                                  <span className="text-xs">38.2</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
                                  <div className="flex-1 h-1 bg-teal-200 rounded"></div>
                                  <span className="text-xs">35.8</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
                                  <div className="flex-1 h-1 bg-cyan-200 rounded"></div>
                                  <span className="text-xs">34.1</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="text-xs text-slate-600">
                            <div className="flex justify-between mb-1">
                              <span>Mediterranean:</span>
                              <span className="text-emerald-600 font-medium">High</span>
                            </div>
                            <div className="flex justify-between mb-1">
                              <span>Atlantic:</span>
                              <span className="text-teal-600 font-medium">Normal</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Arctic:</span>
                              <span className="text-cyan-600 font-medium">Decreasing</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="shadow-xl border-0 bg-gradient-to-br from-purple-50 to-violet-50 backdrop-blur-sm">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Activity className="w-4 h-4 text-purple-600" />
                          Data Quality
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="h-32 bg-gradient-to-r from-purple-100 to-violet-100 rounded-lg relative overflow-hidden">
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-center">
                                <div className="text-2xl font-bold text-purple-700 mb-1">94.8%</div>
                                <div className="text-xs text-purple-600">Quality Score</div>
                                <div className="w-16 h-2 bg-purple-200 rounded-full mt-2 mx-auto">
                                  <div className="w-15 h-2 bg-purple-500 rounded-full"></div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="text-xs text-slate-600">
                            <div className="flex justify-between mb-1">
                              <span>Good Quality:</span>
                              <span className="text-green-600 font-medium">3,647</span>
                            </div>
                            <div className="flex justify-between mb-1">
                              <span>Questionable:</span>
                              <span className="text-yellow-600 font-medium">187</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Bad Quality:</span>
                              <span className="text-red-600 font-medium">13</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Detailed Analysis Panels */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="shadow-xl border-0 bg-white/60 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="text-sm flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <BarChart3 className="w-4 h-4 text-blue-600" />
                            Multi-Parameter Correlation
                          </div>
                          <Button variant="outline" size="sm">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            View Details
                          </Button>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="h-48 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-4">
                            <div className="grid grid-cols-3 gap-4 h-full">
                              <div className="space-y-3">
                                <div className="text-xs font-medium text-slate-700">Temperature vs Salinity</div>
                                <div className="space-y-2">
                                  {[0.85, 0.72, 0.91].map((corr, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                      <div className="flex-1 text-xs">R² = {corr}</div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div className="space-y-3">
                                <div className="text-xs font-medium text-slate-700">Depth vs Pressure</div>
                                <div className="space-y-2">
                                  {[0.98, 0.97, 0.99].map((corr, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                      <div className="flex-1 text-xs">R² = {corr}</div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div className="space-y-3">
                                <div className="text-xs font-medium text-slate-700">Oxygen vs Temperature</div>
                                <div className="space-y-2">
                                  {[0.76, 0.68, 0.82].map((corr, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                      <div className="flex-1 text-xs">R² = {corr}</div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="text-xs text-slate-600">
                            Strong correlations detected between temperature and salinity in tropical regions. 
                            Oxygen levels show inverse relationship with temperature as expected.
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="shadow-xl border-0 bg-white/60 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="text-sm flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4 text-blue-600" />
                            Regional Climate Indicators
                          </div>
                          <Button variant="outline" size="sm">
                            <MapPin className="w-3 h-3 mr-1" />
                            View Map
                          </Button>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="h-48 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-4">
                            <div className="space-y-3">
                              {[
                                { region: "North Atlantic", temp: "+0.3°C", status: "warming", color: "red" },
                                { region: "Pacific Equatorial", temp: "-0.1°C", status: "cooling", color: "blue" },
                                { region: "Indian Ocean", temp: "+0.2°C", status: "warming", color: "orange" },
                                { region: "Southern Ocean", temp: "+0.1°C", status: "stable", color: "green" },
                                { region: "Arctic Waters", temp: "+0.8°C", status: "warming", color: "red" },
                                { region: "Mediterranean", temp: "+0.4°C", status: "warming", color: "red" }
                              ].map((data, i) => (
                                <div key={i} className="flex items-center justify-between p-2 rounded bg-white/60">
                                  <span className="text-xs font-medium">{data.region}</span>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs">{data.temp}</span>
                                    <div className={`w-2 h-2 rounded-full bg-${data.color}-500`}></div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="text-xs text-slate-600">
                            Global ocean warming trend observed with Arctic showing fastest temperature rise. 
                            Mediterranean and North Atlantic regions show significant warming signals.
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Advanced Analytics Summary */}
                  <Card className="shadow-xl border-0 bg-gradient-to-r from-blue-50/80 to-purple-50/80 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-blue-600" />
                          Advanced Analytics Summary
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Download className="w-3 h-3 mr-1" />
                            Export Report
                          </Button>
                          <Button variant="outline" size="sm">
                            <RefreshCw className="w-3 h-3 mr-1" />
                            Update Analysis
                          </Button>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-white/60 rounded-lg p-4 text-center">
                          <div className="text-xl font-bold text-blue-600">156</div>
                          <div className="text-xs text-slate-600">Anomalies Detected</div>
                        </div>
                        <div className="bg-white/60 rounded-lg p-4 text-center">
                          <div className="text-xl font-bold text-emerald-600">23</div>
                          <div className="text-xs text-slate-600">Trend Patterns</div>
                        </div>
                        <div className="bg-white/60 rounded-lg p-4 text-center">
                          <div className="text-xl font-bold text-purple-600">8</div>
                          <div className="text-xs text-slate-600">Climate Signals</div>
                        </div>
                        <div className="bg-white/60 rounded-lg p-4 text-center">
                          <div className="text-xl font-bold text-orange-600">94.8%</div>
                          <div className="text-xs text-slate-600">Analysis Confidence</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
              {viewMode === "explore" && (
                <div className="space-y-6">
                  {/* Data Explorer Header */}
                  <Card className="shadow-xl border-0 bg-gradient-to-r from-blue-50 to-cyan-50 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Database className="w-5 h-5 text-blue-600" />
                          Interactive Data Explorer
                          <Badge variant="outline" className="bg-white/80">
                            Live Data Stream
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Filter className="w-3 h-3 mr-1" />
                            Advanced Filters
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="w-3 h-3 mr-1" />
                            Bulk Export
                          </Button>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div>
                          <div className="text-lg font-bold text-blue-600">2.8M</div>
                          <div className="text-xs text-slate-600">Total Records</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-emerald-600">3,847</div>
                          <div className="text-xs text-slate-600">Active Floats</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-purple-600">45</div>
                          <div className="text-xs text-slate-600">Parameters</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-orange-600">6</div>
                          <div className="text-xs text-slate-600">Ocean Basins</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Data Browser Interface */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Parameter Selection */}
                    <Card className="shadow-xl border-0 bg-white/60 backdrop-blur-sm">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Layers className="w-4 h-4 text-blue-600" />
                          Parameter Selection
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-64">
                          <div className="space-y-2">
                            {[
                              { name: "Temperature", unit: "°C", count: "2.8M", color: "red" },
                              { name: "Salinity", unit: "PSU", count: "2.8M", color: "blue" },
                              { name: "Pressure", unit: "dbar", count: "2.8M", color: "green" },
                              { name: "Oxygen", unit: "μmol/kg", count: "1.2M", color: "purple" },
                              { name: "Chlorophyll", unit: "mg/m³", count: "890K", color: "emerald" },
                              { name: "Nitrate", unit: "μmol/L", count: "756K", color: "orange" },
                              { name: "pH", unit: "units", count: "645K", color: "pink" },
                              { name: "Backscatter", unit: "m⁻¹", count: "523K", color: "cyan" },
                              { name: "Fluorescence", unit: "RFU", count: "498K", color: "violet" },
                              { name: "Turbidity", unit: "NTU", count: "387K", color: "indigo" }
                            ].map((param, i) => (
                              <div key={i} className="flex items-center justify-between p-2 rounded hover:bg-white/80 cursor-pointer transition-colors">
                                <div className="flex items-center gap-2">
                                  <div className={`w-3 h-3 rounded-full bg-${param.color}-500`}></div>
                                  <span className="text-sm font-medium">{param.name}</span>
                                  <span className="text-xs text-slate-500">({param.unit})</span>
                                </div>
                                <span className="text-xs text-slate-600">{param.count}</span>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </CardContent>
                    </Card>

                    {/* Geographic Filter */}
                    <Card className="shadow-xl border-0 bg-white/60 backdrop-blur-sm">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Globe className="w-4 h-4 text-blue-600" />
                          Geographic Regions
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="h-32 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg relative overflow-hidden">
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-center">
                                <MapPin className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                                <div className="text-xs text-blue-700 font-medium">Global Coverage Map</div>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            {[
                              { region: "North Atlantic", floats: 1247, color: "blue" },
                              { region: "Pacific", floats: 1156, color: "emerald" },
                              { region: "Indian Ocean", floats: 673, color: "purple" },
                              { region: "Southern Ocean", floats: 567, color: "orange" },
                              { region: "Arctic", floats: 134, color: "cyan" },
                              { region: "Mediterranean", floats: 70, color: "pink" }
                            ].map((region, i) => (
                              <div key={i} className="flex items-center justify-between p-2 rounded hover:bg-white/60 cursor-pointer">
                                <div className="flex items-center gap-2">
                                  <div className={`w-2 h-2 rounded-full bg-${region.color}-500`}></div>
                                  <span className="text-xs">{region.region}</span>
                                </div>
                                <span className="text-xs text-slate-600">{region.floats}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Data Quality & Filters */}
                    <Card className="shadow-xl border-0 bg-white/60 backdrop-blur-sm">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Activity className="w-4 h-4 text-blue-600" />
                          Quality & Time Filters
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <Label className="text-xs text-slate-600 mb-2 block">Data Quality</Label>
                            <div className="space-y-2">
                              {[
                                { quality: "Excellent", count: "2.1M", percentage: 75 },
                                { quality: "Good", count: "623K", percentage: 22 },
                                { quality: "Fair", count: "87K", percentage: 3 }
                              ].map((q, i) => (
                                <div key={i} className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <input type="checkbox" className="w-3 h-3" defaultChecked />
                                    <span className="text-xs">{q.quality}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-slate-600">{q.count}</span>
                                    <div className="w-8 h-1 bg-slate-200 rounded">
                                      <div 
                                        className="h-1 bg-blue-500 rounded"
                                        style={{ width: `${q.percentage}%` }}
                                      ></div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <Label className="text-xs text-slate-600 mb-2 block">Time Period</Label>
                            <div className="space-y-2">
                              <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                                Last 7 days (145K records)
                              </Button>
                              <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                                Last 30 days (623K records)
                              </Button>
                              <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                                Last 6 months (1.8M records)
                              </Button>
                              <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                                All time (2.8M records)
                              </Button>
                            </div>
                          </div>

                          <div>
                            <Label className="text-xs text-slate-600 mb-2 block">Depth Range</Label>
                            <Slider
                              value={[0, 2000]}
                              min={0}
                              max={2000}
                              step={50}
                              className="w-full"
                            />
                            <div className="flex justify-between text-xs text-slate-500 mt-1">
                              <span>0m</span>
                              <span>2000m</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Data Preview Table */}
                  <Card className="shadow-xl border-0 bg-white/60 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <BarChart3 className="w-4 h-4 text-blue-600" />
                          Data Preview & Export
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <LineChart className="w-3 h-3 mr-1" />
                            Visualize
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="w-3 h-3 mr-1" />
                            Export Selection
                          </Button>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-64">
                        <div className="space-y-2">
                          <div className="grid grid-cols-7 gap-4 p-2 bg-slate-100 rounded text-xs font-medium">
                            <span>Float ID</span>
                            <span>Date</span>
                            <span>Lat/Lon</span>
                            <span>Depth (m)</span>
                            <span>Temp (°C)</span>
                            <span>Salinity</span>
                            <span>Quality</span>
                          </div>
                          {mockFloatData.map((float, i) => 
                            float.depths.slice(0, 3).map((depth, j) => (
                              <div key={`${i}-${j}`} className="grid grid-cols-7 gap-4 p-2 hover:bg-white/60 rounded text-xs">
                                <span className="font-medium">#{float.id}</span>
                                <span>{float.date}</span>
                                <span>{float.lat.toFixed(1)}, {float.lon.toFixed(1)}</span>
                                <span>{depth}</span>
                                <span>{float.temperature[j]}</span>
                                <span>{float.salinity[j]}</span>
                                <Badge variant="outline" className="text-xs">
                                  {float.quality}
                                </Badge>
                              </div>
                            ))
                          )}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>

                  {/* Export Options */}
                  <Card className="shadow-xl border-0 bg-gradient-to-r from-emerald-50/80 to-teal-50/80 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Download className="w-4 h-4 text-emerald-600" />
                        Export & Analysis Options
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                          <Database className="w-6 h-6 text-blue-500" />
                          <div className="text-center">
                            <div className="text-xs font-medium">NetCDF</div>
                            <div className="text-xs text-slate-600">Scientific format</div>
                          </div>
                        </Button>
                        <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                          <BarChart3 className="w-6 h-6 text-emerald-500" />
                          <div className="text-center">
                            <div className="text-xs font-medium">CSV</div>
                            <div className="text-xs text-slate-600">Spreadsheet ready</div>
                          </div>
                        </Button>
                        <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                          <LineChart className="w-6 h-6 text-purple-500" />
                          <div className="text-center">
                            <div className="text-xs font-medium">JSON</div>
                            <div className="text-xs text-slate-600">API compatible</div>
                          </div>
                        </Button>
                        <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                          <MessageCircle className="w-6 h-6 text-orange-500" />
                          <div className="text-center">
                            <div className="text-xs font-medium">AI Analysis</div>
                            <div className="text-xs text-slate-600">Smart insights</div>
                          </div>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
                </div>
              </div>
            </ScrollArea>
          </div>
        </SidebarInset>

      {/* Chat Panel */}
      <AnimatePresence>
        {showChatPanel && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={`${
              isMobile 
                ? 'fixed inset-0 z-50 bg-white' 
                : 'fixed right-0 top-0 bottom-0 w-96 bg-white/95 backdrop-blur-sm border-l shadow-2xl'
            }`}
          >
            {isMobile && (
              <div className="flex items-center justify-between p-4 border-b bg-white/80 backdrop-blur-sm">
                <h2 className="text-lg font-semibold">AI Assistant</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowChatPanel(false)}
                >
                  <PanelRightClose className="w-4 h-4" />
                </Button>
              </div>
            )}
            <DedicatedChatPanel />
          </motion.div>
        )}
      </AnimatePresence>
    </SidebarProvider>
  );
}