import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { 
  MessageCircle, Send, Bot, User, Sparkles, TrendingUp, 
  MapPin, Database, RefreshCw, ChevronRight, Lightbulb,
  Clock, BarChart3, Globe, Waves
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
];

const contextualSuggestions = [
  "Analyze this float's trajectory pattern",
  "Compare with nearby floats",
  "Show temperature trend over time",
  "Export this float's data",
  "What's unusual about this measurement?",
  "Predict next profile location",
];

export function DedicatedChatPanel() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "assistant",
      content: "Welcome to Floatchat! I'm your AI assistant for exploring ARGO ocean data. I can help you analyze float trajectories, compare measurements, identify trends, and export data. What would you like to discover today?",
      timestamp: new Date(),
      suggestions: suggestedQueries.slice(0, 3)
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
        suggestions: Math.random() > 0.5 ? contextualSuggestions.slice(0, 3) : undefined
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const generateAIResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes("temperature")) {
      return "🌡️ **Temperature Analysis**: I found 127 active floats with recent temperature measurements. The North Atlantic shows a warming trend of +0.3°C over the past 6 months, while the Southern Ocean maintains stable temperatures around 4-8°C. Float #5906298 shows particularly interesting thermal layering at 500m depth. Would you like me to generate a detailed temperature profile comparison?";
    }
    
    if (lowerQuery.includes("bgc") || lowerQuery.includes("biogeochemical")) {
      return "🔬 **BGC Float Analysis**: Currently tracking 43 biogeochemical floats globally. The Pacific BGC floats are showing elevated chlorophyll-a levels near the Kuroshio Current, indicating a phytoplankton bloom. Float #5906299 detected oxygen minimum zones between 200-800m depth. I can create a BGC parameter comparison chart if you'd like to explore further.";
    }
    
    if (lowerQuery.includes("salinity")) {
      return "🧂 **Salinity Profile Comparison**: Analyzing salinity data across ocean basins. The Mediterranean outflow shows characteristic high-salinity water masses (>38 PSU) at intermediate depths, while the Arctic floats indicate freshening trends due to ice melt. Notable salinity anomalies detected in 3 floats - possibly indicating water mass mixing events.";
    }
    
    if (lowerQuery.includes("export") || lowerQuery.includes("download")) {
      return "📊 **Data Export Ready**: I can prepare your data in multiple formats:\n\n• **CSV**: Spreadsheet-compatible for analysis\n• **NetCDF**: Scientific standard with metadata\n• **ASCII**: Simple text format\n\nWhich format would you prefer? I can also filter by date range, depth levels, or specific parameters (TEMP, PSAL, PRES, BGC).";
    }
    
    if (lowerQuery.includes("trajectory") || lowerQuery.includes("path")) {
      return "🛰️ **Trajectory Analysis**: The selected float has traveled 1,247 km over 45 days, following the Gulf Stream's northeastern path. Its movement pattern indicates it's caught in a mesoscale eddy, circulating clockwise at approximately 0.15 m/s. This trajectory is typical for floats in this region during winter months.";
    }
    
    if (lowerQuery.includes("quality") || lowerQuery.includes("qc")) {
      return "✅ **Quality Control Summary**: 94% of recent measurements pass quality checks. Detected 3 floats with questionable salinity spikes (likely sensor drift) and 1 float with temperature anomalies requiring manual review. Auto-flagged data includes pressure sensor outliers from Float #5906304. All BGC parameters show good data quality.";
    }
    
    if (lowerQuery.includes("deep") || lowerQuery.includes("depth")) {
      return "🌊 **Deep Ocean Analysis**: Maximum profiling depth this month: 2,100m (Float #5906301). Deep measurements reveal stable abyssal temperatures of 2-4°C and consistent salinity values of 34.6-34.8 PSU. Detected interesting deep convection signatures in the Labrador Sea with temperatures reaching down to 1,800m depth.";
    }
    
    // Default responses
    const responses = [
      "🤖 I'm analyzing your query and cross-referencing with current ARGO data. Could you be more specific about which ocean region, parameter, or time period you're interested in?",
      "🌊 Based on the current dataset, I can help you explore ocean measurements from our global float network. What specific analysis would you like me to perform?",
      "📈 I have access to real-time and historical data from 4,000+ ARGO floats worldwide. Let me know what patterns or trends you'd like to investigate!",
      "🗺️ Our global float network is providing fascinating insights into ocean dynamics. Would you like to focus on a specific region, parameter, or research question?",
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  return (
    <Card className="h-full flex flex-col shadow-2xl border-0 bg-white/40 backdrop-blur-sm rounded-2xl overflow-hidden">
      {/* Chat Header */}
      <CardHeader className="flex-shrink-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur-sm">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl shadow-lg">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Floatchat AI
              </div>
              <div className="text-xs text-slate-600 flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Online & Ready
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setShowSuggestions(!showSuggestions)}>
            <Lightbulb className="w-4 h-4" />
          </Button>
        </CardTitle>
      </CardHeader>

      {/* Chat Messages */}
      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.type === "assistant" && (
                    <Avatar className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 flex-shrink-0">
                      <AvatarFallback className="text-white">
                        <Bot className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div className={`max-w-[80%] space-y-2 ${message.type === "user" ? "order-1" : ""}`}>
                    <div
                      className={`p-3 rounded-2xl shadow-sm ${
                        message.type === "user"
                          ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white ml-4"
                          : "bg-white/80 backdrop-blur-sm text-slate-800"
                      }`}
                    >
                      <div className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </div>
                      <div className={`text-xs mt-2 opacity-70 ${
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
                        className="space-y-2 ml-11"
                      >
                        <div className="text-xs text-slate-600 font-medium">Suggested follow-ups:</div>
                        <div className="space-y-1">
                          {message.suggestions.map((suggestion, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              className="h-auto p-2 text-xs text-left hover:bg-blue-50 hover:border-blue-200 transition-all duration-200"
                              onClick={() => handleSuggestionClick(suggestion)}
                            >
                              <ChevronRight className="w-3 h-3 mr-1 flex-shrink-0" />
                              <span className="truncate">{suggestion}</span>
                            </Button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>
                  
                  {message.type === "user" && (
                    <Avatar className="w-8 h-8 bg-gradient-to-r from-slate-400 to-slate-500 flex-shrink-0">
                      <AvatarFallback className="text-white">
                        <User className="w-4 h-4" />
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
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex gap-3"
                >
                  <Avatar className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500">
                    <AvatarFallback className="text-white">
                      <Bot className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm">
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
              className="border-t border-slate-200/50 p-4 bg-gradient-to-r from-blue-50/50 to-cyan-50/50"
            >
              <div className="text-xs font-medium text-slate-600 mb-3 flex items-center gap-2">
                <Sparkles className="w-3 h-3" />
                Quick Start Suggestions
              </div>
              <div className="grid gap-2">
                {suggestedQueries.slice(0, 4).map((query, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    className="h-auto p-2 text-xs text-left justify-start hover:bg-white/60 transition-all duration-200"
                    onClick={() => handleSuggestionClick(query)}
                  >
                    <div className="flex items-center gap-2">
                      {index === 0 && <TrendingUp className="w-3 h-3 text-blue-500" />}
                      {index === 1 && <MapPin className="w-3 h-3 text-green-500" />}
                      {index === 2 && <BarChart3 className="w-3 h-3 text-purple-500" />}
                      {index === 3 && <Globe className="w-3 h-3 text-cyan-500" />}
                      <span className="truncate">{query}</span>
                    </div>
                  </Button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input Area */}
        <div className="flex-shrink-0 p-4 border-t border-slate-200/50 bg-white/30 backdrop-blur-sm">
          <div className="flex gap-2">
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
                placeholder="Ask about ocean data, float trajectories, or analysis..."
                className="pr-12 bg-white/80 backdrop-blur-sm border-slate-200/50 focus:border-blue-300 focus:ring-blue-200/50 rounded-xl"
                disabled={isTyping}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                {isTyping && <RefreshCw className="w-3 h-3 animate-spin text-slate-400" />}
              </div>
            </div>
            <Button
              onClick={() => handleSendMessage(inputValue)}
              disabled={!inputValue.trim() || isTyping}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg rounded-xl"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <Waves className="w-3 h-3" />
              <span>Connected to ARGO Global Network</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>Real-time data</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}