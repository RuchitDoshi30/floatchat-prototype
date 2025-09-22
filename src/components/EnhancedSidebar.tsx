import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import { Switch } from "./ui/switch";
import { Badge } from "./ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { 
  Calendar, Download, RefreshCw, ChevronLeft, ChevronRight, 
  ChevronDown, ChevronUp, MapPin, Waves, Filter, Settings,
  Box, Activity, AlertCircle, CheckCircle, Thermometer,
  Droplets, Route
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useFilters } from "./FilterContext";

interface EnhancedSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function EnhancedSidebar({ isCollapsed, onToggle }: EnhancedSidebarProps) {
  const { filters, updateFilters } = useFilters();
  const [expandedSections, setExpandedSections] = useState({
    temporal: true,
    spatial: true,
    parameters: true,
    quality: true,
    display: true
  });

  const parameters = [
    { code: "TEMP", name: "Temperature", icon: Thermometer, color: "text-red-500" },
    { code: "PSAL", name: "Salinity", icon: Droplets, color: "text-blue-500" },
    { code: "PRES", name: "Pressure", icon: Activity, color: "text-green-500" },
    { code: "DOXY", name: "Dissolved O₂", icon: Waves, color: "text-cyan-500" },
    { code: "CHLA", name: "Chlorophyll-a", icon: Activity, color: "text-emerald-500" },
    { code: "BBP", name: "Backscatter", icon: Activity, color: "text-purple-500" },
    { code: "CDOM", name: "CDOM", icon: Activity, color: "text-yellow-500" }
  ];

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const toggleParam = (param: string) => {
    const newParams = filters.selectedParams.includes(param) 
      ? filters.selectedParams.filter(p => p !== param)
      : [...filters.selectedParams, param];
    
    updateFilters({ selectedParams: newParams });
  };

  const handleDateRangeChange = (field: 'start' | 'end', value: string) => {
    updateFilters({
      dateRange: {
        ...filters.dateRange,
        [field]: value
      }
    });
  };

  const handleRefreshData = () => {
    // Trigger data refresh animation
    const event = new CustomEvent('refreshData');
    window.dispatchEvent(event);
  };

