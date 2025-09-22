import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Checkbox } from "./ui/checkbox";
import { ScrollArea } from "./ui/scroll-area";
import { 
  Database, Search, Filter, Download, RefreshCw, ChevronDown, 
  ChevronUp, SortAsc, SortDesc, Eye, MapPin, Calendar,
  Thermometer, Droplets, Activity, CheckCircle, AlertTriangle,
  BarChart3, FileText, Brain, Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useFilters } from "./FilterContext";

// Enhanced mock data for the data table
const mockTableData = [
  {
    id: "5906298",
    date: "2024-01-15",
    lat: 35.2,
    lng: -65.8,
    depth: 2000,
    temperature: 18.5,
    salinity: 35.2,
    pressure: 203.1,
    oxygen: 256.8,
    chlorophyll: 0.18,
    status: "active",
    qc: "GOOD",
    platform: "APEX",
    region: "North Atlantic",
    cycle: 127,
    battery: 85
  },
  {
    id: "5906299",
    date: "2024-01-14",
    lat: 40.1,
    lng: -70.2,
    depth: 1800,
    temperature: 15.2,
    salinity: 35.8,
    pressure: 182.4,
    oxygen: 289.1,
    chlorophyll: 0.24,
    status: "active",
    qc: "GOOD",
    platform: "NOVA",
    region: "North Atlantic",
    cycle: 89,
    battery: 92
  },
  {
    id: "5906300",
    date: "2024-01-13",
    lat: -20.5,
    lng: 115.3,
    depth: 1850,
    temperature: 22.8,
    salinity: 34.6,
    pressure: 187.2,
    oxygen: 198.5,
    chlorophyll: 0.31,
    status: "active",
    qc: "GOOD",
    platform: "APEX",
    region: "Indian Ocean",
    cycle: 156,
    battery: 78
  },
  {
    id: "5906301",
    date: "2024-01-12",
    lat: 35.7,
    lng: 139.7,
    depth: 1950,
    temperature: 16.4,
    salinity: 34.1,
    pressure: 198.7,
    oxygen: 267.3,
    chlorophyll: 0.15,
    status: "active",
    qc: "GOOD",
    platform: "NAVIS",
    region: "North Pacific",
    cycle: 134,
    battery: 89
  },
  {
    id: "5906302",
    date: "2024-01-11",
    lat: -45.2,
    lng: -60.1,
    depth: 2050,
    temperature: 8.9,
    salinity: 34.2,
    pressure: 205.4,
    oxygen: 312.7,
    chlorophyll: 0.08,
    status: "active",
    qc: "GOOD",
    platform: "APEX",
    region: "South Atlantic",
    cycle: 178,
    battery: 67
  },
  {
    id: "5906303",
    date: "2024-01-10",
    lat: 65.2,
    lng: -18.5,
    depth: 1750,
    temperature: 4.2,
    salinity: 35.1,
    pressure: 176.8,
    oxygen: 398.2,
    chlorophyll: 0.42,
    status: "active",
    qc: "GOOD",
    platform: "NOVA",
    region: "North Atlantic",
    cycle: 203,
    battery: 94
  },
  {
    id: "5906304",
    date: "2024-01-05",
    lat: -35.8,
    lng: 175.2,
    depth: 1900,
    temperature: 14.7,
    salinity: 34.8,
    pressure: 192.3,
    oxygen: 245.1,
    chlorophyll: 0.19,
    status: "inactive",
    qc: "QUESTIONABLE",
    platform: "APEX",
    region: "South Pacific",
    cycle: 245,
    battery: 23
  },
];

type SortField = keyof typeof mockTableData[0];
type SortDirection = "asc" | "desc";

