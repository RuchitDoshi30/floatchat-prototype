import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import { Input } from "./ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Progress } from "./ui/progress";
import { Separator } from "./ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { ScrollArea } from "./ui/scroll-area";
import { 
  MapPin, Navigation, Waves, Route, Thermometer, Droplets, Calendar, 
  Eye, EyeOff, Maximize2, RotateCcw, Play, Pause, Settings,
  TrendingUp, Activity, AlertTriangle, CheckCircle, Box, Globe,
  ChevronDown, ChevronUp, Filter, RefreshCw
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { motion, AnimatePresence } from "motion/react";
import { useFilters } from "./FilterContext";

// Enhanced mock data for ARGO floats with realistic global positions
const mockFloats = [
  { 
    id: "5906298", lat: 35.2, lng: -65.8, temp: 18.5, salinity: 35.2, pressure: 203.1,
    depth: 2000, status: "active", lastProfile: "2024-01-15", bgcEnabled: false, qc: "GOOD",
    platform: "APEX", deploymentDate: "2023-06-15", cycleNumber: 127, batteryLevel: 85,
    region: "North Atlantic", trajectory: [
      { lat: 35.2, lng: -65.8, date: "2024-01-15", temp: 18.5, depth: 2000 },
      { lat: 35.1, lng: -65.9, date: "2024-01-14", temp: 18.2, depth: 1980 },
      { lat: 35.0, lng: -66.0, date: "2024-01-13", temp: 18.0, depth: 1950 },
    ]
  },
  { 
    id: "5906299", lat: 40.1, lng: -70.2, temp: 15.2, salinity: 35.8, pressure: 182.4,
    depth: 1800, status: "active", lastProfile: "2024-01-14", bgcEnabled: true, qc: "GOOD",
    platform: "NOVA", deploymentDate: "2023-08-22", cycleNumber: 89, batteryLevel: 92,
    region: "North Atlantic", trajectory: [
      { lat: 40.1, lng: -70.2, date: "2024-01-14", temp: 15.2, depth: 1800 },
      { lat: 40.0, lng: -70.3, date: "2024-01-13", temp: 15.0, depth: 1780 },
    ]
  },
  { 
    id: "5906300", lat: -20.5, lng: 115.3, temp: 22.8, salinity: 34.6, pressure: 187.2,
    depth: 1850, status: "active", lastProfile: "2024-01-13", bgcEnabled: true, qc: "GOOD",
    platform: "APEX", deploymentDate: "2023-07-10", cycleNumber: 156, batteryLevel: 78,
    region: "Indian Ocean", trajectory: [
      { lat: -20.5, lng: 115.3, date: "2024-01-13", temp: 22.8, depth: 1850 },
      { lat: -20.4, lng: 115.2, date: "2024-01-12", temp: 22.5, depth: 1830 },
    ]
  },
  { 
    id: "5906301", lat: 35.7, lng: 139.7, temp: 16.4, salinity: 34.1, pressure: 198.7,
    depth: 1950, status: "active", lastProfile: "2024-01-12", bgcEnabled: false, qc: "GOOD",
    platform: "NAVIS", deploymentDate: "2023-09-15", cycleNumber: 134, batteryLevel: 89,
    region: "North Pacific", trajectory: [
      { lat: 35.7, lng: 139.7, date: "2024-01-12", temp: 16.4, depth: 1950 },
      { lat: 35.6, lng: 139.8, date: "2024-01-11", temp: 16.2, depth: 1920 },
    ]
  },
];

export function DashboardMapView() {
  const { filters, updateFilters } = useFilters();
  const [selectedFloat, setSelectedFloat] = useState<string | null>(null);
  const [hoveredFloat, setHoveredFloat] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(true);

  // Filter floats based on current filter state
  const filteredFloats = useMemo(() => {
    return mockFloats.filter(float => {
      if (filters.floatOptions.bgcOnly && !float.bgcEnabled) return false;
      if (filters.floatOptions.qcFilter && float.qc !== "GOOD") return false;
      if (float.lat < filters.latitude[0] || float.lat > filters.latitude[1]) return false;
      if (float.lng < filters.longitude[0] || float.lng > filters.longitude[1]) return false;
      if (float.depth < filters.depthRange[0] || float.depth > filters.depthRange[1]) return false;
      return true;
    });
  }, [filters]);

  // Convert lat/lng to screen coordinates for global projection
  const getScreenPosition = (lat: number, lng: number) => {
    const x = ((lng + 180) / 360) * 100;
    const y = ((90 - lat) / 180) * 100;
    return { x: Math.max(5, Math.min(95, x)), y: Math.max(10, Math.min(90, y)) };
  };

  const FloatDetailDialog = ({ float }: { float: any }) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Eye className="w-3 h-3 mr-1" />
          View Details
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl bg-gradient-to-br from-blue-50 to-cyan-50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Navigation className="w-5 h-5 text-blue-600" />
            Float #{float.id} - {float.region}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-white/60 rounded-lg p-3 text-center">
              <div className="text-lg font-semibold text-blue-600">{float.cycleNumber}</div>
              <div className="text-xs text-slate-600">Cycles</div>
            </div>
            <div className="bg-white/60 rounded-lg p-3 text-center">
              <div className="text-lg font-semibold text-green-600">{float.batteryLevel}%</div>
              <div className="text-xs text-slate-600">Battery</div>
            </div>
            <div className="bg-white/60 rounded-lg p-3 text-center">
              <div className="text-lg font-semibold text-purple-600">{float.depth}m</div>
              <div className="text-xs text-slate-600">Max Depth</div>
            </div>
            <div className="bg-white/60 rounded-lg p-3 text-center">
              <div className="text-lg font-semibold text-orange-600">{float.platform}</div>
              <div className="text-xs text-slate-600">Platform</div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <TooltipProvider>
      <div className="h-full flex flex-col">
        <ScrollArea className="flex-1">
          <div className="space-y-4">
            {/* Integrated Filter Controls */}
            <Collapsible open={showFilters} onOpenChange={setShowFilters}>
              <Card className="shadow-lg border-0 bg-white/60 backdrop-blur-sm">
                <CollapsibleTrigger asChild>
                  <CardHeader className="pb-3 cursor-pointer hover:bg-white/10 transition-all duration-200">
                    <CardTitle className="text-sm flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Filter className="w-4 h-4 text-blue-600" />
                        Map Controls & Filters
                        <Badge variant="outline" className="text-xs bg-gradient-to-r from-blue-100 to-cyan-100">
                          {filteredFloats.length} floats visible
                        </Badge>
                      </div>
                      {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-4">
                    {/* Map Display Options */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="trajectories"
                          checked={filters.floatOptions.trajectory}
                          onCheckedChange={(checked: any) => 
                            updateFilters({
                              floatOptions: { ...filters.floatOptions, trajectory: checked }
                            })
                          }
                        />
                        <Label htmlFor="trajectories" className="text-sm">
                          <Route className="w-3 h-3 inline mr-1" />
                          Trajectories
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="bgc-only"
                          checked={filters.floatOptions.bgcOnly}
                          onCheckedChange={(checked: any) => 
                            updateFilters({
                              floatOptions: { ...filters.floatOptions, bgcOnly: checked }
                            })
                          }
                        />
                        <Label htmlFor="bgc-only" className="text-sm">BGC Only</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="3d-mode"
                          checked={filters.mapMode === "3d"}
                          onCheckedChange={(checked: any) => 
                            updateFilters({ mapMode: checked ? "3d" : "2d" })
                          }
                        />
                        <Label htmlFor="3d-mode" className="text-sm">
                          <Box className="w-3 h-3 inline mr-1" />
                          3D Depth
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="qc-filter"
                          checked={filters.floatOptions.qcFilter}
                          onCheckedChange={(checked: any) => 
                            updateFilters({
                              floatOptions: { ...filters.floatOptions, qcFilter: checked }
                            })
                          }
                        />
                        <Label htmlFor="qc-filter" className="text-sm">Good QC Only</Label>
                      </div>
                    </div>

                    <Separator />

                    {/* Geographic and Depth Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label className="text-xs text-slate-600 mb-2 block">
                          Latitude: {filters.latitude[0]}° to {filters.latitude[1]}°
                        </Label>
                        <Slider
                          value={filters.latitude}
                          onValueChange={(value: [number, number]) => updateFilters({ latitude: value as [number, number] })}
                          min={-90} max={90} step={5}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-slate-600 mb-2 block">
                          Longitude: {filters.longitude[0]}° to {filters.longitude[1]}°
                        </Label>
                        <Slider
                          value={filters.longitude}
                          onValueChange={(value: [number, number]) => updateFilters({ longitude: value as [number, number] })}
                          min={-180} max={180} step={10}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-slate-600 mb-2 block">
                          Depth: {filters.depthRange[0]}m to {filters.depthRange[1]}m
                        </Label>
                        <Slider
                          value={filters.depthRange}
                          onValueChange={(value: [number, number]) => updateFilters({ depthRange: value as [number, number] })}
                          min={0} max={3000} step={100}
                          className="w-full"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-xs text-slate-600">
                        🌐 Showing {filteredFloats.length} of {mockFloats.length} floats globally
                      </div>
                      <Button variant="outline" size="sm">
                        <RefreshCw className="w-3 h-3 mr-1" />
                        Refresh Data
                      </Button>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Global Ocean Map */}
            <Card className="shadow-xl border-0 bg-white/60 backdrop-blur-sm overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-blue-600" />
                    Global ARGO Float Network
                    {filters.mapMode === "3d" && (
                      <Badge variant="outline" className="text-xs bg-purple-100 text-purple-700">
                        3D Depth Visualization
                      </Badge>
                    )}
                  </div>
                  <Button variant="outline" size="sm">
                    <Maximize2 className="w-3 h-3 mr-1" />
                    Fullscreen
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="relative h-96 bg-gradient-to-b from-sky-200 via-blue-300 to-blue-800 overflow-hidden">
                  {/* Global Ocean Map Background */}
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1713098965471-d324f294a71d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b3JsZCUyMG9jZWFuJTIwbWFwJTIwc2F0ZWxsaXRlJTIwdmlldyUyMGJsdWV8ZW58MXx8fHwxNzU4NTU3MTIwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="Global ocean satellite view"
                    className="absolute inset-0 w-full h-full object-cover opacity-70"
                  />
                  
                  {/* Grid Lines for Geographic Reference */}
                  <div className="absolute inset-0 opacity-20">
                    {/* Latitude lines */}
                    {[-60, -30, 0, 30, 60].map(lat => (
                      <div
                        key={lat}
                        className="absolute w-full h-px bg-white/40"
                        style={{ top: `${((90 - lat) / 180) * 100}%` }}
                      />
                    ))}
                    {/* Longitude lines */}
                    {[-120, -60, 0, 60, 120].map(lng => (
                      <div
                        key={lng}
                        className="absolute h-full w-px bg-white/40"
                        style={{ left: `${((lng + 180) / 360) * 100}%` }}
                      />
                    ))}
                  </div>

                  {/* Float Markers with Global Positioning */}
                  {filteredFloats.map((float) => {
                    const position = getScreenPosition(float.lat, float.lng);
                    
                    return (
                      <Tooltip key={float.id}>
                        <TooltipTrigger asChild>
                          <motion.div
                            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                            style={{
                              left: `${position.x}%`,
                              top: `${position.y}%`,
                              zIndex: selectedFloat === float.id ? 20 : hoveredFloat === float.id ? 15 : 10
                            }}
                            whileHover={{ scale: 1.4, rotate: 5 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setSelectedFloat(selectedFloat === float.id ? null : float.id)}
                            onMouseEnter={() => setHoveredFloat(float.id)}
                            onMouseLeave={() => setHoveredFloat(null)}
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: Math.random() * 0.5, type: "spring", stiffness: 200 }}
                          >
                            <div className={`relative transition-all duration-300 ${
                              selectedFloat === float.id ? "ring-4 ring-white ring-offset-2 ring-offset-blue-100" : 
                              hoveredFloat === float.id ? "ring-2 ring-white ring-offset-1" : ""
                            }`}>
                              <div className={`w-4 h-4 rounded-full shadow-xl transition-all duration-200 ${
                                float.status === "active" 
                                  ? "bg-gradient-to-br from-green-400 via-emerald-500 to-green-600" 
                                  : "bg-gradient-to-br from-red-400 via-pink-500 to-red-600"
                              } ${hoveredFloat === float.id || selectedFloat === float.id ? "animate-pulse" : ""}`}>
                                
                                {/* BGC Indicator */}
                                {float.bgcEnabled && (
                                  <motion.div 
                                    className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full border border-white"
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                  />
                                )}
                              </div>
                            </div>
                          </motion.div>
                        </TooltipTrigger>
                        <TooltipContent className="bg-slate-900 text-white p-4 rounded-xl shadow-2xl border-none max-w-xs">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="font-semibold">Float #{float.id}</div>
                              <Badge variant="outline" className="text-xs bg-slate-800 text-slate-300 border-slate-600">
                                {float.region}
                              </Badge>
                            </div>
                            <Separator className="bg-slate-700" />
                            <div className="text-xs space-y-1.5">
                              <div className="flex items-center gap-2">
                                <MapPin className="w-3 h-3 text-blue-400" />
                                <span>{float.lat.toFixed(1)}°, {float.lng.toFixed(1)}°</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Thermometer className="w-3 h-3 text-red-400" />
                                <span>{float.temp}°C</span>
                                <Droplets className="w-3 h-3 text-blue-400 ml-2" />
                                <span>{float.salinity} PSU</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <TrendingUp className="w-3 h-3 text-green-400" />
                                <span>Depth: {float.depth}m</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Activity className="w-3 h-3 text-orange-400" />
                                <span>Battery: {float.batteryLevel}%</span>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-1 pt-2">
                              <Badge variant={float.qc === "GOOD" ? "outline" : "destructive"} className="text-xs">
                                {float.qc}
                              </Badge>
                              {float.bgcEnabled && (
                                <Badge variant="outline" className="text-xs bg-purple-900 text-purple-300 border-purple-600">
                                  BGC
                                </Badge>
                              )}
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                  
                  {/* Enhanced Legend */}
                  <motion.div 
                    className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-2xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="space-y-3">
                      <div className="text-sm font-medium text-slate-800">Global Float Status</div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-gradient-to-br from-green-400 to-emerald-500"></div>
                          <span className="text-xs">Active ({filteredFloats.filter(f => f.status === 'active').length})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-gradient-to-br from-red-400 to-pink-500"></div>
                          <span className="text-xs">Inactive ({filteredFloats.filter(f => f.status === 'inactive').length})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-gradient-to-br from-purple-400 to-pink-400"></div>
                          <span className="text-xs">BGC ({filteredFloats.filter(f => f.bgcEnabled).length})</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Live Data Indicator */}
                  <motion.div
                    className="absolute top-4 right-4 flex items-center gap-2 bg-green-100/95 backdrop-blur-sm px-3 py-2 rounded-full shadow-lg"
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-700 font-medium">Live Global Data</span>
                  </motion.div>
                </div>
              </CardContent>
            </Card>

            {/* Selected Float Analysis Panel */}
            <AnimatePresence>
              {selectedFloat && (() => {
                const float = mockFloats.find(f => f.id === selectedFloat);
                if (!float) return null;
                
                return (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -20 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -20 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <Card className="shadow-xl border-0 bg-gradient-to-br from-blue-50/95 via-cyan-50/95 to-purple-50/95 backdrop-blur-sm">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Navigation className="w-4 h-4 text-blue-600" />
                            Float #{selectedFloat} - {float.region} Analysis
                          </div>
                          <div className="flex items-center gap-2">
                            <FloatDetailDialog float={float} />
                            <Button variant="ghost" size="sm" onClick={() => setSelectedFloat(null)}>
                              <EyeOff className="w-3 h-3" />
                            </Button>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                          <div className="bg-white/60 rounded-lg p-3">
                            <div className="text-sm font-medium text-slate-800 mb-2">Platform Details</div>
                            <div className="space-y-2 text-xs">
                              <div>Platform: {float.platform}</div>
                              <div>Deployed: {float.deploymentDate}</div>
                              <div>Cycle: {float.cycleNumber}</div>
                            </div>
                          </div>
                          <div className="bg-white/60 rounded-lg p-3">
                            <div className="text-sm font-medium text-slate-800 mb-2">Latest Measurements</div>
                            <div className="space-y-2 text-xs">
                              <div>Temperature: {float.temp}°C</div>
                              <div>Salinity: {float.salinity} PSU</div>
                              <div>Pressure: {float.pressure} dbar</div>
                            </div>
                          </div>
                          <div className="bg-white/60 rounded-lg p-3">
                            <div className="text-sm font-medium text-slate-800 mb-2">Status Information</div>
                            <div className="space-y-2 text-xs">
                              <div>Status: {float.status}</div>
                              <div>Battery: {float.batteryLevel}%</div>
                              <div>QC Status: {float.qc}</div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })()}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </div>
    </TooltipProvider>
  );
}