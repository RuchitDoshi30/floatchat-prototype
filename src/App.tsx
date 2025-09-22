import { useState } from "react";
import { Button } from "./components/ui/button";
import { Header } from "./components/Header";
import { FloatchatMain } from "./components/FloatchatMain";
import { ChatbotPage } from "./components/ChatbotPage";
import { DashboardMapView } from "./components/DashboardMapView";
import { DashboardProfileView } from "./components/DashboardProfileView";
import { DashboardDataTable } from "./components/DashboardDataTable";
import { FilterProvider } from "./components/FilterContext";
import {
  MessageCircle,
  Home,
  Map,
  TrendingUp,
  Database,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

type Page = "main" | "chat" | "map" | "profiles" | "data";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("main");

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "main":
        return <FloatchatMain />;
      case "chat":
        return (
          <ChatbotPage onBack={() => setCurrentPage("main")} />
        );
      case "map":
        return (
          <div className="h-full flex flex-col">
            <div className="flex-shrink-0 p-4 bg-white/40 backdrop-blur-sm border-b border-white/20">
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  onClick={() => setCurrentPage("main")}
                  className="hover:bg-white/60"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Back to Floatchat
                </Button>
                <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  Interactive Ocean Map
                </h1>
                <div></div>
              </div>
            </div>
            <div className="flex-1">
              <DashboardMapView />
            </div>
          </div>
        );
      case "profiles":
        return (
          <div className="h-full flex flex-col">
            <div className="flex-shrink-0 p-4 bg-white/40 backdrop-blur-sm border-b border-white/20">
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  onClick={() => setCurrentPage("main")}
                  className="hover:bg-white/60"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Back to Floatchat
                </Button>
                <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  Profile Analysis
                </h1>
                <div></div>
              </div>
            </div>
            <div className="flex-1">
              <DashboardProfileView />
            </div>
          </div>
        );
      case "data":
        return (
          <div className="h-full flex flex-col">
            <div className="flex-shrink-0 p-4 bg-white/40 backdrop-blur-sm border-b border-white/20">
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  onClick={() => setCurrentPage("main")}
                  className="hover:bg-white/60"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Back to Floatchat
                </Button>
                <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  Data Explorer
                </h1>
                <div></div>
              </div>
            </div>
            <div className="flex-1">
              <DashboardDataTable />
            </div>
          </div>
        );
    }
  };

  return (
    <FilterProvider>
      <div className="h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-purple-50 flex flex-col overflow-hidden">
        {/* Navigation Header - Only show on main page */}
        {currentPage === "main" && (
          <div className="flex-shrink-0">
            <Header />
            {/* Navigation Bar */}
            <div className="p-4 pb-2">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
                        <Home className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                          Floatchat Dashboard
                        </h1>
                        <p className="text-sm text-slate-600">
                          AI-powered ocean data exploration
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage("map")}
                      className="hover:bg-blue-50 hover:border-blue-300"
                    >
                      <Map className="w-4 h-4 mr-2" />
                      Ocean Map
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage("profiles")}
                      className="hover:bg-blue-50 hover:border-blue-300"
                    >
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Profile Analysis
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage("data")}
                      className="hover:bg-blue-50 hover:border-blue-300"
                    >
                      <Database className="w-4 h-4 mr-2" />
                      Data Explorer
                    </Button>
                    <Button
                      onClick={() => setCurrentPage("chat")}
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      AI Assistant
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {renderCurrentPage()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Enhanced Animated Background Elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-400/15 to-cyan-400/15 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/15 to-pink-400/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-3/4 left-1/2 w-48 h-48 bg-gradient-to-r from-teal-400/15 to-emerald-400/15 rounded-full blur-3xl animate-pulse delay-2000"></div>
          <div className="absolute top-1/2 right-1/6 w-32 h-32 bg-gradient-to-r from-coral-400/10 to-orange-400/10 rounded-full blur-2xl animate-pulse delay-3000"></div>
        </div>
      </div>
    </FilterProvider>
  );
}