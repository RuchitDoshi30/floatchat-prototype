import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import { Switch } from "./ui/switch";
import { Badge } from "./ui/badge";
import { Calendar, Download, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const [dateRange, setDateRange] = useState({ start: "2023-01", end: "2024-12" });
  const [latitude, setLatitude] = useState([-90, 90]);
  const [longitude, setLongitude] = useState([-180, 180]);
  const [selectedParams, setSelectedParams] = useState(["TEMP", "PSAL"]);
  const [floatOptions, setFloatOptions] = useState({
    trajectory: true,
    adjusted: true,
    qcFilter: false
  });

  const parameters = ["TEMP", "PSAL", "PRES", "DOXY", "CHLA", "BBP", "CDOM"];

  const toggleParam = (param: string) => {
    setSelectedParams(prev => 
      prev.includes(param) 
        ? prev.filter(p => p !== param)
        : [...prev, param]
    );
  };

  if (isCollapsed) {
    return (
      <div className="w-16 bg-gradient-to-b from-slate-50 to-cyan-50 border-r border-slate-200 p-4 flex flex-col items-center space-y-4">
        <Button variant="ghost" size="icon" onClick={onToggle} className="hover:bg-white/60">
          <ChevronRight className="w-4 h-4" />
        </Button>
        <div className="w-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
        <Button variant="ghost" size="icon" className="hover:bg-white/60">
          <Calendar className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" className="hover:bg-white/60">
          <Download className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" className="hover:bg-white/60">
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="w-80 bg-gradient-to-b from-slate-50 to-cyan-50 border-r border-slate-200 p-4 space-y-4 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-slate-800">Filters</h2>
        <Button variant="ghost" size="icon" onClick={onToggle} className="hover:bg-white/60">
          <ChevronLeft className="w-4 h-4" />
        </Button>
      </div>

      {/* Date Range Card */}
      <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            Date Range
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs text-slate-600">Start</Label>
              <Input 
                type="month" 
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="h-8 text-sm bg-white/80"
              />
            </div>
            <div>
              <Label className="text-xs text-slate-600">End</Label>
              <Input 
                type="month" 
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="h-8 text-sm bg-white/80"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location Card */}
      <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Geographic Bounds</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-xs text-slate-600 mb-2 block">
              Latitude: {latitude[0]}° to {latitude[1]}°
            </Label>
            <Slider
              value={latitude}
              onValueChange={setLatitude}
              min={-90}
              max={90}
              step={1}
              className="w-full"
            />
          </div>
          <div>
            <Label className="text-xs text-slate-600 mb-2 block">
              Longitude: {longitude[0]}° to {longitude[1]}°
            </Label>
            <Slider
              value={longitude}
              onValueChange={setLongitude}
              min={-180}
              max={180}
              step={1}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* Parameters Card */}
      <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Parameters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {parameters.map((param) => (
              <Badge
                key={param}
                variant={selectedParams.includes(param) ? "default" : "outline"}
                className={`cursor-pointer transition-all duration-200 ${
                  selectedParams.includes(param) 
                    ? "bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600" 
                    : "hover:bg-slate-100"
                }`}
                onClick={() => toggleParam(param)}
              >
                {param}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Float Options Card */}
      <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Float Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm">Show Trajectories</Label>
            <Switch 
              checked={floatOptions.trajectory}
              onCheckedChange={(checked) => 
                setFloatOptions(prev => ({ ...prev, trajectory: checked }))
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-sm">Adjusted Data</Label>
            <Switch 
              checked={floatOptions.adjusted}
              onCheckedChange={(checked) => 
                setFloatOptions(prev => ({ ...prev, adjusted: checked }))
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-sm">QC Filter</Label>
            <Switch 
              checked={floatOptions.qcFilter}
              onCheckedChange={(checked) => 
                setFloatOptions(prev => ({ ...prev, qcFilter: checked }))
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-2">
        <Button className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
        <Button variant="outline" className="flex-1 hover:bg-slate-100">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>
    </div>
  );
}