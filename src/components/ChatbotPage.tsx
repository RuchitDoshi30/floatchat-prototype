import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { 
  MessageCircle, Send, Bot, User, Sparkles, TrendingUp, 
  MapPin, Database, RefreshCw, ChevronRight, Lightbulb,
  Clock, BarChart3, Globe, Waves, ArrowLeft, Settings,
  Zap, Activity, Thermometer, Droplets
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

const suggestedQueries = [
  "Show me temperature trends in the North Atlantic",
  "Which BGC floats are active in the Pacific?",
  "Compare salinity profiles from different regions",
  "What's the deepest measurement this month?",
  "Export data for floats near the Gulf Stream",
  "Show me quality control issues",
  "Analyze oxygen levels in the Southern Ocean",
  "Find floats with unusual temperature patterns"
];

const contextualSuggestions = [
  "Analyze this float's trajectory pattern",
  "Compare with nearby floats",
  "Show temperature trend over time",
  "Export this float's data",
  "What's unusual about this measurement?",
  "Predict next profile location",
  "Check data quality indicators",
  "Show biogeochemical parameters"
];

type QuickActionLabel =
  | "Trend Analysis"
  | "Geographic Search"
  | "Statistical Summary"
  | "Data Export"
  | "Quality Control"
  | "Global Overview";

interface QuickAction {
  icon: React.ElementType;
  label: QuickActionLabel;
  color: string;
}

const quickActions: QuickAction[] = [
  { icon: TrendingUp, label: "Trend Analysis", color: "blue" },
  { icon: MapPin, label: "Geographic Search", color: "green" },
  { icon: BarChart3, label: "Statistical Summary", color: "purple" },
  { icon: Database, label: "Data Export", color: "orange" },
  { icon: Activity, label: "Quality Control", color: "red" },
  { icon: Globe, label: "Global Overview", color: "cyan" }
];

interface ChatbotPageProps {
  onBack: () => void;
}

export function ChatbotPage({ onBack }: ChatbotPageProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "assistant",
      content: "🌊 **Welcome to Floatchat AI!**\n\nI'm your intelligent assistant for exploring ARGO ocean data. I can help you:\n\n• **Analyze** float trajectories and oceanographic patterns\n• **Compare** measurements across different regions and time periods\n• **Identify** trends and anomalies in ocean data\n• **Export** data in multiple formats (CSV, NetCDF, ASCII)\n• **Generate** insights and summaries from complex datasets\n\nWhat oceanographic question can I help you explore today?",
      timestamp: new Date(),
      suggestions: suggestedQueries.slice(0, 4)
    }
  ]);
  
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: content.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);
    setShowSuggestions(false);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: generateAIResponse(content),
        timestamp: new Date(),
        suggestions: Math.random() > 0.3 ? contextualSuggestions.slice(0, 4) : undefined
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const generateAIResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes("temperature")) {
      return "🌡️ **Temperature Analysis Complete**\n\nI've analyzed temperature data from 127 active floats with recent measurements:\n\n**Key Findings:**\n• North Atlantic: +0.3°C warming trend over 6 months\n• Southern Ocean: Stable temperatures (4-8°C range)\n• Float #5906298: Interesting thermal stratification at 500m\n• Arctic waters: Warming signal detected in upper 100m\n\n**Notable Patterns:**\n• Seasonal thermocline deepening in subtropical regions\n• Cold water intrusion observed near Labrador Current\n• Surface temperature anomalies correlate with recent wind patterns\n\nWould you like me to generate detailed temperature profiles or export the analysis data?";
    }
    
    if (lowerQuery.includes("bgc") || lowerQuery.includes("biogeochemical")) {
      return "🔬 **BGC Float Network Status**\n\nCurrently monitoring **43 biogeochemical floats** across all ocean basins:\n\n**Active Regions:**\n• Pacific: 18 floats (strong phytoplankton signal near Kuroshio)\n• Atlantic: 15 floats (oxygen minimum zones detected)\n• Indian: 7 floats (seasonal productivity patterns)\n• Southern: 3 floats (carbon cycle monitoring)\n\n**Recent Discoveries:**\n• Chlorophyll-a bloom detected in North Pacific (Float #WMO6901234)\n• Oxygen depletion at 200-800m depth in Arabian Sea\n• Unusual nitrate patterns suggest subsurface water mass changes\n\n**Data Quality:** 97% of BGC measurements pass QC checks\n\nShall I dive deeper into specific BGC parameters or regional analysis?";
    }
    
    if (lowerQuery.includes("salinity")) {
      return "🧂 **Salinity Analysis Dashboard**\n\nProcessed salinity measurements from **3,847 active floats**:\n\n**Regional Highlights:**\n• **Mediterranean Outflow**: High-salinity signature (>38 PSU) at 800-1200m\n• **Arctic Freshening**: -0.2 PSU trend in Beaufort Gyre over 2 years\n• **Subtropical Gyres**: Stable high-salinity cores (>36.5 PSU)\n• **Equatorial Pacific**: Fresh water intrusion from recent precipitation\n\n**Anomaly Detection:**\n• 3 floats showing unusual salinity spikes (sensor drift suspected)\n• Fresh water lenses detected in tropical Atlantic\n• Strong halocline identified in Nordic Seas\n\n**Water Mass Analysis:**\n• North Atlantic Deep Water: 34.9-35.0 PSU signature confirmed\n• Antarctic Intermediate Water: Clear 34.3-34.4 PSU band\n\nWould you like detailed salinity-temperature diagrams or water mass classification?";
    }
    
    if (lowerQuery.includes("export") || lowerQuery.includes("download")) {
      return "📊 **Data Export Center**\n\nI can prepare your oceanographic data in multiple professional formats:\n\n**Available Formats:**\n\n🔹 **CSV Format**\n   • Spreadsheet-compatible\n   • Ideal for statistical analysis\n   • Custom column selection\n\n🔹 **NetCDF Format**\n   • Scientific standard with full metadata\n   • CF-compliant structure\n   • Includes quality flags and processing history\n\n🔹 **ASCII Text**\n   • Simple columnar format\n   • Compatible with legacy systems\n   • Customizable delimiters\n\n**Filter Options:**\n• Date range selection\n• Depth level filtering\n• Parameter selection (TEMP, PSAL, PRES, BGC)\n• Geographic bounding box\n• Quality flag filtering\n\n**Export Size Estimates:**\n• Selected data: ~2.3 MB\n• Processing time: 15-30 seconds\n\nWhich format would you prefer, and do you need any specific filtering applied?";
    }
    
    if (lowerQuery.includes("trajectory") || lowerQuery.includes("path")) {
      return "🛰️ **Float Trajectory Analysis**\n\nAnalyzing movement patterns for selected floats:\n\n**Trajectory Statistics:**\n• **Total Distance**: 1,247 km over 45 days\n• **Average Speed**: 0.29 m/s (including drift)\n• **Current Direction**: Following Gulf Stream northeastern branch\n\n**Movement Characteristics:**\n• Caught in mesoscale eddy (clockwise circulation)\n• Surface velocity: ~0.15 m/s\n• Depth-averaged flow: 0.08 m/s eastward\n• Predicted next position: 41.2°N, 32.8°W\n\n**Environmental Context:**\n• Sea surface temperature gradient driving eddy formation\n• Wind stress correlation coefficient: 0.73\n• Consistent with winter circulation patterns\n\n**Predictive Modeling:**\n• 95% confidence interval for 7-day forecast\n• Likely to exit eddy system within 12 days\n• Expected to rejoin main Gulf Stream flow\n\nWould you like detailed trajectory plots or comparison with other floats in the region?";
    }
    
    if (lowerQuery.includes("quality") || lowerQuery.includes("qc")) {
      return "✅ **Data Quality Control Report**\n\n**Overall System Health:** 94.2% pass rate\n\n**Quality Metrics:**\n• **Temperature**: 97.8% good data\n• **Salinity**: 93.1% good data (3 sensor drift cases)\n• **Pressure**: 99.2% good data\n• **BGC Parameters**: 91.5% good data\n\n**Flagged Issues:**\n🚩 **Float #5906304**: Pressure sensor outliers detected\n🚩 **Float #5906289**: Salinity drift >0.01 PSU/month\n🚩 **Float #5906156**: Temperature spikes in surface layer\n\n**Automated QC Results:**\n• Gross range checks: 99.8% pass\n• Spike detection: 96.7% pass\n• Gradient tests: 94.2% pass\n• Climatology comparison: 93.8% pass\n\n**Manual Review Queue:**\n• 23 profiles pending expert review\n• Average review time: 2.1 days\n• Priority flags: 3 urgent cases\n\n**Recommended Actions:**\n• Schedule maintenance for 3 floats\n• Update regional climatology references\n• Implement enhanced BGC QC procedures\n\nWould you like detailed QC reports for specific floats or parameters?";
    }
    
    if (lowerQuery.includes("deep") || lowerQuery.includes("depth")) {
      return "🌊 **Deep Ocean Exploration**\n\n**Depth Coverage Summary:**\n• **Maximum Depth This Month**: 2,100m (Float #5906301)\n• **Average Profile Depth**: 1,850m\n• **Deep Water Measurements**: 15,847 profiles >1,500m\n\n**Abyssal Ocean Conditions:**\n• **Temperature Range**: 1.8°C - 4.2°C\n• **Salinity Range**: 34.6 - 34.8 PSU\n• **Pressure Accuracy**: ±2 dbar at 2000m\n\n**Notable Deep Features:**\n🔹 **Labrador Sea Deep Convection**\n   • Winter mixing reaching 1,800m depth\n   • Temperature: 3.2°C at maximum depth\n   • Oxygen-rich water formation observed\n\n🔹 **Overflow Waters**\n   • Denmark Strait: Dense water cascading\n   • Mediterranean Outflow: 1,000m depth signature\n   • Antarctic Bottom Water: <2°C in Southern Ocean\n\n🔹 **Deep Current Systems**\n   • North Atlantic Deep Water circulation\n   • Antarctic Circumpolar Current deep layers\n   • Pacific Deep Water mass characteristics\n\n**Research Implications:**\n• Deep ocean warming signals detected\n• Carbon sequestration in deep layers\n• Thermohaline circulation monitoring\n\nWould you like specific deep water mass analysis or vertical profile comparisons?";
    }

    if (lowerQuery.includes("oxygen") || lowerQuery.includes("o2")) {
      return "💨 **Oxygen Analysis Report**\n\n**Dissolved Oxygen Overview:**\nAnalyzing data from **28 BGC floats** with oxygen sensors:\n\n**Oxygen Minimum Zones (OMZs):**\n• **Arabian Sea**: Severe depletion <5 μmol/kg at 200-800m\n• **Eastern Pacific**: Expanding OMZ detected off Peru\n• **Bay of Bengal**: Seasonal oxygen variability observed\n\n**Notable Findings:**\n🔴 **Critical Hypoxic Events**\n   • Float #5906421: O₂ <2 μmol/kg at 450m depth\n   • Duration: 15-day monitoring period\n   • Correlation with high productivity surface waters\n\n🟡 **Seasonal Patterns**\n   • Monsoon-driven oxygen fluctuations\n   • Deep water renewal in winter months\n   • Surface oxygen supersaturation during blooms\n\n**Biological Implications:**\n• Marine ecosystem stress indicators\n• Fish habitat compression zones\n• Nitrogen cycling modifications\n\n**Climate Connections:**\n• Ocean warming reduces oxygen solubility\n• Stratification impacts oxygen ventilation\n• Links to global carbon cycle\n\nShall I provide detailed oxygen profiles or ecosystem impact analysis?";
    }

    if (lowerQuery.includes("unusual") || lowerQuery.includes("anomaly")) {
      return "🔍 **Anomaly Detection Results**\n\n**Automated Anomaly Screening:**\nScanned **2.3M measurements** from the past 30 days\n\n**Temperature Anomalies:**\n🌡️ **Thermal Inversions**\n   • Float #5906298: Warm layer at 300m (unusual for region)\n   • 2.5°C above seasonal climatology\n   • Possible subsurface eddy influence\n\n🌡️ **Cold Water Intrusions**\n   • Nordic Seas: Unexpected 1.8°C at 150m\n   • Likely related to enhanced mixing event\n   • Correlation with recent storm activity\n\n**Salinity Anomalies:**\n🧂 **Fresh Water Patches**\n   • Tropical Atlantic: -0.8 PSU surface anomaly\n   • Consistent with increased precipitation\n   • Affecting upper 50m of water column\n\n🧂 **Salt Spikes**\n   • Mediterranean: +0.3 PSU at intermediate depths\n   • Enhanced evaporation signal detected\n   • Possible climate change indicator\n\n**BGC Anomalies:**\n🔬 **Chlorophyll Blooms**\n   • Unexpected spring bloom in Arctic waters\n   • 3x higher than historical average\n   • Early ice retreat correlation\n\n**Statistical Significance:**\n• 12 anomalies exceed 3-sigma threshold\n• 89% show environmental correlation\n• 3 cases require further investigation\n\nWould you like detailed analysis of any specific anomaly or regional patterns?";
    }
    
    // Default responses for general queries
    const responses = [
      "🤖 **AI Analysis Ready**\n\nI'm processing your query against our comprehensive ARGO database. Could you specify:\n\n• Which ocean region interests you?\n• What parameter (temperature, salinity, oxygen)?\n• Time period for analysis?\n• Specific analysis type needed?\n\n**Current Data Availability:**\n• 3,847 active floats worldwide\n• Real-time data streaming\n• 94.8% quality-controlled measurements\n• BGC sensors on 43 floats\n\nI can provide detailed analysis, statistical summaries, or custom data exports.",
      
      "🌊 **Ocean Data Intelligence**\n\nBased on our global float network, I can help you explore:\n\n**🔍 Analysis Types:**\n• Trend identification and forecasting\n• Regional comparison studies\n• Water mass characterization\n• Anomaly detection and alerts\n\n**📊 Visualization Options:**\n• Interactive depth profiles\n• Trajectory mapping\n• Time series analysis\n• Statistical distributions\n\n**💾 Export Capabilities:**\n• Scientific formats (NetCDF, CSV)\n• Custom quality filtering\n• Metadata inclusion\n• API access available\n\nWhat specific oceanographic question would you like to investigate?",
      
      "📈 **Floatchat Intelligence Engine**\n\nI have real-time access to global ocean measurements. Here's what I can analyze:\n\n**🌍 Global Coverage:**\n• All major ocean basins\n• Surface to 2,000m depth\n• Temperature, salinity, pressure\n• Biogeochemical parameters\n\n**🧠 AI Capabilities:**\n• Pattern recognition\n• Predictive modeling\n• Anomaly identification\n• Trend analysis\n\n**⚡ Instant Insights:**\n• Statistical summaries\n• Quality assessments\n• Environmental correlations\n• Research recommendations\n\nLet me know your research focus, and I'll provide targeted analysis and insights!"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  type QuickActionLabel =
    | "Trend Analysis"
    | "Geographic Search"
    | "Statistical Summary"
    | "Data Export"
    | "Quality Control"
    | "Global Overview";

  interface QuickAction {
    icon: React.ElementType;
    label: QuickActionLabel;
    color: string;
  }

  const handleQuickAction = (action: QuickAction) => {
    const actionQueries: Record<QuickActionLabel, string> = {
      "Trend Analysis": "Show me the latest temperature trends across all ocean basins",
      "Geographic Search": "Find all active floats in the North Atlantic region",
      "Statistical Summary": "Generate a statistical summary of recent oceanographic measurements",
      "Data Export": "Help me export ocean data in NetCDF format",
      "Quality Control": "Show me the current data quality status and any issues",
      "Global Overview": "Give me a comprehensive overview of the global float network"
    };
    
    handleSendMessage(actionQueries[action.label] || `Tell me about ${action.label.toLowerCase()}`);
  };

  return (
  <div className="h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-purple-50 flex flex-col overflow-auto">
      {/* Header */}
      <div className="flex-shrink-0 bg-white/40 backdrop-blur-sm border-b border-white/20 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onBack}
              className="hover:bg-white/60"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl shadow-lg">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  Floatchat AI Assistant
                </h1>
                <div className="text-sm text-slate-600 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  AI-powered ocean data analysis
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowSuggestions(!showSuggestions)}>
              <Lightbulb className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Chat Interface */}
  <div className="flex-1 flex overflow-auto p-4 gap-4">
        {/* Quick Actions Sidebar */}
        <div className="w-64 flex-shrink-0">
          <Card className="h-full shadow-xl border-0 bg-white/40 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-600" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-full">
                <div className="space-y-2">
                  {quickActions.map((action, index) => (
                    <motion.button
                      key={action.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleQuickAction(action)}
                      className="w-full p-3 text-left rounded-lg border bg-white/60 hover:bg-white/80 transition-all duration-200 flex items-center gap-3"
                    >
                      <div className={`p-2 rounded-lg bg-${action.color}-100`}>
                        <action.icon className={`w-4 h-4 text-${action.color}-600`} />
                      </div>
                      <span className="text-sm font-medium">{action.label}</span>
                    </motion.button>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Chat Area */}
        <Card className="flex-1 flex flex-col shadow-2xl border-0 bg-white/40 backdrop-blur-sm rounded-2xl overflow-hidden">
          {/* Chat Messages */}
    <CardContent className="flex-1 flex flex-col p-0 overflow-auto">
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-6">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.95 }}
                      transition={{ duration: 0.4 }}
                      className={`flex gap-4 ${message.type === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {message.type === "assistant" && (
                        <Avatar className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 flex-shrink-0">
                          <AvatarFallback className="text-white">
                            <Bot className="w-5 h-5" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      
                      <div className={`max-w-[75%] space-y-3 ${message.type === "user" ? "order-1" : ""}`}>
                        <div
                          className={`p-4 rounded-2xl shadow-lg ${
                            message.type === "user"
                              ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white ml-6"
                              : "bg-white/80 backdrop-blur-sm text-slate-800"
                          }`}
                        >
                          <div className="text-sm leading-relaxed whitespace-pre-wrap">
                            {message.content}
                          </div>
                          <div className={`text-xs mt-3 opacity-70 ${
                            message.type === "user" ? "text-blue-100" : "text-slate-500"
                          }`}>
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                        
                        {/* AI Suggestions */}
                        {message.type === "assistant" && message.suggestions && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="space-y-2 ml-14"
                          >
                            <div className="text-xs text-slate-600 font-medium">Suggested follow-ups:</div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {message.suggestions.map((suggestion, index) => (
                                <Button
                                  key={index}
                                  variant="outline"
                                  size="sm"
                                  className="h-auto p-3 text-xs text-left hover:bg-blue-50 hover:border-blue-200 transition-all duration-200 justify-start"
                                  onClick={() => handleSuggestionClick(suggestion)}
                                >
                                  <ChevronRight className="w-3 h-3 mr-2 flex-shrink-0" />
                                  <span className="truncate">{suggestion}</span>
                                </Button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </div>
                      
                      {message.type === "user" && (
                        <Avatar className="w-10 h-10 bg-gradient-to-r from-slate-400 to-slate-500 flex-shrink-0">
                          <AvatarFallback className="text-white">
                            <User className="w-5 h-5" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {/* Typing Indicator */}
                <AnimatePresence>
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex gap-4"
                    >
                      <Avatar className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500">
                        <AvatarFallback className="text-white">
                          <Bot className="w-5 h-5" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Suggestions Panel */}
            <AnimatePresence>
              {showSuggestions && messages.length === 1 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t border-slate-200/50 p-6 bg-gradient-to-r from-blue-50/50 to-cyan-50/50"
                >
                  <div className="text-sm font-medium text-slate-600 mb-4 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Explore Ocean Data - Popular Queries
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    {suggestedQueries.slice(0, 8).map((query, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        size="sm"
                        className="h-auto p-3 text-xs text-left justify-start hover:bg-white/60 transition-all duration-200"
                        onClick={() => handleSuggestionClick(query)}
                      >
                        <div className="flex items-center gap-2">
                          {index % 4 === 0 && <Thermometer className="w-3 h-3 text-red-500" />}
                          {index % 4 === 1 && <Droplets className="w-3 h-3 text-blue-500" />}
                          {index % 4 === 2 && <BarChart3 className="w-3 h-3 text-purple-500" />}
                          {index % 4 === 3 && <Activity className="w-3 h-3 text-green-500" />}
                          <span className="truncate">{query}</span>
                        </div>
                      </Button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input Area */}
            <div className="flex-shrink-0 p-6 border-t border-slate-200/50 bg-white/30 backdrop-blur-sm">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Input
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(inputValue);
                      }
                    }}
                    placeholder="Ask about ocean data, float trajectories, trends, or analysis..."
                    className="pr-12 bg-white/80 backdrop-blur-sm border-slate-200/50 focus:border-blue-300 focus:ring-blue-200/50 rounded-xl h-12"
                    disabled={isTyping}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                    {isTyping && <RefreshCw className="w-4 h-4 animate-spin text-slate-400" />}
                  </div>
                </div>
                <Button
                  onClick={() => handleSendMessage(inputValue)}
                  disabled={!inputValue.trim() || isTyping}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg rounded-xl h-12 px-6"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="flex items-center justify-between mt-3 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <Waves className="w-3 h-3" />
                  <span>Connected to Global ARGO Network</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>Real-time ocean intelligence</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Enhanced Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-400/15 to-cyan-400/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/15 to-pink-400/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-1/2 w-48 h-48 bg-gradient-to-r from-teal-400/15 to-emerald-400/15 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>
    </div>
  );
}