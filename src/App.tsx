import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { cn } from "@/lib/utils";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Classes from "./pages/Classes";
import Admin from "./pages/Admin";
import Scanner from "./pages/Scanner";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import BottomNav from "./components/BottomNav";
import { useLocation } from "react-router-dom";
import TrackProgress from "./pages/TrackProgress";

// Wrapper component to handle the bottom navigation visibility
const AppContent = () => {
  const location = useLocation();
  const showBottomNav = !["/", "/auth"].includes(location.pathname);

  return (
    <div className={cn("min-h-screen", showBottomNav && "pb-16")}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/classes" element={<Classes />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/scanner" element={<Scanner />} />
        <Route path="/track-progress" element={<TrackProgress />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {showBottomNav && <BottomNav />}
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

const queryClient = new QueryClient();

export default App;
