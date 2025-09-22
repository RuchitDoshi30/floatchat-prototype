import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Progress } from "./ui/progress";
import { Separator } from "./ui/separator";
import { 
  MapPin, Navigation, Waves, Route, Thermometer, Droplets, Calendar, 
  Eye, EyeOff, Maximize2, RotateCcw, Play, Pause, Volume2, Settings,
  TrendingUp, Activity, AlertTriangle, CheckCircle, Box
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { motion, AnimatePresence } from "motion/react";
import { useFilters } from "./FilterContext";

// Enhanced mock data for ARGO floats with more detailed trajectory and metadata
const mockFloats = [
  { 
    id: "5906298", 
    lat: 35.2, 
    lng: -65.8, 
    temp: 18.5, 
    salinity: 35.2, 
    pressure: 203.1,
    depth: 2000,
    status: "active",
    lastProfile: "2024-01-15",
    bgcEnabled: false,
    qc: "GOOD",
    platform: "APEX",
    deploymentDate: "2023-06-15",
    cycleNumber: 127,
    batteryLevel: 85,
    trajectory: [
      { lat: 35.2, lng: -65.8, date: "2024-01-15", temp: 18.5, depth: 2000 },
      { lat: 35.1, lng: -65.9, date: "2024-01-14", temp: 18.2, depth: 1980 },
      { lat: 35.0, lng: -66.0, date: "2024-01-13", temp: 18.0, depth: 1950 },
      { lat: 34.9, lng: -66.1, date: "2024-01-12", temp: 17.8, depth: 1920 },
      { lat: 34.8, lng: -66.2, date: "2024-01-11", temp: 17.5, depth: 1900 },
    ]
  },
  { 
    id: "5906299", 
    lat: 40.1, 
    lng: -70.2, 
    temp: 15.2, 
    salinity: 35.8, 
    pressure: 182.4,
    depth: 1800,
    status: "active",
    lastProfile: "2024-01-14",
    bgcEnabled: true,
    qc: "GOOD",
    platform: "NOVA",
    deploymentDate: "2023-08-22",
    cycleNumber: 89,
    batteryLevel: 92,
    trajectory: [
      { lat: 40.1, lng: -70.2, date: "2024-01-14", temp: 15.2, depth: 1800 },
      { lat: 40.0, lng: -70.3, date: "2024-01-13", temp: 15.0, depth: 1780 },
      { lat: 39.9, lng: -70.4, date: "2024-01-12", temp: 14.8, depth: 1760 },
      { lat: 39.8, lng: -70.5, date: "2024-01-11", temp: 14.5, depth: 1740 },
    ]
  },
  { 
    id: "5906300", 
    lat: 32.8, 
    lng: -64.1, 
    temp: 20.1, 
    salinity: 34.9, 
    pressure: 197.8,
    depth: 1950,
    status: "inactive",
    lastProfile: "2024-01-10",
    bgcEnabled: false,
    qc: "QUESTIONABLE",
    platform: "APEX",
    deploymentDate: "2023-05-10",
    cycleNumber: 156,
    batteryLevel: 23,
    trajectory: [
      { lat: 32.8, lng: -64.1, date: "2024-01-10", temp: 20.1, depth: 1950 },
      { lat: 32.7, lng: -64.2, date: "2024-01-09", temp: 20.0, depth: 1940 },
    ]
  },
  { 
    id: "5906301", 
    lat: 38.5, 
    lng: -68.9, 
    temp: 16.8, 
    salinity: 35.4, 
    pressure: 212.9,
    depth: 2100,
    status: "active",
    lastProfile: "2024-01-12",
    bgcEnabled: true,
    qc: "GOOD",
    platform: "NAVIS",
    deploymentDate: "2023-07-03",
    cycleNumber: 134,
    batteryLevel: 76,
    trajectory: [
      { lat: 38.5, lng: -68.9, date: "2024-01-12", temp: 16.8, depth: 2100 },
      { lat: 38.4, lng: -69.0, date: "2024-01-11", temp: 16.5, depth: 2080 },
      { lat: 38.3, lng: -69.1, date: "2024-01-10", temp: 16.2, depth: 2060 },
      { lat: 38.2, lng: -69.2, date: "2024-01-09", temp: 16.0, depth: 2040 },
    ]
  },
  { 
    id: "5906302", 
    lat: 36.9, 
    lng: -66.5, 
    temp: 17.9, 
    salinity: 35.1, 
    pressure: 177.6,
    depth: 1750,
    status: "active",
    lastProfile: "2024-01-11",
    bgcEnabled: false,
    qc: "GOOD",
    platform: "APEX",
    deploymentDate: "2023-09-15",
    cycleNumber: 67,
    batteryLevel: 94,
    trajectory: [
      { lat: 36.9, lng: -66.5, date: "2024-01-11", temp: 17.9, depth: 1750 },
      { lat: 36.8, lng: -66.6, date: "2024-01-10", temp: 17.7, depth: 1730 },
      { lat: 36.7, lng: -66.7, date: "2024-01-09", temp: 17.5, depth: 1710 },
    ]
  },
];

export function EnhancedMapView() {
  const { filters, updateFilters } = useFilters();
  const [selectedFloat, setSelectedFloat] = useState<string | null>(null);
  const [hoveredFloat, setHoveredFloat] = useState<string | null>(null);
  const [animationPlaying, setAnimationPlaying] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [showFullscreen, setShowFullscreen] = useState(false);

  // Filter floats based on current filter state
  const filteredFloats = useMemo(() => {
    return mockFloats.filter(float => {
      // Apply BGC filter
      if (filters.floatOptions.bgcOnly && !float.bgcEnabled) return false;
      
      // Apply QC filter
      if (filters.floatOptions.qcFilter && float.qc !== "GOOD") return false;
      
      // Apply geographic bounds
      if (float.lat < filters.latitude[0] || float.lat > filters.latitude[1]) return false;
      if (float.lng < filters.longitude[0] || float.lng > filters.longitude[1]) return false;
      
      // Apply depth range
      if (float.depth < filters.depthRange[0] || float.depth > filters.depthRange[1]) return false;
      
      return true;
    });
  }, [filters]);

  // Animation for trajectory playback
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (animationPlaying && selectedFloat) {
      interval = setInterval(() => {
        setAnimationProgress(prev => {
          const next = prev + 2;
          if (next >= 100) {
            setAnimationPlaying(false);
            return 0;
          }
          return next;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [animationPlaying, selectedFloat]);

  const toggleTrajectories = () => {
    updateFilters({
      floatOptions: {
        ...filters.floatOptions,
        trajectory: !filters.floatOptions.trajectory
      }
    });
  };

  const toggleBGCOnly = () => {
    updateFilters({
      floatOptions: {
        ...filters.floatOptions,
        bgcOnly: !filters.floatOptions.bgcOnly
      }
    });
  };

  const toggle3DMode = () => {
    updateFilters({
      mapMode: filters.mapMode === "2d" ? "3d" : "2d"
    });
  };

  const FloatDetailDialog = ({ float }: { float: any }) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Eye className="w-3 h-3 mr-1" />
          Details
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl bg-gradient-to-br from-blue-50 to-cyan-50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Navigation className="w-5 h-5 text-blue-600" />
            Float #{float.id} - Detailed Profile
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* Status Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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

          {/* Current Measurements */}
          <div className="bg-white/60 rounded-lg p-4">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-600" />
              Current Measurements
            </h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-red-500" />
                <span>Temperature: {float.temp}°C</span>
              </div>
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-blue-500" />
                <span>Salinity: {float.salinity} PSU</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span>Pressure: {float.pressure} dbar</span>
              </div>
            </div>
          </div>

          {/* Trajectory with Animation Controls */}
          <div className="bg-white/60 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium flex items-center gap-2">
                <Route className="w-4 h-4 text-blue-600" />
                Trajectory Analysis
              </h4>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAnimationPlaying(!animationPlaying)}
                >
                  {animationPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setAnimationProgress(0);
                    setAnimationPlaying(false);
                  }}
                >
                  <RotateCcw className="w-3 h-3" />
                </Button>
              </div>
            </div>
            
            <Progress value={animationProgress} className="mb-3" />
            
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {float.trajectory.map((point: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0.3 }}
                  animate={{ 
                    opacity: animationProgress > (index * 25) ? 1 : 0.3,
                    scale: animationProgress > (index * 25) ? 1 : 0.95
                  }}
                  className="flex justify-between items-center text-xs bg-white/50 rounded px-3 py-2"
                >
                  <span className="font-medium">{point.date}</span>
                  <span>{point.lat.toFixed(2)}°N, {Math.abs(point.lng).toFixed(2)}°W</span>
                  <span>{point.temp}°C</span>
                  <span>{point.depth}m</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Quality Control */}
          <div className="bg-white/60 rounded-lg p-4">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-blue-600" />
              Quality Control & Status
            </h4>
            <div className="flex flex-wrap gap-2">
              <Badge variant={float.status === "active" ? "outline" : "secondary"} className="text-xs">
                {float.status === "active" ? (
                  <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                ) : (
                  <AlertTriangle className="w-3 h-3 mr-1 text-yellow-500" />
                )}
                {float.status}
              </Badge>
              <Badge variant={float.qc === "GOOD" ? "outline" : "destructive"} className="text-xs">
                {float.qc}
              </Badge>
              {float.bgcEnabled && (
                <Badge variant="outline" className="text-xs bg-purple-100 text-purple-700">
                  BGC Enabled
                </Badge>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <TooltipProvider>
      <div className="h-full space-y-4">
        {/* Enhanced Map Controls */}
        <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                Interactive ARGO Explorer
                <Badge variant="outline" className="text-xs bg-gradient-to-r from-blue-100 to-cyan-100">
                  {filteredFloats.length} floats
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowFullscreen(!showFullscreen)}
                >
                  <Maximize2 className="w-3 h-3 mr-1" />
                  {showFullscreen ? "Exit" : "Fullscreen"}
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="trajectories"
                    checked={filters.floatOptions.trajectory}
                    onCheckedChange={toggleTrajectories}
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
                    onCheckedChange={toggleBGCOnly}
                  />
                  <Label htmlFor="bgc-only" className="text-sm">
                    BGC Only
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="3d-mode"
                    checked={filters.mapMode === "3d"}
                    onCheckedChange={toggle3DMode}
                  />
                  <Label htmlFor="3d-mode" className="text-sm">
                    <Box className="w-3 h-3 inline mr-1" />
                    3D Mode
                  </Label>
                </div>
              </div>
              <div className="text-xs text-slate-600">
                Live updates enabled
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Map Container */}
        <Card className={`shadow-lg border-0 bg-white/70 backdrop-blur-sm overflow-hidden transition-all duration-500 ${
          showFullscreen ? "fixed inset-4 z-50 h-auto" : "h-96"
        }`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                {selectedFloat ? `Float #${selectedFloat} Analysis` : 'ARGO Ocean Data Map'}
                {filters.mapMode === "3d" && (
                  <Badge variant="outline" className="text-xs bg-purple-100 text-purple-700">
                    3D Depth View
                  </Badge>
                )}
              </div>
              {showFullscreen && (
                <Button variant="ghost" size="sm" onClick={() => setShowFullscreen(false)}>
                  <EyeOff className="w-3 h-3" />
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 h-full">
            <div className="relative h-full bg-gradient-to-br from-blue-100 via-cyan-50 to-blue-200 overflow-hidden">
              {/* Enhanced Ocean Background */}
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1662757171170-30a462b7d4c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvY2VhbiUyMGRlcHRoJTIwZ3JhZGllbnQlMjBibHVlJTIwd2F0ZXJ8ZW58MXx8fHwxNzU4NTU3MDEzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Ocean depth gradient background"
                className="absolute inset-0 w-full h-full object-cover opacity-25"
              />
              
              {/* Animated Ocean Layers for 3D Effect */}
              {filters.mapMode === "3d" && (
                <div className="absolute inset-0">
                  <div className="absolute inset-0 bg-gradient-to-b from-blue-400/10 via-cyan-400/20 to-blue-800/30 animate-pulse"></div>
                  <div className="absolute inset-0 bg-gradient-radial from-transparent via-blue-500/5 to-blue-900/20"></div>
                </div>
              )}
              
              {/* Enhanced Grid with Depth Indicators */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent">
                <div className="grid grid-cols-8 grid-rows-6 h-full opacity-20">
                  {Array.from({ length: 48 }).map((_, i) => (
                    <motion.div 
                      key={i} 
                      className="border border-slate-300/30"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.2 }}
                      transition={{ delay: i * 0.01 }}
                    />
                  ))}
                </div>
              </div>
              
              {/* Enhanced Animated Trajectories */}
              <AnimatePresence>
                {filters.floatOptions.trajectory && filteredFloats.map((float, index) => (
                  <motion.svg
                    key={`trajectory-${float.id}`}
                    initial={{ opacity: 0, pathLength: 0 }}
                    animate={{ 
                      opacity: selectedFloat === float.id ? 1 : 0.6,
                      pathLength: 1
                    }}
                    exit={{ opacity: 0, pathLength: 0 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    style={{ zIndex: selectedFloat === float.id ? 5 : 1 }}
                  >
                    <motion.path
                      d={`M ${20 + (index * 15)}% ${30 + (index * 10)}% ${float.trajectory.map((_, i) => 
                        `L ${20 + (index * 15) - (i * 2)}% ${30 + (index * 10) + (i * 1.5)}%`
                      ).join(' ')}`}
                      stroke={float.status === "active" ? "#10b981" : "#f59e0b"}
                      strokeWidth={selectedFloat === float.id ? "3" : "2"}
                      strokeDasharray={selectedFloat === float.id ? "none" : "4 4"}
                      fill="none"
                      className={selectedFloat === float.id ? "" : "animate-pulse"}
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 2, ease: "easeInOut" }}
                    />
                    
                    {/* Trajectory Points */}
                    {float.trajectory.map((point, pointIndex) => (
                      <motion.circle
                        key={pointIndex}
                        cx={`${20 + (index * 15) - (pointIndex * 2)}%`}
                        cy={`${30 + (index * 10) + (pointIndex * 1.5)}%`}
                        r={selectedFloat === float.id ? "3" : "2"}
                        fill={float.status === "active" ? "#10b981" : "#f59e0b"}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: pointIndex * 0.2, duration: 0.3 }}
                        className="opacity-80"
                      />
                    ))}
                  </motion.svg>
                ))}
              </AnimatePresence>

              {/* Enhanced Float Markers */}
              {filteredFloats.map((float, index) => (
                <Tooltip key={float.id}>
                  <TooltipTrigger asChild>
                    <motion.div
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                      style={{
                        left: `${20 + (index * 15)}%`,
                        top: `${30 + (index * 10)}%`,
                        zIndex: selectedFloat === float.id ? 20 : hoveredFloat === float.id ? 15 : 10
                      }}
                      whileHover={{ scale: 1.4, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSelectedFloat(selectedFloat === float.id ? null : float.id)}
                      onMouseEnter={() => setHoveredFloat(float.id)}
                      onMouseLeave={() => setHoveredFloat(null)}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
                    >
                      <div className={`relative transition-all duration-300 ${
                        selectedFloat === float.id ? "ring-4 ring-white ring-offset-2 ring-offset-blue-100" : 
                        hoveredFloat === float.id ? "ring-2 ring-white ring-offset-1" : ""
                      }`}>
                        <div className={`w-5 h-5 rounded-full shadow-xl transition-all duration-200 ${
                          filters.mapMode === "3d" ? "shadow-2xl" : "shadow-lg"
                        } ${
                          float.status === "active" 
                            ? "bg-gradient-to-br from-green-400 via-emerald-500 to-green-600" 
                            : "bg-gradient-to-br from-red-400 via-pink-500 to-red-600"
                        } ${hoveredFloat === float.id || selectedFloat === float.id ? "animate-pulse" : ""}`}>
                          
                          {/* BGC Indicator */}
                          {float.bgcEnabled && (
                            <motion.div 
                              className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full border-2 border-white"
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            />
                          )}
                          
                          {/* Battery Level Indicator */}
                          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                            <div className={`w-3 h-1 rounded-full ${
                              float.batteryLevel > 50 ? "bg-green-400" : 
                              float.batteryLevel > 20 ? "bg-yellow-400" : "bg-red-400"
                            }`} style={{ width: `${Math.max(float.batteryLevel / 100 * 12, 2)}px` }} />
                          </div>
                          
                          {/* 3D Depth Indicator */}
                          {filters.mapMode === "3d" && (
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1">
                              <div 
                                className="w-0.5 bg-gradient-to-b from-blue-400 to-blue-800 rounded-full opacity-60"
                                style={{ height: `${Math.min(float.depth / 100, 20)}px` }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent className="bg-slate-900 text-white p-4 rounded-xl shadow-2xl border-none max-w-xs">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="font-semibold">Float #{float.id}</div>
                        <Badge variant={float.status === "active" ? "outline" : "secondary"} className="text-xs">
                          {float.status}
                        </Badge>
                      </div>
                      <Separator className="bg-slate-700" />
                      <div className="text-xs space-y-1.5">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3 h-3 text-blue-400" />
                          <span>{float.lat.toFixed(2)}°N, {Math.abs(float.lng).toFixed(2)}°W</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Thermometer className="w-3 h-3 text-red-400" />
                          <span>{float.temp}°C</span>
                          <Droplets className="w-3 h-3 text-blue-400 ml-2" />
                          <span>{float.salinity} PSU</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-3 h-3 text-green-400" />
                          <span>Max depth: {float.depth}m</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3 h-3 text-purple-400" />
                          <span>Last: {float.lastProfile}</span>
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
                        <Badge variant="outline" className="text-xs bg-slate-800 text-slate-300 border-slate-600">
                          {float.platform}
                        </Badge>
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              ))}
              
              {/* Enhanced Legend */}
              <motion.div 
                className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-2xl"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="space-y-3">
                  <div className="text-sm font-medium text-slate-800">Float Status</div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 shadow-sm"></div>
                      <span className="text-xs">Active ({filteredFloats.filter(f => f.status === 'active').length})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-gradient-to-br from-red-400 to-pink-500 shadow-sm"></div>
                      <span className="text-xs">Inactive ({filteredFloats.filter(f => f.status === 'inactive').length})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 shadow-sm"></div>
                      <span className="text-xs">BGC ({filteredFloats.filter(f => f.bgcEnabled).length})</span>
                    </div>
                  </div>
                  {filters.mapMode === "3d" && (
                    <>
                      <Separator />
                      <div className="text-xs text-slate-600">3D depth visualization active</div>
                    </>
                  )}
                </div>
              </motion.div>

              {/* Real-time Update Indicator */}
              <motion.div
                className="absolute top-4 right-4 flex items-center gap-2 bg-green-100/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-700 font-medium">Live</span>
              </motion.div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Selected Float Details */}
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
                <Card className="shadow-xl border-0 bg-gradient-to-br from-blue-50/90 via-cyan-50/90 to-purple-50/90 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Navigation className="w-4 h-4 text-blue-600" />
                        Float #{selectedFloat} - Enhanced Profile
                        <Badge variant="outline" className="text-xs bg-gradient-to-r from-blue-100 to-cyan-100">
                          {float.platform}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <FloatDetailDialog float={float} />
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setSelectedFloat(null)}
                        >
                          <EyeOff className="w-3 h-3" />
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Current Status */}
                      <div className="space-y-4">
                        <h4 className="font-medium text-sm flex items-center gap-2">
                          <Activity className="w-4 h-4 text-blue-600" />
                          Current Status
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-white/60 rounded-lg p-3 text-center">
                            <Thermometer className="w-4 h-4 text-red-500 mx-auto mb-1" />
                            <div className="text-lg font-semibold text-red-600">{float.temp}°C</div>
                            <div className="text-xs text-slate-600">Temperature</div>
                          </div>
                          <div className="bg-white/60 rounded-lg p-3 text-center">
                            <Droplets className="w-4 h-4 text-blue-500 mx-auto mb-1" />
                            <div className="text-lg font-semibold text-blue-600">{float.salinity}</div>
                            <div className="text-xs text-slate-600">Salinity (PSU)</div>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant={float.status === "active" ? "outline" : "secondary"} className="text-xs">
                            {float.status === "active" ? (
                              <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                            ) : (
                              <AlertTriangle className="w-3 h-3 mr-1 text-yellow-500" />
                            )}
                            {float.status}
                          </Badge>
                          <Badge variant={float.qc === "GOOD" ? "outline" : "destructive"} className="text-xs">
                            {float.qc}
                          </Badge>
                          {float.bgcEnabled && (
                            <Badge variant="outline" className="text-xs bg-purple-100 text-purple-700">
                              BGC Enabled
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      {/* Recent Trajectory */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm flex items-center gap-2">
                            <Route className="w-4 h-4 text-blue-600" />
                            Recent Trajectory
                          </h4>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setAnimationPlaying(!animationPlaying)}
                            >
                              {animationPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-1 max-h-32 overflow-y-auto">
                          {float.trajectory.slice(0, 4).map((point: any, i: number) => (
                            <motion.div 
                              key={i} 
                              className="flex justify-between text-xs bg-white/60 rounded-lg px-3 py-2 transition-all duration-200"
                              whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.8)" }}
                            >
                              <span className="font-medium">{point.date}</span>
                              <span>{point.lat.toFixed(2)}°N, {Math.abs(point.lng).toFixed(2)}°W</span>
                              <span className="text-red-600">{point.temp}°C</span>
                            </motion.div>
                          ))}
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
    </TooltipProvider>
  );
}