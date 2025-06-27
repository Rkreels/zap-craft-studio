
import { useState, useEffect } from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import { Sidebar } from "./sidebar/Sidebar";
import { Header } from "./Header";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface AppLayoutProps {
  children?: React.ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const location = useLocation();
  const isZapCreator = location.pathname.includes("/zaps/create");
  const { isAuthenticated, isLoading } = useAuth();
  
  // Load sidebar state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem("sidebarExpanded");
    if (savedState) {
      setIsSidebarExpanded(savedState === "true");
    }
  }, []);

  // Save sidebar state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("sidebarExpanded", String(isSidebarExpanded));
  }, [isSidebarExpanded]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-purple-600" />
          <p className="mt-4 text-gray-600">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} />;
  }

  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden">
      <Sidebar 
        isExpanded={isSidebarExpanded}
        setIsExpanded={setIsSidebarExpanded}
      />
      
      {/* Main content area - properly positioned with dynamic margin */}
      <div className={cn(
        "flex flex-col flex-1 transition-all duration-300 ease-in-out min-h-screen",
        isSidebarExpanded ? "ml-64" : "ml-16"
      )}>
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          {children || <Outlet />}
        </main>
        
        {/* Bottom action bar for Zap Creator */}
        {isZapCreator && (
          <div className="bg-white border-t border-gray-200 py-3 px-4 flex justify-between items-center shadow-lg">
            <div>
              <span className="text-gray-500 text-sm">Draft saved</span>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-1.5 border border-gray-300 rounded-md text-gray-700 text-sm hover:bg-gray-50">
                Cancel
              </button>
              <button className="px-4 py-1.5 bg-purple-600 text-white rounded-md text-sm hover:bg-purple-700">
                Save & Continue
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
