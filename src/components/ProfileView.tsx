import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { TrendingUp, Thermometer, Droplets, Gauge, BarChart3, GitCompare, Calendar, Plus } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Mock profile data
const temperatureData = [
  { depth: 0, temp: 24.5, salinity: 35.2 },
  { depth: 10, temp: 24.2, salinity: 35.3 },
  { depth: 20, temp: 23.8, salinity: 35.4 },
  { depth: 50, temp: 22.1, salinity: 35.6 },
  { depth: 100, temp: 18.5, salinity: 35.8 },
  { depth: 200, temp: 15.2, salinity: 36.0 },
  { depth: 500, temp: 8.9, salinity: 34.8 },
  { depth: 1000, temp: 4.2, salinity: 34.9 },
  { depth: 1500, temp: 2.8, salinity: 34.95 },
  { depth: 2000, temp: 2.1, salinity: 34.97 }
];

const pressureData = [
  { depth: 0, pressure: 0 },
  { depth: 10, pressure: 1.0 },
  { depth: 20, pressure: 2.0 },
  { depth: 50, pressure: 5.0 },
  { depth: 100, pressure: 10.1 },
  { depth: 200, pressure: 20.3 },
  { depth: 500, pressure: 50.8 },
  { depth: 1000, pressure: 101.5 },
  { depth: 1500, pressure: 152.3 },
  { depth: 2000, pressure: 203.1 }
];

// Enhanced mock profile data with multiple floats and time series
const multiFloatProfiles = {
  "5906298": {
    profiles: [
      { depth: 0, temp: 24.5, salinity: 35.2, date: "2024-01-15" },
      { depth: 10, temp: 24.2, salinity: 35.3, date: "2024-01-15" },
      { depth: 20, temp: 23.8, salinity: 35.4, date: "2024-01-15" },
      { depth: 50, temp: 22.1, salinity: 35.6, date: "2024-01-15" },
      { depth: 100, temp: 18.5, salinity: 35.8, date: "2024-01-15" },
      { depth: 200, temp: 15.2, salinity: 36.0, date: "2024-01-15" },
      { depth: 500, temp: 8.9, salinity: 34.8, date: "2024-01-15" },
      { depth: 1000, temp: 4.2, salinity: 34.9, date: "2024-01-15" },
      { depth: 1500, temp: 2.8, salinity: 34.95, date: "2024-01-15" },
      { depth: 2000, temp: 2.1, salinity: 34.97, date: "2024-01-15" }
    ],
    timeSeries: [
      { date: "2024-01-10", surfaceTemp: 23.8, surfaceSalinity: 35.1 },
      { date: "2024-01-11", surfaceTemp: 24.1, surfaceSalinity: 35.2 },
      { date: "2024-01-12", surfaceTemp: 24.3, surfaceSalinity: 35.2 },
      { date: "2024-01-13", surfaceTemp: 24.2, surfaceSalinity: 35.3 },
      { date: "2024-01-14", surfaceTemp: 24.4, surfaceSalinity: 35.2 },
      { date: "2024-01-15", surfaceTemp: 24.5, surfaceSalinity: 35.2 }
    ]
  },
  "5906299": {
    profiles: [
      { depth: 0, temp: 16.2, salinity: 35.9, date: "2024-01-14" },
      { depth: 10, temp: 16.0, salinity: 35.9, date: "2024-01-14" },
      { depth: 20, temp: 15.8, salinity: 36.0, date: "2024-01-14" },
      { depth: 50, temp: 15.1, salinity: 36.1, date: "2024-01-14" },
      { depth: 100, temp: 14.2, salinity: 36.0, date: "2024-01-14" },
      { depth: 200, temp: 12.8, salinity: 35.8, date: "2024-01-14" },
      { depth: 500, temp: 8.1, salinity: 35.2, date: "2024-01-14" },
      { depth: 1000, temp: 4.8, salinity: 34.9, date: "2024-01-14" },
      { depth: 1500, temp: 3.2, salinity: 34.95, date: "2024-01-14" },
      { depth: 1800, temp: 2.5, salinity: 34.97, date: "2024-01-14" }
    ],
    timeSeries: [
      { date: "2024-01-09", surfaceTemp: 15.8, surfaceSalinity: 35.8 },
      { date: "2024-01-10", surfaceTemp: 16.0, surfaceSalinity: 35.9 },
      { date: "2024-01-11", surfaceTemp: 16.1, surfaceSalinity: 35.9 },
      { date: "2024-01-12", surfaceTemp: 15.9, surfaceSalinity: 36.0 },
      { date: "2024-01-13", surfaceTemp: 16.0, surfaceSalinity: 35.9 },
      { date: "2024-01-14", surfaceTemp: 16.2, surfaceSalinity: 35.9 }
    ]
  }
};

