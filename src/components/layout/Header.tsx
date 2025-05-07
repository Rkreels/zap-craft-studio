
import { Search, HelpCircle, Grid, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search..."
            className="pl-9 pr-4 py-1.5 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        <button className="text-gray-700 hover:text-gray-900 flex items-center gap-1">
          <HelpCircle size={18} />
          <span>Help</span>
        </button>
        <button className="text-gray-700 hover:text-gray-900 flex items-center gap-1">
          <Grid size={18} />
          <span>Explore Apps</span>
        </button>
      </div>
      
      <div className="flex items-center space-x-4">
        <Button variant="outline" className="text-gray-700 border-gray-300">
          Contact Sales
        </Button>
        <Button className="bg-purple-600 hover:bg-purple-700 text-white">
          Upgrade
        </Button>
        <button className="text-gray-700 p-1.5 rounded-md hover:bg-gray-100">
          <Bell size={20} />
        </button>
        <button className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center hover:ring-2 hover:ring-gray-300">
          <span className="text-sm font-medium">JD</span>
        </button>
      </div>
    </header>
  );
};