export function DashboardDataTable() {
  const { filters } = useFilters();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [showFilters, setShowFilters] = useState(true);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showAIInsights, setShowAIInsights] = useState(false);

  // Filter and sort data
  const filteredData = useMemo(() => {
    let data = mockTableData.filter(row => {
      // Apply search filter
      const searchMatch = searchTerm === "" || 
        Object.values(row).some(value => 
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
      
      // Apply other filters
      if (filters.floatOptions.qcFilter && row.qc !== "GOOD") return false;
      if (filters.floatOptions.bgcOnly && !row.chlorophyll) return false;
      
      return searchMatch;
    });

    // Apply sorting
    data.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      
      if (typeof aVal === "string") {
        return sortDirection === "asc" 
          ? aVal.localeCompare(bVal as string)
          : (bVal as string).localeCompare(aVal);
      }
      
      return sortDirection === "asc" 
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number);
    });

    return data;
  }, [searchTerm, sortField, sortDirection, filters]);

  // Pagination
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleSelectRow = (id: string) => {
    setSelectedRows(prev => 
      prev.includes(id) 
        ? prev.filter(rowId => rowId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedRows(
      selectedRows.length === paginatedData.length 
        ? [] 
        : paginatedData.map(row => row.id)
    );
  };

  const ExportDialog = () => (
    <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
      <DialogContent className="max-w-md bg-gradient-to-br from-blue-50 to-cyan-50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="w-5 h-5 text-blue-600" />
            Export Data
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-sm text-slate-600">
            Exporting {selectedRows.length > 0 ? selectedRows.length : filteredData.length} records
          </div>
          
          <div className="space-y-3">
            <Button className="w-full justify-start bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white">
              <FileText className="w-4 h-4 mr-2" />
              CSV Format (Excel Compatible)
            </Button>
            <Button className="w-full justify-start bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white">
              <Database className="w-4 h-4 mr-2" />
              NetCDF Format (Scientific)
            </Button>
            <Button className="w-full justify-start bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
              <FileText className="w-4 h-4 mr-2" />
              ASCII Format (Plain Text)
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  const AIInsightsPanel = () => {
    if (!showAIInsights) return null;

    return (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
      >
        <Card className="shadow-lg border-0 bg-gradient-to-r from-purple-50/80 to-pink-50/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Brain className="w-4 h-4 text-purple-600" />
              AI Data Insights
              <Badge variant="outline" className="text-xs bg-purple-100 text-purple-700">
                Live Analysis
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-white/60 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-3 h-3 text-purple-500" />
                <span className="text-sm font-medium">Temperature Patterns</span>
              </div>
              <div className="text-xs text-slate-600">
                Strong thermal stratification detected across all active floats. North Atlantic shows 
                0.3°C warming trend in surface waters compared to historical averages.
              </div>
            </div>
            
            <div className="bg-white/60 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-3 h-3 text-blue-500" />
                <span className="text-sm font-medium">Salinity Anomalies</span>
              </div>
              <div className="text-xs text-slate-600">
                2 floats show salinity values outside normal range. Float #5906301 indicates 
                possible freshwater intrusion in the North Pacific region.
              </div>
            </div>
            
            <div className="bg-white/60 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-3 h-3 text-green-500" />
                <span className="text-sm font-medium">Data Quality Summary</span>
              </div>
              <div className="text-xs text-slate-600">
                97% of measurements pass quality control. Recommend reviewing Float #5906304 
                for potential sensor calibration issues.
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      <ScrollArea className="flex-1">
        <div className="space-y-4">
      {/* Table Controls */}
      <Collapsible open={showFilters} onOpenChange={setShowFilters}>
        <Card className="shadow-lg border-0 bg-white/60 backdrop-blur-sm">
          <CollapsibleTrigger asChild>
            <CardHeader className="pb-3 cursor-pointer hover:bg-white/10 transition-all duration-200">
              <CardTitle className="text-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Filter className="w-4 h-4 text-blue-600" />
                  Data Table Controls
                  <Badge variant="outline" className="text-xs bg-gradient-to-r from-blue-100 to-cyan-100">
                    {filteredData.length} records
                  </Badge>
                </div>
                {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <Label className="text-sm text-slate-600 mb-2 block">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      placeholder="Search floats, regions, or measurements..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-white/80"
                    />
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm text-slate-600 mb-2 block">Items per page</Label>
                  <Select value={itemsPerPage.toString()} onValueChange={(v) => setItemsPerPage(Number(v))}>
                    <SelectTrigger className="bg-white/80">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 rows</SelectItem>
                      <SelectItem value="10">10 rows</SelectItem>
                      <SelectItem value="25">25 rows</SelectItem>
                      <SelectItem value="50">50 rows</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end gap-2">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="ai-insights"
                      checked={showAIInsights}
                      onCheckedChange={setShowAIInsights}
                    />
                    <Label htmlFor="ai-insights" className="text-sm">
                      <Brain className="w-3 h-3 inline mr-1" />
                      AI Insights
                    </Label>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-xs text-slate-600 flex items-center gap-4">
                  <span>📊 {filteredData.length} total records</span>
                  <span>✅ {selectedRows.length} selected</span>
                  <span>🔄 Last updated: 2 min ago</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Refresh
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowExportDialog(true)}
                    disabled={filteredData.length === 0}
                  >
                    <Download className="w-3 h-3 mr-1" />
                    Export
                  </Button>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* AI Insights Panel */}
      <AnimatePresence>
        {showAIInsights && <AIInsightsPanel />}
      </AnimatePresence>

      {/* Data Table */}
      <Card className="flex-1 shadow-xl border-0 bg-white/60 backdrop-blur-sm overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-blue-600" />
              ARGO Float Data Explorer
            </div>
            <div className="text-xs text-slate-600">
              Page {currentPage} of {totalPages}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-auto max-h-96">
            <Table>
              <TableHeader className="bg-white/80 sticky top-0 z-10">
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedRows.length === paginatedData.length && paginatedData.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-slate-100/50"
                    onClick={() => handleSort("id")}
                  >
                    <div className="flex items-center gap-1">
                      Float ID
                      {sortField === "id" && (
                        sortDirection === "asc" ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-slate-100/50"
                    onClick={() => handleSort("date")}
                  >
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Date
                      {sortField === "date" && (
                        sortDirection === "asc" ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      Position
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-slate-100/50"
                    onClick={() => handleSort("temperature")}
                  >
                    <div className="flex items-center gap-1">
                      <Thermometer className="w-3 h-3 text-red-500" />
                      Temp (°C)
                      {sortField === "temperature" && (
                        sortDirection === "asc" ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-slate-100/50"
                    onClick={() => handleSort("salinity")}
                  >
                    <div className="flex items-center gap-1">
                      <Droplets className="w-3 h-3 text-blue-500" />
                      Salinity
                      {sortField === "salinity" && (
                        sortDirection === "asc" ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-slate-100/50"
                    onClick={() => handleSort("depth")}
                  >
                    <div className="flex items-center gap-1">
                      <Activity className="w-3 h-3 text-green-500" />
                      Depth (m)
                      {sortField === "depth" && (
                        sortDirection === "asc" ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead className="w-12">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {paginatedData.map((row, index) => (
                    <motion.tr
                      key={row.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: index * 0.05 }}
                      className={`hover:bg-white/60 transition-colors ${
                        selectedRows.includes(row.id) ? "bg-blue-50/80" : ""
                      }`}
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedRows.includes(row.id)}
                          onCheckedChange={() => handleSelectRow(row.id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">#{row.id}</TableCell>
                      <TableCell className="text-xs">{row.date}</TableCell>
                      <TableCell className="text-xs">
                        {row.lat.toFixed(1)}°, {row.lng.toFixed(1)}°
                      </TableCell>
                      <TableCell className="text-xs font-medium">{row.temperature}</TableCell>
                      <TableCell className="text-xs font-medium">{row.salinity}</TableCell>
                      <TableCell className="text-xs font-medium">{row.depth}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Badge 
                            variant={row.status === "active" ? "outline" : "secondary"} 
                            className="text-xs"
                          >
                            {row.status === "active" ? (
                              <CheckCircle className="w-2 h-2 mr-1 text-green-500" />
                            ) : (
                              <AlertTriangle className="w-2 h-2 mr-1 text-yellow-500" />
                            )}
                            {row.status}
                          </Badge>
                          {row.qc !== "GOOD" && (
                            <Badge variant="destructive" className="text-xs">
                              {row.qc}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs">{row.region}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-3 h-3" />
                        </Button>
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      <Card className="shadow-lg border-0 bg-white/60 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-600">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} entries
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className={currentPage === page ? "bg-gradient-to-r from-blue-500 to-cyan-500" : ""}
                    >
                      {page}
                    </Button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

          <ExportDialog />
        </div>
      </ScrollArea>
    </div>
  );
}