export function ProfileView() {
  const [selectedFloats, setSelectedFloats] = useState<string[]>(["5906298"]);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [viewMode, setViewMode] = useState<"profiles" | "timeseries">("profiles");
  const [parameterView, setParameterView] = useState<"temperature" | "salinity" | "both">("both");

  const availableFloats = Object.keys(multiFloatProfiles);

  const toggleFloatSelection = (floatId: string) => {
    setSelectedFloats(prev => {
      if (prev.includes(floatId)) {
        return prev.filter(id => id !== floatId);
      } else {
        return comparisonMode ? [...prev, floatId] : [floatId];
      }
    });
  };

  const getFloatColor = (index: number) => {
    const colors = ["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"];
    return colors[index % colors.length];
  };

  return (
    <div className="h-full space-y-4">
      {/* Profile Controls */}
      <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              Profile Analysis
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant={comparisonMode ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setComparisonMode(!comparisonMode);
                  if (!comparisonMode && selectedFloats.length > 1) {
                    setSelectedFloats([selectedFloats[0]]);
                  }
                }}
                className={comparisonMode ? "bg-gradient-to-r from-blue-500 to-cyan-500" : ""}
              >
                <GitCompare className="w-3 h-3 mr-1" />
                {comparisonMode ? "Exit Compare" : "Compare Mode"}
              </Button>
              <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)}>
                <TabsList className="grid w-full grid-cols-2 h-8">
                  <TabsTrigger value="profiles" className="text-xs">Profiles</TabsTrigger>
                  <TabsTrigger value="timeseries" className="text-xs">Time Series</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-sm text-slate-600">Select Floats:</div>
              <div className="flex gap-2">
                {availableFloats.map((floatId, index) => (
                  <motion.div
                    key={floatId}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div
                      className={`flex items-center space-x-2 cursor-pointer px-3 py-1 rounded-full text-xs border transition-all ${
                        selectedFloats.includes(floatId)
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-slate-300 bg-white hover:bg-slate-50"
                      }`}
                      onClick={() => toggleFloatSelection(floatId)}
                    >
                      <div 
                        className="w-2 h-2 rounded-full" 
                        style={{ backgroundColor: getFloatColor(index) }}
                      ></div>
                      <span>#{floatId}</span>
                      {selectedFloats.includes(floatId) && comparisonMode && (
                        <Plus className="w-3 h-3 rotate-45" />
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <Select value={parameterView} onValueChange={(v) => setParameterView(v as any)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="both">Both</SelectItem>
                <SelectItem value="temperature">Temperature</SelectItem>
                <SelectItem value="salinity">Salinity</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Profile Stats Header */}
      <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              {selectedFloats.length === 1 ? `Float #${selectedFloats[0]} Data` : `Comparing ${selectedFloats.length} Floats`}
            </CardTitle>
            <div className="flex gap-2">
              {selectedFloats.map((floatId, index) => (
                <Badge key={floatId} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  <div 
                    className="w-2 h-2 rounded-full mr-1" 
                    style={{ backgroundColor: getFloatColor(index) }}
                  ></div>
                  #{floatId}
                </Badge>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            {selectedFloats.length === 1 ? (
              <>
                <div className="p-3 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg">
                  <Thermometer className="w-5 h-5 text-red-500 mx-auto mb-1" />
                  <div className="text-lg font-semibold text-red-700">
                    {multiFloatProfiles[selectedFloats[0] as keyof typeof multiFloatProfiles]?.profiles[0]?.temp}°C
                  </div>
                  <div className="text-xs text-slate-600">Surface Temp</div>
                </div>
                <div className="p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
                  <Droplets className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                  <div className="text-lg font-semibold text-blue-700">
                    {multiFloatProfiles[selectedFloats[0] as keyof typeof multiFloatProfiles]?.profiles[0]?.salinity}
                  </div>
                  <div className="text-xs text-slate-600">Surface Salinity</div>
                </div>
                <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                  <Gauge className="w-5 h-5 text-purple-500 mx-auto mb-1" />
                  <div className="text-lg font-semibold text-purple-700">
                    {multiFloatProfiles[selectedFloats[0] as keyof typeof multiFloatProfiles]?.profiles.slice(-1)[0]?.depth}m
                  </div>
                  <div className="text-xs text-slate-600">Max Depth</div>
                </div>
              </>
            ) : (
              <>
                <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                  <GitCompare className="w-5 h-5 text-green-500 mx-auto mb-1" />
                  <div className="text-lg font-semibold text-green-700">{selectedFloats.length}</div>
                  <div className="text-xs text-slate-600">Floats Compared</div>
                </div>
                <div className="p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                  <div className="text-lg font-semibold text-blue-700">
                    {Math.round(selectedFloats.reduce((sum, floatId) => {
                      const profiles = multiFloatProfiles[floatId as keyof typeof multiFloatProfiles]?.profiles;
                      return sum + (profiles?.[0]?.temp || 0);
                    }, 0) / selectedFloats.length * 10) / 10}°C
                  </div>
                  <div className="text-xs text-slate-600">Avg Surface Temp</div>
                </div>
                <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-purple-500 mx-auto mb-1" />
                  <div className="text-lg font-semibold text-purple-700">6</div>
                  <div className="text-xs text-slate-600">Days Range</div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Main Chart Area */}
      <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)} className="space-y-4">
        <TabsContent value="profiles" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {(parameterView === "temperature" || parameterView === "both") && (
              <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Thermometer className="w-4 h-4 text-red-500" />
                    Temperature Profile{selectedFloats.length > 1 ? "s" : ""}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart margin={{ top: 5, right: 5, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis 
                          type="number"
                          dataKey="temp"
                          domain={['dataMin - 1', 'dataMax + 1']}
                          tick={{ fontSize: 10 }}
                          stroke="#64748b"
                          label={{ value: 'Temperature (°C)', position: 'insideBottom', offset: -5 }}
                        />
                        <YAxis 
                          type="number"
                          dataKey="depth"
                          reversed 
                          tick={{ fontSize: 10 }}
                          stroke="#64748b"
                          label={{ value: 'Depth (m)', angle: -90, position: 'insideLeft' }}
                        />
                        <Tooltip 
                          labelFormatter={(value) => `Temperature: ${value}°C`}
                          formatter={(value: any, name: string) => [
                            `${value}m`, 
                            `Float #${name}`
                          ]}
                          contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            border: 'none',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                        {selectedFloats.map((floatId, index) => {
                          const data = multiFloatProfiles[floatId as keyof typeof multiFloatProfiles]?.profiles;
                          const color = getFloatColor(index);
                          return (
                            <Line
                              key={floatId}
                              data={data}
                              type="monotone"
                              dataKey="depth"
                              stroke={color}
                              strokeWidth={2}
                              dot={{ fill: color, strokeWidth: 2, r: 3 }}
                              name={floatId}
                              connectNulls={false}
                            />
                          );
                        })}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}

            {(parameterView === "salinity" || parameterView === "both") && (
              <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-blue-500" />
                    Salinity Profile{selectedFloats.length > 1 ? "s" : ""}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart margin={{ top: 5, right: 5, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis 
                          type="number"
                          dataKey="salinity"
                          domain={['dataMin - 0.2', 'dataMax + 0.2']}
                          tick={{ fontSize: 10 }}
                          stroke="#64748b"
                          label={{ value: 'Salinity (PSU)', position: 'insideBottom', offset: -5 }}
                        />
                        <YAxis 
                          type="number"
                          dataKey="depth"
                          reversed 
                          tick={{ fontSize: 10 }}
                          stroke="#64748b"
                          label={{ value: 'Depth (m)', angle: -90, position: 'insideLeft' }}
                        />
                        <Tooltip 
                          labelFormatter={(value) => `Salinity: ${value} PSU`}
                          formatter={(value: any, name: string) => [
                            `${value}m`, 
                            `Float #${name}`
                          ]}
                          contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            border: 'none',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                        {selectedFloats.map((floatId, index) => {
                          const data = multiFloatProfiles[floatId as keyof typeof multiFloatProfiles]?.profiles;
                          const color = getFloatColor(index);
                          return (
                            <Line
                              key={floatId}
                              data={data}
                              type="monotone"
                              dataKey="depth"
                              stroke={color}
                              strokeWidth={2}
                              dot={{ fill: color, strokeWidth: 2, r: 3 }}
                              name={floatId}
                              connectNulls={false}
                            />
                          );
                        })}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}

          </div>

          {/* Combined T-S Diagram */}
          {parameterView === "both" && (
            <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-purple-500" />
                  Temperature-Salinity Diagram
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart margin={{ top: 5, right: 30, left: 20, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis 
                        type="number"
                        dataKey="salinity"
                        domain={['dataMin - 0.2', 'dataMax + 0.2']}
                        tick={{ fontSize: 10 }}
                        stroke="#64748b"
                        label={{ value: 'Salinity (PSU)', position: 'insideBottom', offset: -5 }}
                      />
                      <YAxis 
                        type="number"
                        dataKey="temp"
                        tick={{ fontSize: 10 }}
                        stroke="#64748b"
                        label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }}
                      />
                      <Tooltip 
                        labelFormatter={(value) => `Salinity: ${value} PSU`}
                        formatter={(value: any, name: string) => [
                          `${value}°C`, 
                          `Float #${name}`
                        ]}
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: 'none',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      {selectedFloats.map((floatId, index) => {
                        const data = multiFloatProfiles[floatId as keyof typeof multiFloatProfiles]?.profiles;
                        const color = getFloatColor(index);
                        return (
                          <Line
                            key={floatId}
                            data={data}
                            type="monotone"
                            dataKey="temp"
                            stroke={color}
                            strokeWidth={2}
                            dot={{ fill: color, strokeWidth: 2, r: 3 }}
                            name={floatId}
                            connectNulls={false}
                          />
                        );
                      })}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="timeseries" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Surface Temperature Time Series */}
            <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Thermometer className="w-4 h-4 text-red-500" />
                  Surface Temperature Time Series
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis 
                        dataKey="date"
                        tick={{ fontSize: 10 }}
                        stroke="#64748b"
                      />
                      <YAxis 
                        tick={{ fontSize: 10 }}
                        stroke="#64748b"
                        label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }}
                      />
                      <Tooltip 
                        labelFormatter={(value) => `Date: ${value}`}
                        formatter={(value: any, name: string) => [
                          `${value}°C`, 
                          `Float #${name}`
                        ]}
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: 'none',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      {selectedFloats.map((floatId, index) => {
                        const data = multiFloatProfiles[floatId as keyof typeof multiFloatProfiles]?.timeSeries;
                        const color = getFloatColor(index);
                        return (
                          <Line
                            key={floatId}
                            data={data}
                            type="monotone"
                            dataKey="surfaceTemp"
                            stroke={color}
                            strokeWidth={2}
                            dot={{ fill: color, strokeWidth: 2, r: 3 }}
                            name={floatId}
                            connectNulls={false}
                          />
                        );
                      })}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Surface Salinity Time Series */}
            <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-blue-500" />
                  Surface Salinity Time Series
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis 
                        dataKey="date"
                        tick={{ fontSize: 10 }}
                        stroke="#64748b"
                      />
                      <YAxis 
                        tick={{ fontSize: 10 }}
                        stroke="#64748b"
                        label={{ value: 'Salinity (PSU)', angle: -90, position: 'insideLeft' }}
                      />
                      <Tooltip 
                        labelFormatter={(value) => `Date: ${value}`}
                        formatter={(value: any, name: string) => [
                          `${value} PSU`, 
                          `Float #${name}`
                        ]}
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: 'none',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      {selectedFloats.map((floatId, index) => {
                        const data = multiFloatProfiles[floatId as keyof typeof multiFloatProfiles]?.timeSeries;
                        const color = getFloatColor(index);
                        return (
                          <Line
                            key={floatId}
                            data={data}
                            type="monotone"
                            dataKey="surfaceSalinity"
                            stroke={color}
                            strokeWidth={2}
                            dot={{ fill: color, strokeWidth: 2, r: 3 }}
                            name={floatId}
                            connectNulls={false}
                          />
                        );
                      })}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}