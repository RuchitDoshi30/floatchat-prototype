import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { Send, Bot, User, Minimize2, Lightbulb, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Message {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
  context?: any;
}

interface QuerySuggestion {
  text: string;
  category: string;
  example: boolean;
}

export function ChatInterface() {
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [conversationContext, setConversationContext] = useState<any>({});
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      content: "Hello! I'm your AI assistant for exploring ARGO ocean data. Ask me anything about temperature profiles, salinity data, or help me find specific floats! Try asking something like 'Show me temperature profiles near the equator' or click on a suggestion below.",
      timestamp: new Date()
    }
  ]);

  const querySuggestions: QuerySuggestion[] = [
    { text: "Show me salinity profiles near the equator in March 2023", category: "Spatial-Temporal", example: true },
    { text: "Compare BGC parameters in the Arabian Sea for the last 6 months", category: "Comparative", example: true },
    { text: "What are the nearest ARGO floats to this location?", category: "Proximity", example: true },
    { text: "temperature profiles", category: "Quick", example: false },
    { text: "salinity data above 500m depth", category: "Quick", example: false },
    { text: "BGC floats in Pacific Ocean", category: "Quick", example: false },
    { text: "Show only depth > 200m", category: "Filter", example: false },
    { text: "Export current data as CSV", category: "Action", example: false },
  ];

  const getFilteredSuggestions = () => {
    if (!message) return querySuggestions.filter(s => s.example);
    return querySuggestions.filter(s => 
      s.text.toLowerCase().includes(message.toLowerCase())
    ).slice(0, 6);
  };

  const sendMessage = (messageText?: string) => {
    const queryText = messageText || message;
    if (!queryText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: queryText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage("");
    setShowSuggestions(false);
    setIsTyping(true);

    // Update conversation context based on query
    const newContext = { ...conversationContext };
    if (queryText.toLowerCase().includes('depth')) {
      newContext.lastDepthQuery = queryText;
    }
    if (queryText.toLowerCase().includes('temperature') || queryText.toLowerCase().includes('temp')) {
      newContext.lastTempQuery = queryText;
    }
    if (queryText.toLowerCase().includes('salinity')) {
      newContext.lastSalinityQuery = queryText;
    }
    setConversationContext(newContext);

    // Simulate intelligent bot response with context awareness
    setTimeout(() => {
      let response = "";
      const lowerQuery = queryText.toLowerCase();
      
      if (lowerQuery.includes('temperature') && lowerQuery.includes('equator')) {
        response = `🌊 **Temperature Analysis Near Equator**\n\nI found 47 ARGO floats with temperature data near the equatorial region. Here's what I discovered:\n\n• **Average surface temperature**: 28.3°C\n• **Temperature range**: 24.1°C to 29.8°C\n• **Depth analysis**: Thermocline typically found at 120-150m depth\n• **Seasonal pattern**: Higher temps in Mar-May\n\n*Tip: Try asking "Show only depth > 200m" to filter deeper measurements.*`;
      } else if (lowerQuery.includes('bgc') && lowerQuery.includes('arabian')) {
        response = `🧪 **BGC Parameters - Arabian Sea Analysis**\n\nAnalyzing 23 BGC-enabled floats in the Arabian Sea over the last 6 months:\n\n• **Chlorophyll-a**: Peak bloom detected in February (avg: 2.4 mg/m³)\n• **Dissolved Oxygen**: Low oxygen zone confirmed at 200-800m depth\n• **Particulate Backscatter**: Elevated levels near coastal regions\n• **CDOM**: Higher absorption in northern Arabian Sea\n\n*Data quality: 91% passed QC checks*`;
      } else if (lowerQuery.includes('nearest') && lowerQuery.includes('location')) {
        response = `📍 **Nearby ARGO Floats**\n\nBased on your current map view, I found these nearby active floats:\n\n• **Float #5906298**: 12.3 km away (Active, last profile: 2 days ago)\n• **Float #5906301**: 28.7 km away (Active, BGC-enabled)\n• **Float #5906299**: 45.1 km away (Active, deep profiles to 2000m)\n\nClick on any float marker on the map to see detailed profiles!`;
      } else if (lowerQuery.includes('depth > 200')) {
        response = `🔍 **Filtering by Depth > 200m**\n\nApplied depth filter based on your previous query context. Found:\n\n• **1,234 measurements** below 200m depth\n• **Temperature range**: 4.2°C to 18.7°C\n• **Salinity range**: 34.8 to 36.2 PSU\n• **Pressure range**: 20.3 to 203.1 dbar\n\nThe data table and profiles have been updated to show only deep measurements.`;
      } else {
        response = `🤖 **AI Analysis Complete**\n\nI've processed your query: "${queryText}"\n\n• **Database search**: Found relevant ARGO float data\n• **Quality control**: Applied standard QC filters\n• **Geographic scope**: ${Math.floor(Math.random() * 200 + 50)} floats identified\n• **Time range**: Latest available profiles\n\n*Try asking more specific questions about temperature, salinity, or BGC parameters for detailed insights!*`;
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: response,
        timestamp: new Date(),
        context: newContext
      };
      
      setIsTyping(false);
      setMessages(prev => [...prev, botMessage]);
    }, 1500 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      // Could implement suggestion navigation here
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMessage(value);
    setShowSuggestions(value.length > 0);
  };

  const selectSuggestion = (suggestion: QuerySuggestion) => {
    setMessage(suggestion.text);
    setShowSuggestions(false);
    sendMessage(suggestion.text);
  };

  useEffect(() => {
    if (!isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isMinimized]);

  if (isMinimized) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button
          onClick={() => setIsMinimized(false)}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg text-white"
        >
          <Bot className="w-6 h-6" />
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-6 right-6 z-50 w-96 h-[500px]"
    >
      <Card className="h-full shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="pb-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <Bot className="w-4 h-4" />
              AI Assistant
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMinimized(true)}
              className="text-white hover:bg-white/20 h-6 w-6"
            >
              <Minimize2 className="w-3 h-3" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-0 h-full flex flex-col">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-3">
              <AnimatePresence>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`flex items-start space-x-2 max-w-[80%] ${msg.type === "user" ? "flex-row-reverse space-x-reverse" : ""}`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs ${
                        msg.type === "user" 
                          ? "bg-gradient-to-r from-blue-500 to-cyan-500" 
                          : "bg-gradient-to-r from-purple-500 to-pink-500"
                      }`}>
                        {msg.type === "user" ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                      </div>
                      <div className={`rounded-lg p-3 text-sm ${
                        msg.type === "user"
                          ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                          : "bg-slate-100 text-slate-800"
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </ScrollArea>
          
          <div className="p-4 border-t bg-slate-50/50 relative">
            {/* Query Suggestions */}
            <AnimatePresence>
              {(showSuggestions || (!message && messages.length === 1)) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-full left-4 right-4 mb-2 bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto z-10"
                >
                  <div className="p-2">
                    <div className="flex items-center gap-2 mb-2 text-xs text-slate-600">
                      <Lightbulb className="w-3 h-3" />
                      {message ? "Suggestions" : "Try these examples"}
                    </div>
                    <div className="space-y-1">
                      {getFilteredSuggestions().map((suggestion, index) => (
                        <motion.button
                          key={`${suggestion.text}-${index}`}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => selectSuggestion(suggestion)}
                          className="w-full text-left p-2 text-sm hover:bg-blue-50 rounded flex items-center justify-between group transition-colors"
                        >
                          <span className="truncate">{suggestion.text}</span>
                          <Badge variant="outline" className="text-xs opacity-60 group-hover:opacity-100">
                            {suggestion.category}
                          </Badge>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Typing Indicator */}
            <AnimatePresence>
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 mb-2 text-sm text-slate-600"
                >
                  <div className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                    <Bot className="w-2 h-2 text-white" />
                  </div>
                  <span>AI is analyzing your query</span>
                  <div className="flex space-x-1">
                    <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input Area */}
            <div className="flex space-x-2">
              <Input
                ref={inputRef}
                value={message}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                onFocus={() => setShowSuggestions(message.length > 0)}
                placeholder="Ask about ocean data, profiles, floats..."
                className="flex-1 bg-white"
              />
              <Button
                onClick={() => sendMessage()}
                disabled={!message.trim() || isTyping}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white disabled:opacity-50"
              >
                {isTyping ? (
                  <Sparkles className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
            
            {/* Context Indicator */}
            {Object.keys(conversationContext).length > 0 && (
              <div className="flex gap-1 mt-2">
                {conversationContext.lastDepthQuery && (
                  <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                    Depth context active
                  </Badge>
                )}
                {conversationContext.lastTempQuery && (
                  <Badge variant="outline" className="text-xs bg-red-50 text-red-700">
                    Temperature context
                  </Badge>
                )}
                {conversationContext.lastSalinityQuery && (
                  <Badge variant="outline" className="text-xs bg-cyan-50 text-cyan-700">
                    Salinity context
                  </Badge>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}