  if (isCollapsed) {
    return (
      <motion.div 
        className="w-16 bg-gradient-to-b from-slate-50 to-cyan-50 border-r border-slate-200 p-4 flex flex-col items-center space-y-4"
        initial={{ width: 320 }}
        animate={{ width: 64 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <Button variant="ghost" size="icon" onClick={onToggle} className="hover:bg-white/60 relative">
          <ChevronRight className="w-4 h-4" />
          {/* Active filter indicator */}
          {(filters.selectedParams.length > 2 || filters.floatOptions.bgcOnly || filters.floatOptions.qcFilter) && (
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          )}
        </Button>
        
        <div className="w-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
        
        <Button variant="ghost" size="icon" className="hover:bg-white/60 relative">
          <Calendar className="w-4 h-4" />
        </Button>
        
        <Button variant="ghost" size="icon" className="hover:bg-white/60 relative">
          <Filter className="w-4 h-4" />
          <Badge className="absolute -top-2 -right-2 w-4 h-4 p-0 text-xs bg-blue-500">
            {filters.selectedParams.length}
          </Badge>
        </Button>
        
        <Button variant="ghost" size="icon" className="hover:bg-white/60" onClick={handleRefreshData}>
          <RefreshCw className="w-4 h-4" />
        </Button>
        
        <Button variant="ghost" size="icon" className="hover:bg-white/60">
          <Download className="w-4 h-4" />
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="w-80 bg-gradient-to-b from-slate-50 to-cyan-50 border-r border-slate-200 p-4 space-y-4 overflow-y-auto"
      initial={{ width: 64 }}
      animate={{ width: 320 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <Filter className="w-5 h-5 text-blue-600" />
          Advanced Filters
        </h2>
        <Button variant="ghost" size="icon" onClick={onToggle} className="hover:bg-white/60">
          <ChevronLeft className="w-4 h-4" />
        </Button>
      </div>

      {/* Temporal Filters */}
      <Collapsible open={expandedSections.temporal} onOpenChange={() => toggleSection('temporal')}>
        <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
          <CollapsibleTrigger asChild>
            <CardHeader className="pb-3 cursor-pointer hover:bg-white/20 transition-all duration-200">
              <CardTitle className="text-sm flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  Temporal Range
                </div>
                {expandedSections.temporal ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs text-slate-600">Start Date</Label>
                  <Input 
                    type="month" 
                    value={filters.dateRange.start}
                    onChange={(e) => handleDateRangeChange('start', e.target.value)}
                    className="h-8 text-sm bg-white/80 transition-all duration-200 focus:bg-white"
                  />
                </div>
                <div>
                  <Label className="text-xs text-slate-600">End Date</Label>
                  <Input 
                    type="month" 
                    value={filters.dateRange.end}
                    onChange={(e) => handleDateRangeChange('end', e.target.value)}
                    className="h-8 text-sm bg-white/80 transition-all duration-200 focus:bg-white"
                  />
                </div>
              </div>
              <div className="text-xs text-slate-600 bg-blue-50 p-2 rounded">
                📅 {filters.dateRange.start} to {filters.dateRange.end}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Spatial Filters */}
      <Collapsible open={expandedSections.spatial} onOpenChange={() => toggleSection('spatial')}>
        <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
          <CollapsibleTrigger asChild>
            <CardHeader className="pb-3 cursor-pointer hover:bg-white/20 transition-all duration-200">
              <CardTitle className="text-sm flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  Geographic Bounds
                </div>
                {expandedSections.spatial ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-xs text-slate-600 mb-2 block">
                  Latitude: {filters.latitude[0]}° to {filters.latitude[1]}°
                </Label>
                <Slider
                  value={filters.latitude}
                  onValueChange={(value) => updateFilters({ latitude: value as [number, number] })}
                  min={-90}
                  max={90}
                  step={1}
                  className="w-full"
                />
              </div>
              <div>
                <Label className="text-xs text-slate-600 mb-2 block">
                  Longitude: {filters.longitude[0]}° to {filters.longitude[1]}°
                </Label>
                <Slider
                  value={filters.longitude}
                  onValueChange={(value) => updateFilters({ longitude: value as [number, number] })}
                  min={-180}
                  max={180}
                  step={1}
                  className="w-full"
                />
              </div>
              <div>
                <Label className="text-xs text-slate-600 mb-2 block">
                  Depth Range: {filters.depthRange[0]}m to {filters.depthRange[1]}m
                </Label>
                <Slider
                  value={filters.depthRange}
                  onValueChange={(value) => updateFilters({ depthRange: value as [number, number] })}
                  min={0}
                  max={3000}
                  step={50}
                  className="w-full"
                />
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Parameter Selection */}
      <Collapsible open={expandedSections.parameters} onOpenChange={() => toggleSection('parameters')}>
        <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
          <CollapsibleTrigger asChild>
            <CardHeader className="pb-3 cursor-pointer hover:bg-white/20 transition-all duration-200">
              <CardTitle className="text-sm flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-600" />
                  Parameters
                  <Badge variant="outline" className="text-xs bg-blue-100">
                    {filters.selectedParams.length} selected
                  </Badge>
                </div>
                {expandedSections.parameters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              <div className="space-y-2">
                {parameters.map((param) => {
                  const IconComponent = param.icon;
                  const isSelected = filters.selectedParams.includes(param.code);
                  
                  return (
                    <motion.div
                      key={param.code}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Badge
                        variant={isSelected ? "default" : "outline"}
                        className={`cursor-pointer transition-all duration-200 w-full justify-start p-2 h-auto ${
                          isSelected 
                            ? "bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white" 
                            : "hover:bg-slate-100"
                        }`}
                        onClick={() => toggleParam(param.code)}
                      >
                        <IconComponent className={`w-3 h-3 mr-2 ${isSelected ? 'text-white' : param.color}`} />
                        <div className="flex flex-col items-start">
                          <span className="text-xs font-medium">{param.code}</span>
                          <span className="text-xs opacity-80">{param.name}</span>
                        </div>
                      </Badge>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Quality Control */}
      <Collapsible open={expandedSections.quality} onOpenChange={() => toggleSection('quality')}>
        <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
          <CollapsibleTrigger asChild>
            <CardHeader className="pb-3 cursor-pointer hover:bg-white/20 transition-all duration-200">
              <CardTitle className="text-sm flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  Quality & Type
                </div>
                {expandedSections.quality ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  Good QC Only
                </Label>
                <Switch 
                  checked={filters.floatOptions.qcFilter}
                  onCheckedChange={(checked) => 
                    updateFilters({
                      floatOptions: { ...filters.floatOptions, qcFilter: checked }
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm flex items-center gap-2">
                  <Activity className="w-3 h-3 text-purple-500" />
                  BGC Floats Only
                </Label>
                <Switch 
                  checked={filters.floatOptions.bgcOnly}
                  onCheckedChange={(checked) => 
                    updateFilters({
                      floatOptions: { ...filters.floatOptions, bgcOnly: checked }
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm flex items-center gap-2">
                  <Settings className="w-3 h-3 text-slate-500" />
                  Adjusted Data
                </Label>
                <Switch 
                  checked={filters.floatOptions.adjusted}
                  onCheckedChange={(checked) => 
                    updateFilters({
                      floatOptions: { ...filters.floatOptions, adjusted: checked }
                    })
                  }
                />
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Display Options */}
      <Collapsible open={expandedSections.display} onOpenChange={() => toggleSection('display')}>
        <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
          <CollapsibleTrigger asChild>
            <CardHeader className="pb-3 cursor-pointer hover:bg-white/20 transition-all duration-200">
              <CardTitle className="text-sm flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-blue-600" />
                  Display Options
                </div>
                {expandedSections.display ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm flex items-center gap-2">
                  <Route className="w-3 h-3 text-blue-500" />
                  Show Trajectories
                </Label>
                <Switch 
                  checked={filters.floatOptions.trajectory}
                  onCheckedChange={(checked) => 
                    updateFilters({
                      floatOptions: { ...filters.floatOptions, trajectory: checked }
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm flex items-center gap-2">
                  <Box className="w-3 h-3 text-purple-500" />
                  3D Depth View
                </Label>
                <Switch 
                  checked={filters.mapMode === "3d"}
                  onCheckedChange={(checked) => 
                    updateFilters({ mapMode: checked ? "3d" : "2d" })
                  }
                />
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-4">
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
          <Button 
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg"
            onClick={handleRefreshData}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Data
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
          <Button variant="outline" className="w-full hover:bg-slate-100">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </motion.div>
      </div>

      {/* Filter Summary */}
      <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-50 to-cyan-50 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs text-slate-600">Active Filters</CardTitle>
        </CardHeader>
        <CardContent className="text-xs space-y-1">
          <div>📊 {filters.selectedParams.length} parameters selected</div>
          <div>🌐 Lat: {filters.latitude[0]}° to {filters.latitude[1]}°</div>
          <div>🌊 Depth: {filters.depthRange[0]}m to {filters.depthRange[1]}m</div>
          {filters.floatOptions.bgcOnly && <div>🔬 BGC floats only</div>}
          {filters.floatOptions.qcFilter && <div>✅ Good QC only</div>}
          {filters.mapMode === "3d" && <div>📦 3D depth view</div>}
        </CardContent>
      </Card>
    </motion.div>
  );
}