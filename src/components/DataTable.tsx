import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Progress } from "./ui/progress";
import { Search, Download, Filter, ArrowUpDown, Database, FileText, Table2, Brain, TrendingUp, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Mock data for the table
const mockData = [
  {
    id: "5906298",
    date: "2024-01-15",
    lat: 35.234,
    lng: -65.812,
    depth: 2000,
    temp: 18.5,
    salinity: 35.2,
    pressure: 203.1,
    qc: "GOOD",
    status: "Active"
  },
  {
    id: "5906299",
    date: "2024-01-14",
    lat: 40.156,
    lng: -70.234,
    depth: 1800,
    temp: 15.2,
    salinity: 35.8,
    pressure: 182.4,
    qc: "GOOD",
    status: "Active"
  },
  {
    id: "5906300",
    date: "2024-01-13",
    lat: 32.789,
    lng: -64.123,
    depth: 1950,
    temp: 20.1,
    salinity: 34.9,
    pressure: 197.8,
    qc: "QUESTIONABLE",
    status: "Inactive"
  },
  {
    id: "5906301",
    date: "2024-01-12",
    lat: 38.567,
    lng: -68.945,
    depth: 2100,
    temp: 16.8,
    salinity: 35.4,
    pressure: 212.9,
    qc: "GOOD",
    status: "Active"
  },
  {
    id: "5906302",
    date: "2024-01-11",
    lat: 36.901,
    lng: -66.567,
    depth: 1750,
    temp: 17.9,
    salinity: 35.1,
    pressure: 177.6,
    qc: "GOOD",
    status: "Active"
  }
];

export function DataTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterQC, setFilterQC] = useState<string>("all");
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [showInsights, setShowInsights] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const filteredData = mockData.filter(row => {
    const matchesSearch = row.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         row.date.includes(searchTerm);
    const matchesStatus = filterStatus === "all" || row.status.toLowerCase() === filterStatus.toLowerCase();
    const matchesQC = filterQC === "all" || row.qc.toLowerCase() === filterQC.toLowerCase();
    
    return matchesSearch && matchesStatus && matchesQC;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField) return 0;
    
    const aValue = a[sortField as keyof typeof a];
    const bValue = b[sortField as keyof typeof b];
    
    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    }
    
    const comparison = String(aValue).localeCompare(String(bValue));
    return sortDirection === "asc" ? comparison : -comparison;
  });

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getQCBadge = (qc: string) => {
    switch (qc) {
      case "GOOD":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Good</Badge>;
      case "QUESTIONABLE":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Questionable</Badge>;
      case "BAD":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Bad</Badge>;
      default:
        return <Badge variant="outline">{qc}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    return status === "Active" 
      ? <Badge className="bg-blue-100 text-blue-800 border-blue-200">Active</Badge>
      : <Badge variant="outline">Inactive</Badge>;
  };

  const handleExport = async (format: string) => {
    setExportProgress(0);
    // Simulate export process
    for (let i = 0; i <= 100; i += 10) {
      setExportProgress(i);
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Create mock download
    const data = selectedRows.length > 0 
      ? sortedData.filter(row => selectedRows.includes(row.id))
      : sortedData;
    
    const headers = ["Float ID", "Date", "Latitude", "Longitude", "Temperature", "Salinity", "Depth", "QC", "Status"];
    const csvContent = [
      headers.join(","),
      ...data.map(row => [
        row.id, row.date, row.lat, row.lng, row.temp, row.salinity, row.depth, row.qc, row.status
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `argo_data_${new Date().toISOString().split('T')[0]}.${format}`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    setTimeout(() => {
      setShowExportDialog(false);
      setExportProgress(0);
    }, 500);
  };

  const toggleRowSelection = (rowId: string) => {
    setSelectedRows(prev => 
      prev.includes(rowId) 
        ? prev.filter(id => id !== rowId)
        : [...prev, rowId]
    );
  };

  const selectAllRows = () => {
    setSelectedRows(selectedRows.length === sortedData.length ? [] : sortedData.map(r => r.id));
  };

  const generateInsights = () => {
    const activeFloats = sortedData.filter(r => r.status === "Active").length;
    const avgTemp = Math.round(sortedData.reduce((sum, r) => sum + r.temp, 0) / sortedData.length * 10) / 10;
    const avgSalinity = Math.round(sortedData.reduce((sum, r) => sum + r.salinity, 0) / sortedData.length * 10) / 10;
    const goodQC = sortedData.filter(r => r.qc === "GOOD").length;
    const maxDepth = Math.max(...sortedData.map(r => r.depth));
    
    return {
      summary: `Dataset contains ${sortedData.length} measurements from ${activeFloats} active floats. Quality control shows ${goodQC} measurements passed with GOOD status (${Math.round(goodQC/sortedData.length*100)}%).`,
      temperature: `Average temperature: ${avgTemp}°C. Range: ${Math.min(...sortedData.map(r => r.temp))}°C to ${Math.max(...sortedData.map(r => r.temp))}°C. Temperature shows typical oceanographic stratification patterns.`,
      salinity: `Average salinity: ${avgSalinity} PSU. Salinity values indicate open ocean conditions with minimal freshwater influence.`,
      depth: `Maximum profiling depth: ${maxDepth}m. Deep profiles enable full water column analysis including abyssal layer characteristics.`,
      recommendations: [
        "Consider temporal analysis to identify seasonal patterns",
        "Cross-reference with BGC parameters for biogeochemical insights", 
        "Apply quality control filters for high-precision analysis",
        "Examine spatial clustering for regional oceanographic features"
      ]
    };
  };

  return (
    <div className="h-full space-y-4">
      {/* Search and Filter Controls */}
      <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Database className="w-4 h-4 text-blue-600" />
            ARGO Float Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search by Float ID or Date..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white"
                />
              </div>
            </div>
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-32 bg-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterQC} onValueChange={setFilterQC}>
              <SelectTrigger className="w-32 bg-white">
                <SelectValue placeholder="QC" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All QC</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="questionable">Questionable</SelectItem>
                <SelectItem value="bad">Bad</SelectItem>
              </SelectContent>
            </Select>
            
            <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" className="hover:bg-slate-100">
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Export ARGO Data
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="text-sm text-slate-600">
                    {selectedRows.length > 0 
                      ? `Exporting ${selectedRows.length} selected records`
                      : `Exporting all ${sortedData.length} filtered records`
                    }
                  </div>
                  
                  {exportProgress > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{exportProgress}%</span>
                      </div>
                      <Progress value={exportProgress} className="w-full" />
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      onClick={() => handleExport('csv')}
                      disabled={exportProgress > 0 && exportProgress < 100}
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      CSV Format
                    </Button>
                    <Button 
                      onClick={() => handleExport('netcdf')}
                      disabled={exportProgress > 0 && exportProgress < 100}
                      variant="outline"
                    >
                      <Database className="w-4 h-4 mr-2" />
                      NetCDF
                    </Button>
                  </div>
                  
                  <div className="text-xs text-slate-500 space-y-1">
                    <div>• CSV: Standard comma-separated format</div>
                    <div>• NetCDF: Scientific data format with metadata</div>
                    <div>• ASCII: Plain text tabular format</div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            <Button 
              variant="outline" 
              onClick={() => setShowInsights(true)}
              className="hover:bg-purple-50 border-purple-200 text-purple-700"
            >
              <Brain className="w-4 h-4 mr-2" />
              AI Insights
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-slate-50 to-blue-50">
                  <TableHead className="w-12">
                    <input
                      type="checkbox"
                      checked={selectedRows.length === sortedData.length && sortedData.length > 0}
                      onChange={selectAllRows}
                      className="rounded border-slate-300"
                    />
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-slate-100 transition-colors"
                    onClick={() => handleSort("id")}
                  >
                    <div className="flex items-center gap-1">
                      Float ID
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-slate-100 transition-colors"
                    onClick={() => handleSort("date")}
                  >
                    <div className="flex items-center gap-1">
                      Date
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-slate-100 transition-colors"
                    onClick={() => handleSort("lat")}
                  >
                    <div className="flex items-center gap-1">
                      Latitude
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-slate-100 transition-colors"
                    onClick={() => handleSort("lng")}
                  >
                    <div className="flex items-center gap-1">
                      Longitude
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-slate-100 transition-colors"
                    onClick={() => handleSort("temp")}
                  >
                    <div className="flex items-center gap-1">
                      Temp (°C)
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-slate-100 transition-colors"
                    onClick={() => handleSort("salinity")}
                  >
                    <div className="flex items-center gap-1">
                      Salinity
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-slate-100 transition-colors"
                    onClick={() => handleSort("depth")}
                  >
                    <div className="flex items-center gap-1">
                      Depth (m)
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </TableHead>
                  <TableHead>QC</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedData.map((row, index) => (
                  <TableRow 
                    key={row.id} 
                    className={`hover:bg-blue-50/50 transition-colors ${
                      index % 2 === 0 ? "bg-white/50" : "bg-slate-50/30"
                    } ${selectedRows.includes(row.id) ? "bg-blue-100/50" : ""}`}
                  >
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(row.id)}
                        onChange={() => toggleRowSelection(row.id)}
                        className="rounded border-slate-300"
                      />
                    </TableCell>
                    <TableCell className="font-medium text-blue-600">#{row.id}</TableCell>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{row.lat.toFixed(3)}°N</TableCell>
                    <TableCell>{row.lng.toFixed(3)}°W</TableCell>
                    <TableCell>{row.temp.toFixed(1)}</TableCell>
                    <TableCell>{row.salinity.toFixed(1)}</TableCell>
                    <TableCell>{row.depth.toLocaleString()}</TableCell>
                    <TableCell>{getQCBadge(row.qc)}</TableCell>
                    <TableCell>{getStatusBadge(row.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {sortedData.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              <Database className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No data found matching your criteria</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            <div>
              <div className="text-xl font-semibold text-blue-600">{sortedData.length}</div>
              <div className="text-sm text-slate-600">Total Records</div>
            </div>
            <div>
              <div className="text-xl font-semibold text-green-600">
                {sortedData.filter(r => r.status === "Active").length}
              </div>
              <div className="text-sm text-slate-600">Active Floats</div>
            </div>
            <div>
              <div className="text-xl font-semibold text-emerald-600">
                {sortedData.filter(r => r.qc === "GOOD").length}
              </div>
              <div className="text-sm text-slate-600">Good QC</div>
            </div>
            <div>
              <div className="text-xl font-semibold text-orange-600">
                {Math.round(sortedData.reduce((sum, r) => sum + r.temp, 0) / sortedData.length * 10) / 10}°C
              </div>
              <div className="text-sm text-slate-600">Avg Temperature</div>
            </div>
            <div>
              <div className="text-xl font-semibold text-purple-600">{selectedRows.length}</div>
              <div className="text-sm text-slate-600">Selected</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Insights Dialog */}
      <Dialog open={showInsights} onOpenChange={setShowInsights}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-600" />
              AI-Powered Data Insights
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Tabs defaultValue="summary" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="analysis">Analysis</TabsTrigger>
                <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              </TabsList>
              
              <TabsContent value="summary" className="space-y-3">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    <h4 className="font-medium">Dataset Overview</h4>
                  </div>
                  <p className="text-sm text-slate-700">{generateInsights().summary}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 bg-red-50 rounded-lg">
                    <h5 className="font-medium text-red-800 mb-1">Temperature Analysis</h5>
                    <p className="text-xs text-red-700">{generateInsights().temperature}</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <h5 className="font-medium text-blue-800 mb-1">Salinity Analysis</h5>
                    <p className="text-xs text-blue-700">{generateInsights().salinity}</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="analysis" className="space-y-3">
                <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Database className="w-4 h-4 text-purple-600" />
                    <h4 className="font-medium">Depth Profile Analysis</h4>
                  </div>
                  <p className="text-sm text-slate-700">{generateInsights().depth}</p>
                </div>
                
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 bg-white rounded-lg border">
                    <div className="text-lg font-semibold text-slate-800">
                      {Math.round((sortedData.filter(r => r.qc === "GOOD").length / sortedData.length) * 100)}%
                    </div>
                    <div className="text-xs text-slate-600">Data Quality</div>
                  </div>
                  <div className="p-3 bg-white rounded-lg border">
                    <div className="text-lg font-semibold text-slate-800">
                      {Math.round(sortedData.reduce((sum, r) => sum + r.depth, 0) / sortedData.length)}m
                    </div>
                    <div className="text-xs text-slate-600">Avg Depth</div>
                  </div>
                  <div className="p-3 bg-white rounded-lg border">
                    <div className="text-lg font-semibold text-slate-800">
                      {new Set(sortedData.map(r => r.date.slice(0, 7))).size}
                    </div>
                    <div className="text-xs text-slate-600">Unique Months</div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="recommendations" className="space-y-3">
                <div className="space-y-2">
                  {generateInsights().recommendations.map((rec, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg"
                    >
                      <AlertCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-green-800">{rec}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border-l-4 border-yellow-400">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertCircle className="w-4 h-4 text-yellow-600" />
                    <h5 className="font-medium text-yellow-800">Next Steps</h5>
                  </div>
                  <p className="text-sm text-yellow-700">
                    Use the chat interface to explore specific patterns or ask questions like 
                    "Show temperature trends over time" or "Compare profiles from different regions".
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}