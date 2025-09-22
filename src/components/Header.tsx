import { Button } from "./ui/button";
import { Settings, User } from "lucide-react";

export function Header() {
  return (
    <header className="h-16 bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600 border-b border-white/10 backdrop-blur-sm">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
            <div className="w-5 h-5 bg-white rounded-full"></div>
          </div>
          <h1 className="text-white text-xl font-semibold">Floatchat</h1>
          <span className="text-white/70 text-sm">AI Ocean Data Explorer</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
            <Settings className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
            <User className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}