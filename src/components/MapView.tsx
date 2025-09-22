import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { MapPin, Navigation, Waves, Route, Thermometer, Droplets, Calendar, Eye, EyeOff } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { motion, AnimatePresence } from "motion/react";

// Enhanced mock data for ARGO floats with trajectories and detailed info
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
    trajectory: [
      { lat: 35.2, lng: -65.8, date: "2024-01-15", temp: 18.5 },
      { lat: 35.1, lng: -65.9, date: "2024-01-14", temp: 18.2 },
      { lat: 35.0, lng: -66.0, date: "2024-01-13", temp: 18.0 },
      { lat: 34.9, lng: -66.1, date: "2024-01-12", temp: 17.8 },
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
    trajectory: [
      { lat: 40.1, lng: -70.2, date: "2024-01-14", temp: 15.2 },
      { lat: 40.0, lng: -70.3, date: "2024-01-13", temp: 15.0 },
      { lat: 39.9, lng: -70.4, date: "2024-01-12", temp: 14.8 },
      { lat: 39.8, lng: -70.5, date: "2024-01-11", temp: 14.5 },
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
    trajectory: [
      { lat: 32.8, lng: -64.1, date: "2024-01-10", temp: 20.1 },
      { lat: 32.7, lng: -64.2, date: "2024-01-09", temp: 20.0 },
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
    trajectory: [
      { lat: 38.5, lng: -68.9, date: "2024-01-12", temp: 16.8 },
      { lat: 38.4, lng: -69.0, date: "2024-01-11", temp: 16.5 },
      { lat: 38.3, lng: -69.1, date: "2024-01-10", temp: 16.2 },
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
    trajectory: [
      { lat: 36.9, lng: -66.5, date: "2024-01-11", temp: 17.9 },
      { lat: 36.8, lng: -66.6, date: "2024-01-10", temp: 17.7 },
      { lat: 36.7, lng: -66.7, date: "2024-01-09", temp: 17.5 },
    ]
  },
];

export function MapView() {
  const [selectedFloat, setSelectedFloat] = useState<string | null>(null);
  const [showTrajectories, setShowTrajectories] = useState(true);
  const [showBGCOnly, setShowBGCOnly] = useState(false);
  const [hoveredFloat, setHoveredFloat] = useState<string | null>(null);

  const filteredFloats = showBGCOnly ? mockFloats.filter(f => f.bgcEnabled) : mockFloats;

  return (
    <TooltipProvider>
      <div className="h-full space-y-4">
        {/* Map Controls */}
        <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                Interactive ARGO Map
              </div>
              <Badge variant="outline" className="text-xs">
                {filteredFloats.length} floats visible
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="trajectories"
                    checked={showTrajectories}
                    onCheckedChange={setShowTrajectories}
                  />
                  <Label htmlFor="trajectories" className="text-sm">
                    <Route className="w-3 h-3 inline mr-1" />
                    Trajectories
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="bgc-only"
                    checked={showBGCOnly}
                    onCheckedChange={setShowBGCOnly}
                  />
                  <Label htmlFor="bgc-only" className="text-sm">
                    BGC Only
                  </Label>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Eye className="w-3 h-3 mr-1" />
                Full Screen
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Map Container */}
        <Card className="h-96 shadow-lg border-0 bg-white/70 backdrop-blur-sm overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              {selectedFloat ? `Float #${selectedFloat} Details` : 'ARGO Float Locations'}
            </CardTitle>
          </CardHeader>
        <CardContent className="p-0 h-full">
          <div className="relative h-full bg-gradient-to-br from-blue-100 via-cyan-50 to-blue-200 overflow-hidden">
            {/* Ocean background */}
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1736725502817-05f92ceb5df0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvY2VhbiUyMHdhdmVzJTIwZ3JhZGllbnQlMjBibHVlfGVufDF8fHx8MTc1ODU1NTkzOXww&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Ocean background"
              className="absolute inset-0 w-full h-full object-cover opacity-30"
            />
            
            {/* Mock map grid */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent">
              <div className="grid grid-cols-8 grid-rows-6 h-full opacity-20">
                {Array.from({ length: 48 }).map((_, i) => (
                  <div key={i} className="border border-slate-300/30"></div>
                ))}
              </div>
            </div>
            
            {/* Trajectories */}
            <AnimatePresence>
              {showTrajectories && filteredFloats.map((float, index) => (
                <motion.svg
                  key={`trajectory-${float.id}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  style={{ zIndex: 1 }}
                >
                  <path
                    d={`M ${20 + (index * 15)}% ${30 + (index * 10)}% ${float.trajectory.map((_, i) => 
                      `L ${20 + (index * 15) - (i * 2)}% ${30 + (index * 10) + (i * 1.5)}%`
                    ).join(' ')}`}
                    stroke={float.status === "active" ? "#10b981" : "#f59e0b"}
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    fill="none"
                    className="animate-pulse"
                  />
                </motion.svg>
              ))}
            </AnimatePresence>

            {/* Float markers */}
            {filteredFloats.map((float, index) => (
              <Tooltip key={float.id}>
                <TooltipTrigger asChild>
                  <motion.div
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                    style={{
                      left: `${20 + (index * 15)}%`,
                      top: `${30 + (index * 10)}%`,
                      zIndex: selectedFloat === float.id ? 20 : 10
                    }}
                    whileHover={{ scale: 1.3 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedFloat(selectedFloat === float.id ? null : float.id)}
                    onMouseEnter={() => setHoveredFloat(float.id)}
                    onMouseLeave={() => setHoveredFloat(null)}
                  >
                    <div className={`relative w-4 h-4 rounded-full shadow-lg transition-all duration-200 ${
                      selectedFloat === float.id ? "ring-2 ring-white ring-offset-2" : ""
                    } ${
                      float.status === "active" 
                        ? "bg-gradient-to-r from-green-400 to-emerald-500" 
                        : "bg-gradient-to-r from-red-400 to-pink-500"
                    } ${hoveredFloat === float.id ? "animate-pulse" : ""}`}>
                      {float.bgcEnabled && (
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full border border-white"></div>
                      )}
                    </div>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent className="bg-slate-800 text-white p-3 rounded-lg shadow-xl border-none">
                  <div className="space-y-1">
                    <div className="font-medium">Float #{float.id}</div>
                    <div className="text-xs space-y-1">
                      <div>📍 {float.lat}°N, {Math.abs(float.lng)}°W</div>
                      <div>🌡️ {float.temp}°C | 🧂 {float.salinity} PSU</div>
                      <div>📊 Max depth: {float.depth}m</div>
                      <div>📅 Last: {float.lastProfile}</div>
                      <div className="flex items-center gap-1">
                        <Badge variant={float.qc === "GOOD" ? "outline" : "destructive"} className="text-xs">
                          {float.qc}
                        </Badge>
                        {float.bgcEnabled && (
                          <Badge variant="outline" className="text-xs bg-purple-100 text-purple-700">
                            BGC
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            ))}
            
            {/* Legend */}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-400 to-emerald-500"></div>
                  <span className="text-xs">Active Floats</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-red-400 to-pink-500"></div>
                  <span className="text-xs">Inactive Floats</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

        {/* Selected Float Details */}
        <AnimatePresence>
          {selectedFloat && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-50 to-cyan-50 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Navigation className="w-4 h-4 text-blue-600" />
                      Float #{selectedFloat} Profile
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setSelectedFloat(null)}
                    >
                      <EyeOff className="w-3 h-3" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const float = mockFloats.find(f => f.id === selectedFloat);
                    if (!float) return null;
                    
                    return (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-3">
                          <div className="text-xs space-y-2">
                            <div className="flex items-center gap-2">
                              <Thermometer className="w-3 h-3 text-red-500" />
                              <span>Temperature: {float.temp}°C</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Droplets className="w-3 h-3 text-blue-500" />
                              <span>Salinity: {float.salinity} PSU</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-3 h-3 text-slate-500" />
                              <span>Last Profile: {float.lastProfile}</span>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Badge variant={float.status === "active" ? "outline" : "secondary"} className="text-xs">
                              {float.status}
                            </Badge>
                            <Badge variant={float.qc === "GOOD" ? "outline" : "destructive"} className="text-xs">
                              {float.qc}
                            </Badge>
                            {float.bgcEnabled && (
                              <Badge variant="outline" className="text-xs bg-purple-100 text-purple-700">
                                BGC
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="col-span-2">
                          <div className="text-xs text-slate-600 mb-2">Recent Trajectory</div>
                          <div className="space-y-1">
                            {float.trajectory.slice(0, 3).map((point, i) => (
                              <div key={i} className="flex justify-between text-xs bg-white/50 rounded px-2 py-1">
                                <span>{point.date}</span>
                                <span>{point.lat}°N, {Math.abs(point.lng)}°W</span>
                                <span>{point.temp}°C</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Float List */}
        <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Navigation className="w-4 h-4 text-blue-600" />
              {showBGCOnly ? "BGC-Enabled Floats" : "Active Floats"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredFloats.filter(f => f.status === "active").map((float) => (
                <motion.div
                  key={float.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedFloat(float.id)}
                  className={`p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
                    selectedFloat === float.id 
                      ? "bg-gradient-to-r from-blue-100 to-cyan-100 border-blue-300 shadow-md" 
                      : "bg-gradient-to-r from-white/80 to-slate-50/80 border-slate-200/50 hover:shadow-md"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">#{float.id}</span>
                    <div className="flex gap-1">
                      <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                        <Waves className="w-3 h-3 mr-1" />
                        Active
                      </Badge>
                      {float.bgcEnabled && (
                        <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                          BGC
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-slate-600 space-y-1">
                    <div>📍 {float.lat}°N, {Math.abs(float.lng)}°W</div>
                    <div>🌡️ {float.temp}°C | 🧂 {float.salinity} PSU</div>
                    <div>📊 Max depth: {float.depth}m</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}